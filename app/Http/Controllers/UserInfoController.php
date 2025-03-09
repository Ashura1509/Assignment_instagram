<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class UserInfoController extends Controller
{
    public function getUserInfo(Request $request)
   
    {
        $access_token = $request->access_token;
        $access_token= 'IGQWRPVWUzcFpta0QwaHZAHTVlJUXZAJTTZAvcVRzOXIwZAVplZAkxqc2tqUVMtMFNwY2xLVG41M1Q2MURYOTlTSTZAuNVhHYkVFUHFUenpJXzBEYW9uTWlsMFFRS3ZASNXNvVkwweXQta1VHZAE1lZAwZDZD';
        if ($access_token) {
            // Fetch user information from Instagram Graph API
            $response = Http::get('https://graph.instagram.com/v22.0/me', [
                'fields' => 'id,username,name,account_type,followers_count,follows_count,media_count,profile_picture_url',
                'access_token' => $access_token,
            ]);
            if ($response->successful()) {
                $userInfo = $response->json();
                // Session::put('userInfo', $userInfo);

                // Redirect to the dashboard with user info
                return response()->json(['userinfo' => $response->json()]);
            } else {
                return response()->json(['error' => 'Failed to authenticate with Instagram'], 400);
            }
           
        } else {
            return redirect('/')->withErrors('No access token provided.');
        }
    }
    
}
