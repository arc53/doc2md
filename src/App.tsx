import "./App.css";

import { BrowserRouter, Route, Routes } from "react-router-dom";

import Nav from "./components/Nav";
import DocumentToMarkdown from "./pages/DocumentToMarkdown";

function App() {
  return (
    <>
      <Nav />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DocumentToMarkdown />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
