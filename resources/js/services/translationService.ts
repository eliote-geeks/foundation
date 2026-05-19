import axios, { isAxiosError } from 'axios';

type ServiceError = Record<string, unknown> | string;

interface TranslationResponse {
    success: boolean;
    data?: {
        original_text: string;
        translated_text: string;
        source_language: string;
        target_language: string;
    };
    errors?: ServiceError;
    message?: string;
}

interface BatchTranslationResponse {
    success: boolean;
    data?: {
        translations: Record<string, string>;
        source_language: string;
        target_language: string;
    };
    errors?: ServiceError;
}

interface LanguageDetectionResponse {
    success: boolean;
    data?: {
        text: string;
        detected_language: string;
    };
    errors?: ServiceError;
}

interface SupportedLanguagesResponse {
    success: boolean;
    data?: {
        languages: Record<string, string>;
    };
    errors?: ServiceError;
}

interface AutoTranslationResponse {
    success: boolean;
    data?: {
        original_text: string;
        translated_text: string;
        detected_language: string;
        target_language: string;
        translation_needed: boolean;
    };
    errors?: ServiceError;
}

class TranslationService {
    private baseURL = '/api/translation';

    private translationCache = new Map<string, string>();

    /**
     * Traduit un texte simple
     */
    async translate(
        text: string,
        targetLanguage: string,
        sourceLanguage: string = 'auto'
    ): Promise<TranslationResponse> {
        try {
            const response = await axios.post<TranslationResponse>(this.baseURL, {
                text,
                target_language: targetLanguage,
                source_language: sourceLanguage,
            });
            return response.data;
        } catch (error: unknown) {
            return {
                success: false,
                errors: this.extractErrors(error),
            };
        }
    }

    /**
     * Traduit plusieurs textes en une fois
     */
    async translateBatch(
        texts: string[],
        targetLanguage: string,
        sourceLanguage: string = 'auto'
    ): Promise<BatchTranslationResponse> {
        try {
            const response = await axios.post<BatchTranslationResponse>(`${this.baseURL}/batch`, {
                texts,
                target_language: targetLanguage,
                source_language: sourceLanguage,
            });
            return response.data;
        } catch (error: unknown) {
            return {
                success: false,
                errors: this.extractErrors(error),
            };
        }
    }

    /**
     * Détecte la langue d'un texte
     */
    async detectLanguage(text: string): Promise<LanguageDetectionResponse> {
        try {
            const response = await axios.post<LanguageDetectionResponse>(`${this.baseURL}/detect`, {
                text,
            });
            return response.data;
        } catch (error: unknown) {
            return {
                success: false,
                errors: this.extractErrors(error),
            };
        }
    }

    /**
     * Récupère la liste des langues supportées
     */
    async getSupportedLanguages(): Promise<SupportedLanguagesResponse> {
        try {
            const response = await axios.get<SupportedLanguagesResponse>(`${this.baseURL}/languages`);
            return response.data;
        } catch (error: unknown) {
            return {
                success: false,
                errors: this.extractErrors(error),
            };
        }
    }

    /**
     * Traduction automatique selon la langue de l'utilisateur
     */
    async autoTranslate(text: string, userLanguage: string): Promise<AutoTranslationResponse> {
        try {
            const response = await axios.post<AutoTranslationResponse>(`${this.baseURL}/auto`, {
                text,
                user_language: userLanguage,
            });
            return response.data;
        } catch (error: unknown) {
            return {
                success: false,
                errors: this.extractErrors(error),
            };
        }
    }

    /**
     * Traduit automatiquement le contenu selon la langue courante de i18n
     */
    async translateContent(text: string, currentLanguage: string): Promise<string> {
        if (!text || text.trim() === '') {
            return text;
        }

        try {
            const result = await this.autoTranslate(text, currentLanguage);

            if (result.success && result.data) {
                return result.data.translated_text;
            }

            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    /**
     * Traduit avec mise en cache
     */
    async translateWithCache(
        text: string,
        targetLanguage: string,
        sourceLanguage: string = 'auto'
    ): Promise<string> {
        const cacheKey = `${text}_${sourceLanguage}_${targetLanguage}`;

        if (this.translationCache.has(cacheKey)) {
            return this.translationCache.get(cacheKey)!;
        }

        try {
            const result = await this.translate(text, targetLanguage, sourceLanguage);

            if (result.success && result.data) {
                const translatedText = result.data.translated_text;
                this.translationCache.set(cacheKey, translatedText);
                return translatedText;
            }

            return text;
        } catch (error) {
            console.error('Translation error:', error);
            return text;
        }
    }

    /**
     * Nettoie le cache de traduction
     */
    clearCache(): void {
        this.translationCache.clear();
    }

    private extractErrors(error: unknown): ServiceError {
        if (isAxiosError(error)) {
            return error.response?.data?.errors || error.message || 'Unknown error';
        }

        if (error instanceof Error) {
            return error.message;
        }

        return 'Unknown error';
    }
}

export const translationService = new TranslationService();
export default translationService;
