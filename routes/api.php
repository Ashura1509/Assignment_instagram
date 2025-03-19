<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\ConversationController;
use App\Http\Controllers\CommentController;

Route::post('/instagram/login', [LoginController::class, 'loginWithInstagram']);
Route::get('/user/info', [UserInfoController::class, 'getUserInfo']);
// Route::get('/user/conversations', [ConversationController::class, 'getConversations']);
// Route::get('/user/conversations/{id}/messages', [ConversationController::class, 'getMessages']);
// Route::post('/user/send-message', [ConversationController::class, 'sendMessage']);
// Route::post('/user/reply-message', [ConversationController::class, 'replyMessage']);

// Route::middleware('auth:api')->group(function () {
    Route::get('/comments/{mediaId}', [UserInfoController::class, 'fetchComments']);
    Route::post('/comments/{mediaId}/reply', [UserInfoController::class, 'replyToComment']);
// });