import { useTranslation } from 'react-i18next';

export const useLocales = () => {
  const { i18n, t: translate } = useTranslation();

  const handleChangeLanguage = (newLang: string) => {
    i18n.changeLanguage(newLang);
  };

  return {
    onChangeLang: handleChangeLanguage,
    translate,
  };
};
