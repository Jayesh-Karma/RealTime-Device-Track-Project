
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import ComponentMap from './ComponentMap'
import io from 'socket.io-client'

function App() {
 
  return (
    <>
      <div>
        <div className='headContainer'>
          <h1 className='head'>Location Tracker Dummy</h1>
        </div>
        <ComponentMap />
      </div>
    </>
  )
}

export default App
