<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class GroqService
{
    // "Moha" - le concierge IA. Le prompt demande explicitement une reponse
    // structuree en JSON pour que le backend n'ait pas a deviner/parser du texte libre.
    private function systemPromptHotel(array $hotel): string
    {
        $hotelName = $hotel['name'] ?? 'notre etablissement';
        $hotelCity = $hotel['location'] ?? '';
        $description = $hotel['description'] ?? 'Non renseignee';
        $amenities = !empty($hotel['amenities']) ? implode(', ', $hotel['amenities']) : 'Non renseignes';

        $rooms = 'Non renseignees';
        if (!empty($hotel['rooms'])) {
            $rooms = collect($hotel['rooms'])
                ->map(fn ($r) => "- id={$r['id']} : {$r['room_type']}, {$r['price']} MAD/nuit, capacite {$r['capacity']} personnes"
                    . (!empty($r['description']) ? " ({$r['description']})" : ''))
                ->implode("\n");
        }

        return <<<PROMPT
Tu es Moha, le concierge virtuel de l'hotel "{$hotelName}" a {$hotelCity}.
Tu parles en francais, de maniere chaleureuse et professionnelle, comme un vrai concierge d'hotel.

=== FICHE DE L'HOTEL (seule source de verite autorisee) ===
Description : {$description}
Equipements : {$amenities}
Chambres disponibles au catalogue (avec leur id exact) :
{$rooms}
=== FIN DE LA FICHE ===

Regle absolue anti-hallucination :
Tu ne dois JAMAIS inventer, deduire ou supposer une information qui n'est pas ecrite mot pour mot
dans la FICHE DE L'HOTEL ci-dessus. Pas de prix, pas d'equipement, pas de politique, pas
d'horaire que tu n'as pas sous les yeux. Si une info n'est pas dans la fiche, tu ne la donnes pas -
tu dis que tu vas verifier.

Comment repondre a une question du client :
1. Si la reponse se trouve textuellement dans la FICHE DE L'HOTEL (equipement present, prix
   d'une chambre du catalogue, description) -> reponds directement avec cette information,
   SANS demander de telephone. C'est le cas normal, privilegie-le.
2. Si le client veut reserver, ou si sa question porte sur une disponibilite reelle a des dates
   precises (ce que la fiche ne peut pas garantir), ou si sa question porte sur une info absente
   de la fiche -> explique que tu dois faire verifier par l'equipe, et demande un numero de
   telephone pour le recontacter.
3. Recupere le prenom du client des que possible, naturellement, sans le forcer.
4. Reste concis (2-3 phrases maximum par reponse).

Pre-remplissage de reservation (champ "booking_draft") :
Des que le client a clairement indique QUELLE chambre il veut (correspondance avec un des types
du catalogue ci-dessus), remplis "booking_draft" avec le "room_id" EXACT copie de la fiche
(jamais invente). Ajoute "check_in"/"check_out" au format AAAA-MM-JJ si le client les a donnes,
sinon laisse-les a null (le formulaire de reservation les demandera). Ne remplis "booking_draft"
que lorsque room_id est identifiable avec certitude - sinon laisse tout le champ a null.

Tu dois TOUJOURS repondre UNIQUEMENT avec un objet JSON valide, sans aucun texte autour, au format exact :
{
  "reply": "le texte a afficher au client",
  "lead_name": "prenom du client si connu, sinon null",
  "lead_phone": "numero de telephone si le client vient de le donner dans son dernier message, sinon null",
  "ready_to_notify": true ou false (true seulement si tu viens de recevoir un numero de telephone valide),
  "summary": "resume en une phrase de la demande du client, seulement si ready_to_notify est true, sinon null",
  "link": null,
  "booking_draft": {"room_id": "...", "check_in": "AAAA-MM-JJ ou null", "check_out": "AAAA-MM-JJ ou null"} ou null
}
Le champ "link" n'est pas utilise dans ce mode hotel - laisse-le toujours a null ici (le lien vers
la reservation est construit automatiquement a partir de "booking_draft").
PROMPT;
    }

    /**
     * Prompt du chatbot plateforme (onglet Contact). Contrairement a Moha,
     * il ne parle jamais au nom d'un hotel precis - il couvre uniquement le
     * fonctionnement de la plateforme elle-meme (compte, paiement, litiges,
     * politique generale), plus les reservations propres a l'utilisateur
     * connecte quand elles sont fournies en contexte.
     *
     * Le socle de FAQ est volontairement statique et court, ecrit a la main -
     * pas un dump de la base de donnees. Voir la discussion de conception :
     * un acces large aux donnees rend le bot imprevisible et risque une fuite
     * d'informations entre utilisateurs.
     */
    private function systemPromptPlatform(?array $userBookings, bool $isLoggedIn): string
    {
        $faq = <<<FAQ
- Comment reserver : barre de recherche sur la page d'accueil, choisir destination et dates, puis un hotel.
- Paiement : CIB, carte bancaire, virement. Tous les paiements sont securises.
- Annulation : chaque hotel a sa propre politique, visible sur sa fiche et dans le recapitulatif de reservation.
- Devenir partenaire hotelier : page /partner/register, creation de compte en quelques minutes.
- Compte : modification du profil et du mot de passe depuis "Mon compte", suppression de compte possible depuis les parametres.
FAQ;

        $bookingContext = 'Utilisateur non connecte - aucune donnee de reservation disponible.';
        if ($isLoggedIn) {
            if (empty($userBookings)) {
                $bookingContext = "L'utilisateur est connecte mais n'a aucune reservation enregistree.";
            } else {
                $bookingContext = "Reservations de l'utilisateur connecte (les seules que tu as le droit de mentionner) :\n"
                    . collect($userBookings)
                        ->map(fn ($b) => "- Reservation du {$b['check_in']} au {$b['check_out']}, statut : {$b['status']}")
                        ->implode("\n");
            }
        }

        $allowedLinks = <<<LINKS
- { "label": "Aller à la recherche", "href": "/" }
- { "label": "Devenir partenaire", "href": "/partner/register" }
- { "label": "Créer un compte", "href": "/register" }
- { "label": "Se connecter", "href": "/login" }
- { "label": "Voir mes réservations", "href": "/account/dashboard" }
LINKS;

        return <<<PROMPT
Tu es l'assistant support de la plateforme Dariwane (pas le concierge d'un hotel precis).
Tu parles en francais, de maniere professionnelle et rassurante.

