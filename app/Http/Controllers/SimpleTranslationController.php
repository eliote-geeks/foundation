<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SimpleTranslationController extends Controller
{
    /**
     * Retourne la liste des langues supportées
     */
    public function getSupportedLanguages(): JsonResponse
    {
        return response()->json([
            'success' => true,
            'data' => [
                'languages' => [
                    'fr' => 'Français',
                    'en' => 'English'
                ]
            ]
        ]);
    }

    /**
     * Traduit un texte simple (retourne le texte original pour le moment)
     */
    public function translate(Request $request): JsonResponse
    {
        $text = $request->input('text', '');
        $targetLanguage = $request->input('target_language', 'fr');
        $sourceLanguage = $request->input('source_language', 'auto');

        return response()->json([
            'success' => true,
            'data' => [
                'original_text' => $text,
                'translated_text' => $text, // Retourner le texte original
                'source_language' => $sourceLanguage,
                'target_language' => $targetLanguage
            ]
        ]);
    }

    /**
     * Traduit plusieurs textes en une fois
     */
    public function translateBatch(Request $request): JsonResponse
    {
        $texts = $request->input('texts', []);
        $targetLanguage = $request->input('target_language', 'fr');
        $sourceLanguage = $request->input('source_language', 'auto');

        // Retourner les textes originaux
        $translations = [];
        foreach ($texts as $key => $text) {
            $translations[$key] = $text;
        }

        return response()->json([
            'success' => true,
            'data' => [
                'translations' => $translations,
                'source_language' => $sourceLanguage,
                'target_language' => $targetLanguage
            ]
        ]);
    }

    /**
     * Détecte la langue d'un texte
     */
    public function detectLanguage(Request $request): JsonResponse
    {
        $text = $request->input('text', '');

        return response()->json([
            'success' => true,
            'data' => [
                'text' => $text,
                'detected_language' => 'fr' // Français par défaut
            ]
        ]);
    }

    /**
     * Traduction automatique selon la langue de l'utilisateur
     */
    public function autoTranslate(Request $request): JsonResponse
    {
        $text = $request->input('text', '');
        $userLanguage = $request->input('user_language', 'fr');

        // Pas besoin de traduction pour le moment
        return response()->json([
            'success' => true,
            'data' => [
                'original_text' => $text,
                'translated_text' => $text,
                'detected_language' => 'fr',
                'target_language' => $userLanguage,
                'translation_needed' => false
            ]
        ]);
    }
}