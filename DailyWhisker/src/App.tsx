import AppBackground from './assets/AppBackground.tsx'
import Cat from './components/Cat.tsx'

function App() {

  return (
    <>
      <AppBackground />
      <div className="h-screen w-screen flex justify-center items-center">
        <Cat />
      </div>

    </>
  )
}

export default App