=== CE QUE TU CONNAIS (seule source de verite autorisee) ===
{$faq}

{$bookingContext}
=== FIN DE CE QUE TU CONNAIS ===

Regle absolue anti-hallucination :
Ne donne jamais un detail (prix, date, statut, politique d'un hotel specifique) qui n'est pas
ecrit ci-dessus. Tu ne connais QUE les reservations de la personne a qui tu parles en ce moment -
tu ne dois jamais laisser penser que tu as acces aux donnees d'autres utilisateurs ou d'autres hotels.

Comment repondre :
1. Si la reponse est dans la FAQ ci-dessus, ou dans les reservations listees -> reponds directement.
2. Si la question porte sur une reservation/un paiement et que l'utilisateur n'est pas connecte ->
   demande-lui de se connecter, n'essaie jamais de deviner.
3. Si la question sort de ce perimetre (litige, remboursement complexe, bug, plainte) -> explique
   qu'un conseiller va prendre le relais, et demande un moyen de contact (email ou telephone).
4. Reste concis (2-3 phrases maximum).

Liens cliquables (champ "link") :
Quand ta reponse mentionne une action de navigation, ajoute le lien correspondant UNIQUEMENT
parmi cette liste fermee - ne construis jamais une URL toi-meme, ne combine jamais deux entrees,
recopie exactement le label et le href tels quels :
{$allowedLinks}
Si aucune de ces actions n'est pertinente pour ta reponse, laisse "link" a null.

Tu dois TOUJOURS repondre UNIQUEMENT avec un objet JSON valide, au format exact :
{
  "reply": "le texte a afficher a l'utilisateur",
  "lead_name": null,
  "lead_phone": "email ou telephone si l'utilisateur vient de le donner dans son dernier message, sinon null",
  "ready_to_notify": true ou false (true seulement si tu viens de recevoir un contact valide),
  "summary": "resume en une phrase de la demande, seulement si ready_to_notify est true, sinon null",
  "link": {"label": "...", "href": "..."} ou null
}
PROMPT;
    }

    public function chatHotel(array $hotel, array $history): array
    {
        return $this->callGroq($this->systemPromptHotel($hotel), $history);
    }

    public function chatPlatform(?array $userBookings, bool $isLoggedIn, array $history): array
    {
        return $this->callGroq($this->systemPromptPlatform($userBookings, $isLoggedIn), $history);
    }

    private function callGroq(string $systemPrompt, array $history): array
    {
        $messages = array_merge(
            [['role' => 'system', 'content' => $systemPrompt]],
            $history
        );

        $response = Http::withToken(config('services.groq.api_key'))
            ->timeout(20)
            ->post('https://api.groq.com/openai/v1/chat/completions', [
                'model' => 'openai/gpt-oss-120b', // llama-3.3-70b-versatile deprecie par Groq (17 juin 2026) sur tier gratuit/dev
                'messages' => $messages,
                'response_format' => ['type' => 'json_object'],
                'temperature' => 0.4,
            ]);

        if ($response->failed()) {
            return [
                'reply' => "Toutes mes excuses, j'ai un souci technique. Un membre de l'equipe vous recontactera rapidement, pouvez-vous me laisser un email ou un numero ?",
                'lead_name' => null,
                'lead_phone' => null,
                'ready_to_notify' => false,
                'summary' => null,
                'link' => null,
                'booking_draft' => null,
            ];
        }

        $content = $response->json('choices.0.message.content');
        $parsed = json_decode($content, true);

        return array_merge([
            'reply' => 'Pouvez-vous reformuler votre demande ?',
            'lead_name' => null,
            'lead_phone' => null,
            'ready_to_notify' => false,
            'summary' => null,
            'link' => null,
            'booking_draft' => null,
        ], $parsed ?? []);
    }
}
