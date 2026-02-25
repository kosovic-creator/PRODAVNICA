'use client';

import { useI18n } from './I18nProvider';

/**
 * Hook za jednostavnije korištenje prijevoda sa namespacom
 * Primjer korištenja:
 * const t = useTranslation('proizvodi');
 * <h1>{t('naslov')}</h1>
 */
export function useTranslation(namespace: string) {
  const { t } = useI18n();
  return (key: string, defaultValue?: string): string => {
    const result = t(namespace, key);
    return result === key && defaultValue ? defaultValue : result;
  };
}
