<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * POST /api/auth/register
     * Utilise a la fois par l'inscription client classique et par l'inscription
     * partenaire (role=hotel) - le role est valide pour eviter qu'on puisse
     * s'auto-attribuer le role admin via ce endpoint public.
     */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:150',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string|max:20',
            'role' => 'nullable|in:client,hotel',
        ]);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'role' => $data['role'] ?? 'client',
        ]);

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUser($user),
        ], 201);
    }

    /**
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ["Email ou mot de passe incorrect."],
            ]);
        }

        $token = $user->createToken('api')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $this->formatUser($user),
        ]);
    }

    /**
     * GET /api/auth/me
     * Protege par le middleware auth:sanctum - renvoie l'utilisateur courant
     * a partir du token Bearer envoye dans l'entete Authorization.
     */
    public function me(Request $request)
    {
        return response()->json(['user' => $this->formatUser($request->user())]);
    }

    /**
     * POST /api/auth/logout
     * Revoque uniquement le token utilise pour cette requete (pas tous les
     * appareils connectes de l'utilisateur).
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Deconnecte']);
    }

    private function formatUser(User $user): array
    {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ];
    }
}
