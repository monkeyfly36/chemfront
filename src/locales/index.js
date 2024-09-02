import cookie from 'js-cookie';

import en from './translations/locales/en';
import zh from './translations/locales/zh';

const locales = {
    en: en,
    zh_CHS: zh,
    // zh_CHT: require('./translations/zh_CHT').default,
};

export function getCurrentLocaleForIntl() {
    const currentLanguage = getCurrentLocale();
    if (currentLanguage === 'zh_CHS') {
      return 'zh';
    }
    if (currentLanguage === 'zh_CHT') {
      return 'zh';
    }
  
    return currentLanguage;
  }
  
const getCurrentLocaleForAntd = () => {
    let locale;
  
    switch (getCurrentLocale()) {
        case 'en': {
            locale = require('antd/lib/locale-provider/en_US').default;
            break;
        }
        case 'zh_CHS': {
            locale = require('antd/lib/locale-provider/zh_CN').default;
            break;
        }
        case 'zh_CHT': {
            locale = require('antd/lib/locale-provider/zh_TW').default;
            break;
        }
        case 'ja': {
            locale = require('antd/lib/locale-provider/ja_JP').default;
            break;
        }
        default: {
            locale = require('antd/lib/locale-provider/en_US').default;
        }
    }
    return locale;
}

const getLanguageSite = ['en', 'zh_CHS']

const getCurrentLocale = (supportLanguageList = getLanguageSite) => {
    let currentLanguage;
  
    // currentLanguage = localStorage.getItem('language');
    currentLanguage = localStorage.getItem('language') ? localStorage.getItem('language') : cookie.get('language');
    // console.log('currentLanguage', currentLanguage);
    if (currentLanguage && currentLanguage !== 'null') {
      // return currentLanguage;
    } else {
      currentLanguage = navigator.language.toLocaleLowerCase();
      currentLanguage = currentLanguage.replace('-', '_')
  
      if (!currentLanguage) {
        currentLanguage = 'en'
      } else {
        if (['zh', 'zh_cn', 'zh_sg', 'zh_chs'].includes(currentLanguage)) {
          currentLanguage = 'zh_CHS';
        } else if (['zh_tw', 'zh_hk', 'zh_cht'].includes(currentLanguage)) {
          currentLanguage = 'zh_CHT'
        } else {
          currentLanguage = currentLanguage.split('_')[0]
        }
      }
    }
  
    if (!supportLanguageList.includes(currentLanguage)) {
      currentLanguage = supportLanguageList[0] || 'zh_CHS'
    }
    return currentLanguage;
}

export {
    locales,
    getCurrentLocale,
    getCurrentLocaleForAntd,
  }