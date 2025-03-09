<?php
namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class LoginController extends Controller
{
    public function loginWithInstagram(Request $request)
    {
        $code = $request->input('code');
       
        $response = Http::asForm()->post('https://api.instagram.com/oauth/access_token', [
            'client_id' => '1665027280807295', // Replace with your app ID
            'client_secret' => "6152e535f6aa9f19624b592b911334d2", // Replace with your app secret
            'grant_type' => 'authorization_code',
            'redirect_uri' => 'https://b6ad-2401-4900-a8b1-a9aa-9ce1-8fea-b5e6-dc5c.ngrok-free.app/callback', // Replace with your redirect URI
            'code' => $code,
        ]);
      
        if ($response->successful()) {
            $body = $response->json();
            $accessToken = $body['access_token'];
            $response2 = Http::get('https://graph.instagram.com/v22.0/access_token', [
                'client_secret' => "6152e535f6aa9f19624b592b911334d2", // Replace with your app secret
                'grant_type' => 'ig_exchange_token',
                'access_token' => $accessToken,
            ]);
            if ($response2->successful()) {
                $body2 = $response2->json();
                $longLivedToken = $body2['access_token'];
                return response()->json(['access_token' => $longLivedToken,'data'=>$body2,'data2'=>$body]);
               


            } else {
                return response()->json(['error' => 'Failed to exchange for long-lived token'], 400);
            }
        } else {
            return response()->json(['error' => 'Failed to authenticate with Instagram'], 400);
        }
    }
}
