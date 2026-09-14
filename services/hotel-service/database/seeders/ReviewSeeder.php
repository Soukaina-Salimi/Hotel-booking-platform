<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ReviewSeeder extends Seeder
{
    // user_id reference les 6 comptes 'client' de auth_db (users 1005 a 1010).
    public function run(): void
    {
        $reviews = [
            ['user_id' => '11111111-1111-1111-1111-111111111005', 'hotel_id' => '22222222-2222-2222-2222-222222222001', 'rating' => 5, 'comment' => 'Riad magnifique, personnel tres accueillant, petit-dejeuner delicieux.'],
            ['user_id' => '11111111-1111-1111-1111-111111111006', 'hotel_id' => '22222222-2222-2222-2222-222222222001', 'rating' => 4, 'comment' => 'Tres beau cadre, un peu bruyant le soir depuis la medina.'],
            ['user_id' => '11111111-1111-1111-1111-111111111007', 'hotel_id' => '22222222-2222-2222-2222-222222222002', 'rating' => 5, 'comment' => 'Excellent rapport qualite-prix, chambre impeccable.'],
            ['user_id' => '11111111-1111-1111-1111-111111111008', 'hotel_id' => '22222222-2222-2222-2222-222222222003', 'rating' => 4, 'comment' => 'Vue sur mer superbe, service au top.'],
            ['user_id' => '11111111-1111-1111-1111-111111111009', 'hotel_id' => '22222222-2222-2222-2222-222222222003', 'rating' => 3, 'comment' => 'Bien situe mais la piscine etait fermee pendant notre sejour.'],
            ['user_id' => '11111111-1111-1111-1111-111111111010', 'hotel_id' => '22222222-2222-2222-2222-222222222004', 'rating' => 4, 'comment' => 'Chambre confortable, proche de la plage, personnel sympathique.'],
            ['user_id' => '11111111-1111-1111-1111-111111111005', 'hotel_id' => '22222222-2222-2222-2222-222222222005', 'rating' => 5, 'comment' => 'Decoration magnifique, tres authentique, je recommande.'],
            ['user_id' => '11111111-1111-1111-1111-111111111006', 'hotel_id' => '22222222-2222-2222-2222-222222222006', 'rating' => 5, 'comment' => 'Suite royale exceptionnelle, service impeccable du debut a la fin.'],
            ['user_id' => '11111111-1111-1111-1111-111111111007', 'hotel_id' => '22222222-2222-2222-2222-222222222007', 'rating' => 4, 'comment' => 'Tres bel emplacement face au port, chambre un peu petite.'],
            ['user_id' => '11111111-1111-1111-1111-111111111008', 'hotel_id' => '22222222-2222-2222-2222-222222222008', 'rating' => 3, 'comment' => 'Correct sans plus, climatisation bruyante la nuit.'],
        ];

        foreach ($reviews as $r) {
            DB::table('reviews')->insert([
                'id' => Str::uuid(),
                'user_id' => $r['user_id'],
                'hotel_id' => $r['hotel_id'],
                'rating' => $r['rating'],
                'comment' => $r['comment'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
