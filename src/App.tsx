import reactLogo from "./assets/react.svg"
import LogoFull from "./components/LogoFull"
import "./App.css"
import { useState } from "react"

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App flex flex-col items-center">
      <LogoFull className="h-48 w-48 text-white" />
      <div className="flex flex-row gap-x-2 justify-between px-12">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </div>
  )
}

export default App
