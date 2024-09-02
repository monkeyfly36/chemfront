import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.scss'

import { BrowserRouter } from "react-router-dom";
import RouterRoutes from "Src/routes/routes";

// TODO
import { IntlProvider } from 'react-intl-universal';
import enMessages from 'Src/locales/translations/en';

import enTranslations from 'Src/locales/translations/en.js';
import zhTranslations from 'Src/locales/translations/zh_CHS.js';

const messages = {
  'en': enTranslations,
  'zh': zhTranslations
};

// TODO
// import { locales, getCurrentLocale } from 'Src/locales';
// const getLanguageSite = ['zh_CHS']
// const currentLocale = getCurrentLocale.bind(this, getLanguageSite);

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <div className='app' id="app">
        {/* <div className='header'>
          <div className='headerNav'>
            <img className='reactLogo' src={reactLogo} />
          </div>
        </div> */}
        
        <div className='content'>
          <RouterRoutes />
        </div>
      </div>
    </BrowserRouter>
  )
}

// const getCurrentLanguage = () => {
//   const language = 'zh'
//   return language.substring(0, 2); // 获取语言代码，例如 "en", "zh"
// };

// const App = () => {
//   const language = getCurrentLanguage();
//   const currentMessages = messages[language] || messages['en'];

//   return (
//     <BrowserRouter>
//       <IntlProvider locale={language} messages={currentMessages}>
//           <div className='app' id="app">
          
//             <div className='content'>
//               <RouterRoutes />
//             </div>
//           </div>
//       </IntlProvider>
//     </BrowserRouter>
//   );
// }

export default App
