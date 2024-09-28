import MainChatWindow from './components/MainChatWindow.tsx'
import HistorySidebar from './components/HistorySidebar.tsx'

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
