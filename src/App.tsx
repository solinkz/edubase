import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryPage } from "./components/page/query/QueryPage";
import { ResultsPage } from "./components/page/result/ResultsPage";
import { useState } from "react";

export function App() {
  const [NLInput, setNLInput] = useState("");

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<QueryPage NLInput={NLInput} setNLInput={setNLInput} />}
        />
        <Route
          path="/results"
          element={<ResultsPage setNLInput={setNLInput} NLInput={NLInput} />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
