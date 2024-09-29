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
          "Cześć, jestem tu by pomóc Ci z Twoimi deklaracjami podatkowymi": "Hey, I'm here to help you with your tax declarations",
          "Rozpocznij konwersację wpisując polecenie na dole strony": "Start the conversation by filling the input at the bottom of the page",
          "Możesz": "You may",
          "Wysłać mi zdjęcie swojej umowy kupna-sprzedaży, bym pomógł Ci z deklaracją PCC": "Send me a photo of your sale and purchase agreement so I can help you with your PCC declaration",
          "Zapytać mnie o dowolny aspekt deklaracji": "Ask me about any aspect of the declaration",
          "Powiedzieć mi czego szukasz, a na pewno znajdę dla Ciebie odpowiednie rozwiązanie :)": "Tell me what you're looking for, and we'll figure out the ideal solution :)"
        }
      },
      ua: {
        translation: {
          "Nowa konwersacja": "Нова розмова",
          "Eksportuj plik XML": "Експорт XML-файлу",
          "Konwersacja": "Розмова",
          "Wiadomość...": "Повідомлення...",
          "Cześć, jestem tu by pomóc Ci z Twoimi deklaracjami podatkowymi": "Привіт, я тут, щоб допомогти вам з податковими деклараціями",
          "Rozpocznij konwersację wpisując polecenie na dole strony": "Почніть розмову, набравши команду внизу сторінки",
          "Możesz": "Ти можеш",
          "Wysłać mi zdjęcie swojej umowy kupna-sprzedaży, bym pomógł Ci z deklaracją PCC": "Надішліть мені фото вашого договору купівлі-продажу, щоб я міг допомогти вам з декларацією PCC",
          "Zapytać mnie o dowolny aspekt deklaracji": "Запитайте мене про будь-який аспект декларації",
          "Powiedzieć mi czego szukasz, a na pewno znajdę dla Ciebie odpowiednie rozwiązanie :)": "Скажіть мені, що ви шукаєте, і я обов'язково знайду для вас правильне рішення ))"
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
