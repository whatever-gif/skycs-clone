import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import devExpressTexts from './vi/devexpress.json';
import { loadMessages, locale } from 'devextreme/localization';

export const defaultNS = 'texts';

const mergedTexts = {
  ...devExpressTexts
};
export const resources = {
  en: {
    texts: mergedTexts,
  },
  vi: {
    texts: mergedTexts
  }
};

declare module 'i18next' {
  interface CustomTypeOptions {
    returnNull: false;
  }
}
const currentLocale = localStorage.getItem('locale') || 'vi';
loadMessages({
  [`${currentLocale}`]: mergedTexts
});
locale(currentLocale);

i18next.use(initReactI18next).init({
  lng: 'vi', // if you're using a language detector, do not define the lng option
  debug: false,
  resources,
  defaultNS,
  returnNull: false,
});