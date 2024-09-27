import { useState } from 'react'
import AppBackground from './assets/AppBackground.tsx'
import { SettingsIcon, CatIcon } from './assets/icons/'
import Cat from './components/Cat.tsx'
import SettingsOverlay from './components/SettingsOverlay.tsx';
import Bookmark from './assets/Bookmark.tsx';
import BookmarksPage from './components/BookmarksPage.tsx'


function App() {
  const [settingsOverlay, setSettingsOverlay] = useState(false);

  const toggleSettings = () => {
    if (settingsOverlay) {
      setSettingsOverlay(false);
    }
    else {
      setSettingsOverlay(true);
    }
  }

  //this is for toggling the cat component
  const [generateCat, setCat] = useState(false)

  const toggleCat = () => {
    setCat(prevState => !prevState);
  };

  //this is for toggling the bookmark component
  const [bookmarks, setBookmarks] = useState(false)

  const toggleBookmarks = () => {
    setBookmarks(prevState => !prevState)
  }


    

  return (
    <div className="w-screen h-screen" >
        <AppBackground />
        {settingsOverlay && <SettingsOverlay close={setSettingsOverlay}/>}
      <div className="h-screen w-screen">
        <button className="text-white" onClick={toggleSettings}>
          <SettingsIcon />
        </button>
        <button className="text-white" onClick={toggleCat}>
          <CatIcon />
        </button>
        <button className="text-white" onClick={toggleBookmarks}>
          <div className="z-20 fixed right-20 p-5">
            <Bookmark />
          </div>
        </button>
        <div className="flex justify-center">
          {generateCat && <Cat />}
        </div>
        
        <div>
          {bookmarks && <BookmarksPage />}
        </div>
      </div>

    </div>
  )
}

export default App
