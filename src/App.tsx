import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryPage } from "./components/page/query/QueryPage";
import { ResultsPage } from "./components/page/result/ResultsPage";

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<QueryPage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
