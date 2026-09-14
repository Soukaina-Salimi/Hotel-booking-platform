<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * UUID fixes (pas Str::uuid() aleatoire) pour que hotel-service et
     * booking-service puissent reference ces memes identifiants dans leurs
     * propres seeders, meme si les bases sont physiquement separees.
     * En production, ces IDs viendraient d'un vrai appel a auth-service.
     */
    public function run(): void
    {
        $users = [
            ['id' => '11111111-1111-1111-1111-111111111001', 'name' => 'Karim El Fassi',     'email' => 'admin@dariwane.ma',         'role' => 'admin',  'phone' => '0600000001'],
            ['id' => '11111111-1111-1111-1111-111111111002', 'name' => 'Amina Benjelloun',   'email' => 'amina.riad@dariwane.ma',    'role' => 'hotel',  'phone' => '0600000002'],
            ['id' => '11111111-1111-1111-1111-111111111003', 'name' => 'Youssef Idrissi',    'email' => 'youssef.hotel@dariwane.ma', 'role' => 'hotel',  'phone' => '0600000003'],
            ['id' => '11111111-1111-1111-1111-111111111004', 'name' => 'Salma Chraibi',      'email' => 'salma.hotel@dariwane.ma',   'role' => 'hotel',  'phone' => '0600000004'],
            ['id' => '11111111-1111-1111-1111-111111111005', 'name' => 'Jamal Ouahbi',       'email' => 'jamal.ouahbi@gmail.com',    'role' => 'client', 'phone' => '0722210617'],
            ['id' => '11111111-1111-1111-1111-111111111006', 'name' => 'Fatima Zahra Amrani','email' => 'fz.amrani@gmail.com',       'role' => 'client', 'phone' => '0611223344'],
            ['id' => '11111111-1111-1111-1111-111111111007', 'name' => 'Omar Bennis',        'email' => 'omar.bennis@gmail.com',     'role' => 'client', 'phone' => '0622334455'],
            ['id' => '11111111-1111-1111-1111-111111111008', 'name' => 'Nadia Squalli',      'email' => 'nadia.squalli@gmail.com',   'role' => 'client', 'phone' => '0633445566'],
            ['id' => '11111111-1111-1111-1111-111111111009', 'name' => 'Hicham Tazi',        'email' => 'hicham.tazi@gmail.com',     'role' => 'client', 'phone' => '0644556677'],
            ['id' => '11111111-1111-1111-1111-111111111010', 'name' => 'Leila Bouzidi',      'email' => 'leila.bouzidi@gmail.com',   'role' => 'client', 'phone' => '0655667788'],
        ];

        foreach ($users as $u) {
            DB::table('users')->insert([
                'id' => $u['id'],
                'name' => $u['name'],
                'email' => $u['email'],
                'password' => Hash::make('password'), // mot de passe de test uniquement
                'role' => $u['role'],
                'phone' => $u['phone'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
