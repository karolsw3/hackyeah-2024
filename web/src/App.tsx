import MainChatWindow from './components/MainChatWindow.tsx'
import HistorySidebar from './components/HistorySidebar.tsx'
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: {
      en: {
        translation: {
          "Nowa konwersacja": "New Conversation",
          "Eksportuj plik XML": "Export XML file",
          "Konwersacja": "Conversation",
          "Wiadomość...": "Message...",
        }
      },
      ua: {
        translation: {
          "Nowa konwersacja": "Нова розмова",
          "Eksportuj plik XML": "Експорт XML-файлу",
          "Konwersacja": "Розмова",
          "Wiadomość...": "Повідомлення...",
        }
      }
    },
    lng: "pl", // if you're using a language detector, do not define the lng option
    fallbackLng: "pl",
    interpolation: {
      escapeValue: false
    }
  });

function App() {
  return (
    <div
      className={ 'flex items-center justify-center' }
    >
      <HistorySidebar/>
      <MainChatWindow/>
    </div>
  )
}

export default App
