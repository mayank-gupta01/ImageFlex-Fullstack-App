import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UploadPage from "./components/UploadPage";
import EditPage from "./components/EditPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UploadPage />} />
        <Route path="/edit" element={<EditPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
