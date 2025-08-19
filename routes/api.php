<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SimpleTranslationController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Routes de traduction
Route::prefix('translation')->group(function () {
    Route::post('/', [SimpleTranslationController::class, 'translate']);
    Route::post('/batch', [SimpleTranslationController::class, 'translateBatch']);
    Route::post('/detect', [SimpleTranslationController::class, 'detectLanguage']);
    Route::post('/auto', [SimpleTranslationController::class, 'autoTranslate']);
    Route::get('/languages', [SimpleTranslationController::class, 'getSupportedLanguages']);
});