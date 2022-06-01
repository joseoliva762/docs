import {
  BrowserRouter as Router,
  Route,
  Navigate,
  Routes,
} from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { TextEditor } from "./components/TextEditor";

function App() {
  return (
    <>
      <h1 className="title">Terra Documents</h1>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to={`/document/${uuidv4()}`} />} />
          <Route path="/document/:id" element={<TextEditor />} />
        </Routes>
      </Router>
      <p className="end">
        <span>© Jose Oliva 2022</span>
        <span>Non Terrae Plus Ultra</span>
      </p>
    </>
  );
}

export default App;
