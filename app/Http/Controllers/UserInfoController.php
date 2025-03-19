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
        // $access_token= 'IGQWRPVWUzcFpta0QwaHZAHTVlJUXZAJTTZAvcVRzOXIwZAVplZAkxqc2tqUVMtMFNwY2xLVG41M1Q2MURYOTlTSTZAuNVhHYkVFUHFUenpJXzBEYW9uTWlsMFFRS3ZASNXNvVkwweXQta1VHZAE1lZAwZDZD';
        if ($access_token) {
            // Fetch user information from Instagram Graph API
            $response = Http::get('https://graph.instagram.com/v22.0/me', [
                'fields' => 'id,username,name,account_type,followers_count,follows_count,media_count,profile_picture_url',
                'access_token' => $access_token,
            ]);
            // dd($response->body());
            if ($response->successful()) {
                $userInfo = $response->json();
                // GET https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,timestamp&access_token=YOUR_ACCESS_TOKEN
                $response2 = Http::get('https://graph.instagram.com/v22.0/me/media', [
                    'fields' => 'id,caption,media_type,media_url,thumbnail_url,timestamp',
                    'access_token' => $access_token,
                    'limit' => 50
                ]);
                if($response2->successful()){
                    $media = $response2->json();
                    // dd($media);
                    return response()->json(['userinfo' => $userInfo,'media'=>$media]);
                }else{
                    return response()->json(['error' => 'Failed to fetch media from Instagram'], 400);
                }
                // Session::put('userInfo', $userInfo);

                // Redirect to the dashboard with user info
            } else {
                return response()->json(['error' => 'Failed to authenticate with Instagram'], 400);
            }
           
        } else {
            return redirect('/')->withErrors('No access token provided.');
        }
    }

    public function fetchComments(Request $request, $mediaId)
    {
        $access_token = $request->access_token;

        if ($access_token) {
            // Fetch comments for the media item
            $response = Http::get("https://graph.instagram.com/v22.0/$mediaId/comments", [
                'fields' => 'id,text,username,timestamp',
                'access_token' => $access_token,
                'limit' => 50,
            ]);

            if ($response->successful()) {
                $comments = $response->json();
                return response()->json(['comments' => $comments]);
            } else {
                return response()->json(['error' => 'Failed to fetch comments from Instagram'], 400);
            }
        } else {
            return response()->json(['error' => 'No access token provided'], 400);
        }
    }

    public function replyToComment(Request $request, $mediaId)
    {
        $access_token = $request->access_token;
        $comment_text = $request->comment_text;

        if ($access_token && $comment_text) {
            // Reply to a comment on the media item
            $response = Http::post("https://graph.instagram.com/v22.0/$mediaId/comments", [
                'message' => $comment_text,
                'access_token' => $access_token,
            ]);

            if ($response->successful()) {
                return response()->json(['success' => 'Comment replied successfully']);
            } else {
                return response()->json(['error' => 'Failed to reply to comment'], 400);
            }
        } else {
            return response()->json(['error' => 'Missing required parameters'], 400);
        }
    }
    
}
