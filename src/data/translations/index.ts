import { en } from './en';
import { es } from './es';
import { fr } from './fr';
import { de } from './de';
import { pt } from './pt';
import { id } from './id';

export const translations = {
  en,
  es,
  fr,
  de,
  pt,
  id
} as const;

export type Locale = keyof typeof translations;
export const defaultLocale = 'en';
export const locales = ['en', 'es', 'fr', 'de', 'pt', 'id'] as const;
