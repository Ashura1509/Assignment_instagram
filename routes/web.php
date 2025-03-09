<?php

use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\Auth\LoginController;



// Route::get('/login/callback', [LoginController::class, 'handleCallback'])->name('login.callback');

// Catch-all route for React
Route::get('/{any}', function () {
    return view('welcome'); // Make sure 'app.blade.php' exists and loads React
})->where('any', '^(?!api).*$');
