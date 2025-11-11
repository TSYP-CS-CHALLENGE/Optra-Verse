<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreUserRequest;
use App\Models\RefreshToken;
use App\Models\User;
use App\UserRole;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Http\Request;

class AuthController extends Controller
{
public function register(StoreUserRequest $request)
    {
        try {
            $data = $request->validated();

            $userData = [
                'name' => $data['name'],
                'prenom' => $data['prenom'],
                'email' => $data['email'],
                'phone' => $data['phone'],
                'role' => $data['role'],
                'password' => bcrypt($data['password'])
            ];

            if ($data['role'] === UserRole::JOBSEEKER->value) {
                $userData['cin'] = $data['cin'];

                if ($request->hasFile('resume')) {
                    $resumePath = $request->file('resume')->store('resumes', 'public');
                    $userData['resume'] = $resumePath;
                }
            }

            if ($data['role'] === UserRole::RECRUITER->value) {
                $userData['company'] = $data['company'];
                $userData['position'] = $data['position'];
                $userData['industry'] = $data['industry'];
                $userData['website'] = $data['website'] ?? null;

                if ($request->hasFile('company_logo')) {
                    $logoPath = $request->file('company_logo')->store('company-logos', 'public');
                    $userData['company_logo'] = $logoPath;
                }
            }

            $user = User::create($userData);

            return response()->json([
                'data' => $user,
                "message" => 'User registered successfully'
            ], 201);

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }


     public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $user = JWTAuth::user();

        if (!$user->is_active) {
            return response()->json(['error' => 'Account deactivated'], 403);
        }

        $refreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);
        $expiresAt = now()->addMinutes(config('jwt.refresh_ttl'));

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => $refreshToken,
            'expires_at' => $expiresAt,
        ]);

        $access_token = cookie(
            'access_token',
            $token,
            config('jwt.ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        $refresh_token = cookie(
            'refresh_token',
            $refreshToken,
            config('jwt.refresh_ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'user' => $user,
        ])->withCookie($access_token)->withCookie($refresh_token);
    }

    public function refresh(Request $request)
    {
        $refreshToken = $request->cookie('refresh_token');

        if (!$refreshToken) {
            return response()->json(['error' => 'Refresh token not found'], 401);
        }

        $storedToken = RefreshToken::where('token', $refreshToken)
            ->where('expires_at', '>', now())
            ->first();

        if (!$storedToken) {
            return response()->json(['error' => 'Invalid or expired refresh token'], 401);
        }

        $user = User::find($storedToken->user_id);
        $storedToken->delete();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $newAccessToken = JWTAuth::fromUser($user);
        $newRefreshToken = JWTAuth::claims(['refresh' => true])->fromUser($user);
        $expiresAt = now()->addMinutes(config('jwt.refresh_ttl'));

        RefreshToken::create([
            'user_id' => $user->id,
            'token' => $newRefreshToken,
            'expires_at' => $expiresAt,
        ]);

        $access_token = cookie(
            'access_token',
            $newAccessToken,
            config('jwt.ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        $refresh_token = cookie(
            'refresh_token',
            $newRefreshToken,
            config('jwt.refresh_ttl'),
            '/',
            'localhost',
            false,
            true,
            false,
            'Lax'
        );

        return response()->json([
            'message' => 'Token refreshed successfully'
        ])->withCookie($access_token)->withCookie($refresh_token);
    }

    public function logout(Request $request)
    {
        try {
            $refreshToken = $request->cookie('refresh_token');
            if ($refreshToken) {
                RefreshToken::where('token', $refreshToken)->delete();
            }

            $token = $request->cookie('access_token');
            if ($token) {
                JWTAuth::setToken($token)->invalidate();
            }

            $access_token = cookie(
                'access_token',
                null,
                -1,
                '/',
                'localhost',
                false,
                true,
                false,
                'Lax'
            );

            $refresh_token = cookie(
                'refresh_token',
                null,
                -1,
                '/',
                'localhost',
                false,
                true,
                false,
                'Lax'
            );

            return response()->json([
                'message' => 'Successfully logged out'
            ])->withCookie($access_token)->withCookie($refresh_token);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to logout'], 500);
        }
    }

      public function me(Request $request)
    {
        return response()->json([
            'user' => $request->user()
        ]);
    }
}
