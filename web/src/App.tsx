import MainChatWindow from './components/MainChatWindow.tsx'
import HistorySidebar from './components/HistorySidebar.tsx'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons'

library.add(faPaperPlane)

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
