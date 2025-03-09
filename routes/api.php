<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\UserInfoController;
use App\Http\Controllers\ConversationController;

Route::post('/instagram/login', [LoginController::class, 'loginWithInstagram']);
Route::get('/user/info', [UserInfoController::class, 'getUserInfo']);
Route::get('/user/conversations', [ConversationController::class, 'getConversations']);
Route::get('/user/conversations/{id}/messages', [ConversationController::class, 'getMessages']);
Route::post('/user/send-message', [ConversationController::class, 'sendMessage']);