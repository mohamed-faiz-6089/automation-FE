
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AutomateGenerateTemplate from './components/AutomateGenerateTemplates'
import AutomateEditor from './components/AutomateEditor'


function App() {


  return (
 <BrowserRouter>
      <Routes>
        <Route path="/" element={<AutomateEditor />} />
        {/* <Route path="/test" element={<AutomateEditor />} /> */}
      </Routes>
    </BrowserRouter>
    
  )
}

export default App
