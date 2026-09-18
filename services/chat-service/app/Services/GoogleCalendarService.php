<?php

namespace App\Services;

use App\Models\GoogleCalendarConnection;
use Google\Client as GoogleClient;
use Google\Service\Calendar;
use Google\Service\Calendar\Event;
use Google\Service\Calendar\EventDateTime;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GoogleCalendarService
{
    /**
     * Construit un client Google authentifié à partir d'une connexion stockée,
     * en rafraîchissant automatiquement l'access_token s'il a expiré.
     */
    private function buildClient(GoogleCalendarConnection $connection): GoogleClient
    {
        $client = new GoogleClient();
        $client->setClientId(config('services.google.client_id'));
        $client->setClientSecret(config('services.google.client_secret'));

        // Si le token a expiré, on le rafraîchit
        if ($connection->isExpired()) {
            Log::info('[GoogleCalendar] Access token expired, refreshing...');

            $response = Http::asForm()->post('https://oauth2.googleapis.com/token', [
                'client_id' => config('services.google.client_id'),
                'client_secret' => config('services.google.client_secret'),
                'refresh_token' => $connection->refresh_token,
                'grant_type' => 'refresh_token',
            ]);

            if ($response->failed()) {
                Log::error('[GoogleCalendar] Refresh failed', [
                    'body' => $response->body(),
                ]);
                throw new \RuntimeException('Impossible de rafraîchir le token Google.');
            }

            $data = $response->json();

            $connection->update([
                'access_token' => $data['access_token'],
                'expires_at' => now()->addSeconds($data['expires_in'] ?? 3600),
            ]);
        }

        $client->setAccessToken($connection->access_token);

        return $client;
    }

    /**
     * Récupère les créneaux libres sur les N prochains jours.
     * Retourne un tableau de 3 créneaux max, format :
     * [
     *   ['start' => '2026-09-22T10:00:00+01:00', 'end' => '...', 'label' => 'Mardi 22 sept. à 10h00'],
     *   ...
     * ]
     */
    public function getFreeSlots(GoogleCalendarConnection $connection, int $maxSlots = 3): array
    {
        $client = $this->buildClient($connection);
        $service = new Calendar($client);

        $timezone = config('services.google.timezone', 'Africa/Casablanca');
        $now = new \DateTime('now', new \DateTimeZone($timezone));

        // On regarde les 7 prochains jours
        $timeMin = $now->format(\DateTime::RFC3339);
        $timeMax = (clone $now)->modify('+7 days')->format(\DateTime::RFC3339);

        $freebusy = new Calendar\FreeBusyRequest();
        $freebusy->setTimeMin($timeMin);
        $freebusy->setTimeMax($timeMax);
        $freebusy->setTimeZone($timezone);
        $freebusy->setItems([['id' => 'primary']]);

        $result = $service->freebusy->query($freebusy);
        $busy = $result->getCalendars()['primary']->getBusy() ?? [];

        // On génère des créneaux candidats de 30 minutes entre 9h et 18h
        $slots = [];
        $cursor = clone $now;
        $cursor->setTime(9, 0, 0);
        if ($cursor < $now) {
            $cursor->modify('+1 day');
        }

        $attempts = 0;
        while (count($slots) < $maxSlots && $attempts < 100) {
            $attempts++;

            $dayOfWeek = (int) $cursor->format('N'); // 1=lundi, 7=dimanche
            if ($dayOfWeek >= 6) { // On saute le week-end
                $cursor->modify('+1 day');
                $cursor->setTime(9, 0, 0);
                continue;
            }

            // Créneau candidat de 30 minutes
            $slotStart = clone $cursor;
            $slotEnd = (clone $cursor)->modify('+30 minutes');

            // On arrête à 18h
            if ((int) $cursor->format('H') >= 18) {
                $cursor->modify('+1 day');
                $cursor->setTime(9, 0, 0);
                continue;
            }

            // Vérifier que le créneau ne chevauche aucun busy
            if (!$this->overlaps($slotStart, $slotEnd, $busy)) {
                $slots[] = [
                    'start' => $slotStart->format(\DateTime::RFC3339),
                    'end' => $slotEnd->format(\DateTime::RFC3339),
                    'label' => $this->formatSlotLabel($slotStart),
                ];
            }

            $cursor->modify('+30 minutes');
        }

        return $slots;
    }

    private function overlaps(\DateTime $start, \DateTime $end, array $busy): bool
    {
        foreach ($busy as $period) {
            $busyStart = new \DateTime($period->getStart());
            $busyEnd = new \DateTime($period->getEnd());
            if ($start < $busyEnd && $end > $busyStart) {
                return true;
            }
        }
        return false;
    }

    private function formatSlotLabel(\DateTime $slot): string
    {
        $days = ['dimanche', 'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi'];
        $months = ['', 'janv.', 'févr.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.'];

        $dayName = $days[(int) $slot->format('w')];
        $dayNum = (int) $slot->format('j');
        $monthName = $months[(int) $slot->format('n')];
        $time = $slot->format('H\hi');

        return ucfirst("$dayName $dayNum $monthName à $time");
    }

    /**
     * Crée un événement dans le Google Calendar de l'hôtel.
     * Retourne l'ID de l'événement Google.
     */
    public function createEvent(
        GoogleCalendarConnection $connection,
        string $start,
        string $end,
        string $summary,
        string $description = ''
    ): string {
        $client = $this->buildClient($connection);
        $service = new Calendar($client);

        $timezone = config('services.google.timezone', 'Africa/Casablanca');

        $event = new Event([
            'summary' => $summary,
            'description' => $description,
        ]);

        $event->setStart(new EventDateTime([
            'dateTime' => $start,
            'timeZone' => $timezone,
        ]));
        $event->setEnd(new EventDateTime([
            'dateTime' => $end,
            'timeZone' => $timezone,
        ]));

        $created = $service->events->insert('primary', $event);

        return $created->getId();
    }
}
