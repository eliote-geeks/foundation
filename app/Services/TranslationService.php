<?php

namespace App\Services;

use GuzzleHttp\Client;
use GuzzleHttp\Exception\RequestException;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;

class TranslationService
{
    private Client $client;
    private string $apiKey;
    private string $baseUrl;

    public function __construct()
    {
        try {
            $this->client = new Client([
                'timeout' => 30,
                'headers' => [
                    'Content-Type' => 'application/json',
                    'Accept' => 'application/json',
                ]
            ]);
            
            // Configuration pour Google Translate API
            $this->apiKey = config('services.google_translate.key', '');
            $this->baseUrl = 'https://translation.googleapis.com/language/translate/v2';
        } catch (\Exception $e) {
            Log::warning('Translation service initialization failed: ' . $e->getMessage());
            $this->apiKey = '';
        }
    }

    /**
     * Traduit un texte d'une langue vers une autre
     */
    public function translate(string $text, string $targetLanguage, string $sourceLanguage = 'auto'): ?string
    {
        if (empty($this->apiKey)) {
            Log::warning('Google Translate API key not configured, returning original text');
            return $text; // Retourner le texte original au lieu de null
        }

        // Création d'une clé de cache unique
        $cacheKey = "translation_" . md5($text . $targetLanguage . $sourceLanguage);
        
        // Vérifier le cache d'abord
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        try {
            $response = $this->client->post($this->baseUrl, [
                'query' => [
                    'key' => $this->apiKey,
                    'q' => $text,
                    'target' => $targetLanguage,
                    'source' => $sourceLanguage,
                    'format' => 'text'
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            if (isset($data['data']['translations'][0]['translatedText'])) {
                $translatedText = $data['data']['translations'][0]['translatedText'];
                
                // Mettre en cache pour 24 heures
                Cache::put($cacheKey, $translatedText, now()->addHours(24));
                
                return $translatedText;
            }

        } catch (RequestException $e) {
            Log::error('Translation API error: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Translation service error: ' . $e->getMessage());
        }

        return $text; // Retourner le texte original en cas d'erreur
    }

    /**
     * Traduit plusieurs textes en une seule requête
     */
    public function translateBatch(array $texts, string $targetLanguage, string $sourceLanguage = 'auto'): array
    {
        if (empty($this->apiKey)) {
            Log::warning('Google Translate API key not configured');
            // Retourner les textes originaux au lieu de null
            return array_combine(array_keys($texts), array_values($texts));
        }

        $results = [];
        $textsToTranslate = [];
        
        // Vérifier le cache pour chaque texte
        foreach ($texts as $key => $text) {
            $cacheKey = "translation_" . md5($text . $targetLanguage . $sourceLanguage);
            if (Cache::has($cacheKey)) {
                $results[$key] = Cache::get($cacheKey);
            } else {
                $textsToTranslate[$key] = $text;
            }
        }

        // Si tous les textes sont en cache, retourner les résultats
        if (empty($textsToTranslate)) {
            return $results;
        }

        try {
            $response = $this->client->post($this->baseUrl, [
                'query' => [
                    'key' => $this->apiKey,
                    'q' => array_values($textsToTranslate),
                    'target' => $targetLanguage,
                    'source' => $sourceLanguage,
                    'format' => 'text'
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            if (isset($data['data']['translations'])) {
                $translations = $data['data']['translations'];
                $keys = array_keys($textsToTranslate);
                
                foreach ($translations as $index => $translation) {
                    if (isset($keys[$index]) && isset($translation['translatedText'])) {
                        $key = $keys[$index];
                        $translatedText = $translation['translatedText'];
                        $results[$key] = $translatedText;
                        
                        // Mettre en cache
                        $cacheKey = "translation_" . md5($textsToTranslate[$key] . $targetLanguage . $sourceLanguage);
                        Cache::put($cacheKey, $translatedText, now()->addHours(24));
                    }
                }
            }

        } catch (RequestException $e) {
            Log::error('Translation batch API error: ' . $e->getMessage());
            // Remplir avec null pour les textes non traduits
            foreach ($textsToTranslate as $key => $text) {
                if (!isset($results[$key])) {
                    $results[$key] = null;
                }
            }
        } catch (\Exception $e) {
            Log::error('Translation batch service error: ' . $e->getMessage());
            foreach ($textsToTranslate as $key => $text) {
                if (!isset($results[$key])) {
                    $results[$key] = null;
                }
            }
        }

        return $results;
    }

    /**
     * Détecte la langue d'un texte
     */
    public function detectLanguage(string $text): ?string
    {
        if (empty($this->apiKey)) {
            return 'fr'; // Retourner français par défaut
        }

        try {
            $response = $this->client->post('https://translation.googleapis.com/language/translate/v2/detect', [
                'query' => [
                    'key' => $this->apiKey,
                    'q' => $text
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            if (isset($data['data']['detections'][0][0]['language'])) {
                return $data['data']['detections'][0][0]['language'];
            }

        } catch (RequestException $e) {
            Log::error('Language detection API error: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Language detection service error: ' . $e->getMessage());
        }

        return 'fr'; // Retourner français par défaut en cas d'erreur
    }

    /**
     * Liste des langues supportées
     */
    public function getSupportedLanguages(): array
    {
        $cacheKey = 'supported_languages';
        
        if (Cache::has($cacheKey)) {
            return Cache::get($cacheKey);
        }

        if (empty($this->apiKey)) {
            return ['fr' => 'Français', 'en' => 'English'];
        }

        try {
            $response = $this->client->get('https://translation.googleapis.com/language/translate/v2/languages', [
                'query' => [
                    'key' => $this->apiKey,
                    'target' => 'en'
                ]
            ]);

            $data = json_decode($response->getBody()->getContents(), true);
            
            if (isset($data['data']['languages'])) {
                $languages = [];
                foreach ($data['data']['languages'] as $language) {
                    $languages[$language['language']] = $language['name'];
                }
                
                Cache::put($cacheKey, $languages, now()->addDays(7));
                return $languages;
            }

        } catch (RequestException $e) {
            Log::error('Supported languages API error: ' . $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Supported languages service error: ' . $e->getMessage());
        }

        return ['fr' => 'Français', 'en' => 'English'];
    }
}