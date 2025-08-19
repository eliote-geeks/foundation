<?php

namespace App\Http\Controllers;

use App\Services\TranslationService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class TranslationController extends Controller
{
    private ?TranslationService $translationService = null;

    public function __construct()
    {
        try {
            $this->translationService = app(TranslationService::class);
        } catch (\Exception $e) {
            // Service non disponible, utiliser des valeurs par défaut
            $this->translationService = null;
        }
    }

    /**
     * Traduit un texte simple
     */
    public function translate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:5000',
            'target_language' => 'required|string|size:2',
            'source_language' => 'sometimes|string|size:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $text = $request->input('text');
        $targetLanguage = $request->input('target_language');
        $sourceLanguage = $request->input('source_language', 'auto');

        $translatedText = $this->translationService 
            ? $this->translationService->translate($text, $targetLanguage, $sourceLanguage)
            : $text; // Retourner le texte original si pas de service

        if ($translatedText === null) {
            $translatedText = $text; // Fallback
        }

        return response()->json([
            'success' => true,
            'data' => [
                'original_text' => $text,
                'translated_text' => $translatedText,
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
        $validator = Validator::make($request->all(), [
            'texts' => 'required|array|max:100',
            'texts.*' => 'required|string|max:5000',
            'target_language' => 'required|string|size:2',
            'source_language' => 'sometimes|string|size:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $texts = $request->input('texts');
        $targetLanguage = $request->input('target_language');
        $sourceLanguage = $request->input('source_language', 'auto');

        $translations = $this->translationService 
            ? $this->translationService->translateBatch($texts, $targetLanguage, $sourceLanguage)
            : array_combine(array_keys($texts), array_values($texts)); // Retourner les textes originaux

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
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:5000'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $text = $request->input('text');
        $detectedLanguage = $this->translationService 
            ? $this->translationService->detectLanguage($text)
            : 'fr'; // Français par défaut

        if ($detectedLanguage === null) {
            $detectedLanguage = 'fr'; // Fallback
        }

        return response()->json([
            'success' => true,
            'data' => [
                'text' => $text,
                'detected_language' => $detectedLanguage
            ]
        ]);
    }

    /**
     * Retourne la liste des langues supportées
     */
    public function getSupportedLanguages(): JsonResponse
    {
        $languages = $this->translationService 
            ? $this->translationService->getSupportedLanguages()
            : ['fr' => 'Français', 'en' => 'English']; // Langues par défaut

        return response()->json([
            'success' => true,
            'data' => [
                'languages' => $languages
            ]
        ]);
    }

    /**
     * Traduit automatiquement selon la langue de l'utilisateur
     */
    public function autoTranslate(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'text' => 'required|string|max:5000',
            'user_language' => 'required|string|size:2'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $text = $request->input('text');
        $userLanguage = $request->input('user_language');
        
        // Détecter la langue du texte
        $detectedLanguage = $this->translationService 
            ? $this->translationService->detectLanguage($text)
            : 'fr';
        
        // Si la langue détectée est différente de celle de l'utilisateur, traduire
        if ($detectedLanguage && $detectedLanguage !== $userLanguage && $this->translationService) {
            $translatedText = $this->translationService->translate($text, $userLanguage, $detectedLanguage);
            
            return response()->json([
                'success' => true,
                'data' => [
                    'original_text' => $text,
                    'translated_text' => $translatedText,
                    'detected_language' => $detectedLanguage,
                    'target_language' => $userLanguage,
                    'translation_needed' => true
                ]
            ]);
        }

        // Pas besoin de traduction
        return response()->json([
            'success' => true,
            'data' => [
                'original_text' => $text,
                'translated_text' => $text,
                'detected_language' => $detectedLanguage,
                'target_language' => $userLanguage,
                'translation_needed' => false
            ]
        ]);
    }
}