<?php
namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Session;

class ConversationController extends Controller
{
    public function getConversations(Request $request)
    {
        $access_token = $request->input('access_token');
        
        $access_token= 'IGQWRPVWUzcFpta0QwaHZAHTVlJUXZAJTTZAvcVRzOXIwZAVplZAkxqc2tqUVMtMFNwY2xLVG41M1Q2MURYOTlTSTZAuNVhHYkVFUHFUenpJXzBEYW9uTWlsMFFRS3ZASNXNvVkwweXQta1VHZAE1lZAwZDZD';
        if ($access_token) {
          
                    $response2 = Http::get('https://graph.instagram.com/v22.0/me/conversations', [
                        'platform' => 'instagram',
                        'access_token' => $access_token,
                    ]);
                    // dd($response2->body());
                    if ($response2->successful()) {
                        $conversations = $response2->json();
                        // Session::put('conversations', $conversations);

                        // Return the conversations
                        return response()->json(['conversations' => $conversations]);
                    } else {
                        return response()->json(['error' => 'Failed to fetch conversations from Instagram'], 400);
                    }
               
        } else {
            return response()->json(['error' => 'No access token provided'], 400);
        }
    }

    public function getMessages(Request $request, $id)
    {
        $access_token = $request->access_token;
        // $id = $request->user_id;
        $access_token= 'IGQWRPVWUzcFpta0QwaHZAHTVlJUXZAJTTZAvcVRzOXIwZAVplZAkxqc2tqUVMtMFNwY2xLVG41M1Q2MURYOTlTSTZAuNVhHYkVFUHFUenpJXzBEYW9uTWlsMFFRS3ZASNXNvVkwweXQta1VHZAE1lZAwZDZD';
       
        if ($access_token) {
            // Fetch user information from Instagram Graph API
            $response = Http::get("https://graph.instagram.com/v22.0/$id/messages", [
                'fields' => 'messages',
                'access_token' => $access_token,
            ]);
            if ($response->successful()) {
                $body = $response->json();
                $conversation = [];
                foreach ($body['data'] as $message) {
                    $message_id = $message['id'];
                    $response2 = Http::get("https://graph.instagram.com/v22.0/$message_id", [
                        'fields' => 'id,created_time,from,to,message',
                        'access_token' => $access_token,
                    ]);
                    if ($response2->successful()) {
                        $conversation[] = $response2->json();
                    } else {
                        return response()->json(['error' => 'Failed to fetch the messages'], 400);
                    }
                }
                return response()->json(['conversation' => $conversation]);
            } else {
                return response()->json(['error' => 'Failed to authenticate with Instagram'], 400);
            }
        } else {
            return response()->json(['error' => 'No access token provided'], 400);
        }
    } 

    public function sendMessage(Request $request)
    {
        $access_token = $request->access_token;
        $recipient_id = $request->recipient_id;
        $message = $request->message;
        // dd($request->all());
        $access_token= 'IGQWRPVWUzcFpta0QwaHZAHTVlJUXZAJTTZAvcVRzOXIwZAVplZAkxqc2tqUVMtMFNwY2xLVG41M1Q2MURYOTlTSTZAuNVhHYkVFUHFUenpJXzBEYW9uTWlsMFFRS3ZASNXNvVkwweXQta1VHZAE1lZAwZDZD';
        if ($access_token && $recipient_id && $message) {
            // $recipient_id = 9487289874662848;
          
            $response = Http::post("https://graph.instagram.com/v22.0/me/messages", [
                'recipient' => [
                    'id' => $recipient_id
                ],
                'message' => [
                    'text' => $message
                ],
                'access_token' => $access_token
            ]);
            // echo 'hello';
            // dd($response->body());
            if ($response->successful()) {
                $responseBody = $response->json();
                if (isset($responseBody['message_id'])) {
                    return response()->json(['message' => 'Message sent successfully', 'message_id' => $responseBody['message_id']]);
                } else {
                    return response()->json(['error' => 'Failed to send the message'], 400);
                }
            } else {
                return response()->json(['error' => 'Failed to send the message'], 400);
            }
        } else {
            return response()->json(['error' => 'No access token provided'], 400);
        }
    }
}
