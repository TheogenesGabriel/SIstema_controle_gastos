import { Navigate, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import PessoasPage from "./pages/PessoasPage";
import TransacoesPage from "./pages/TransacoesPage";
import TotaisPage from "./pages/TotaisPage";

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Navigate to="/pessoas" replace />} />
        <Route path="/pessoas" element={<PessoasPage />} />
        <Route path="/transacoes" element={<TransacoesPage />} />
        <Route path="/totais" element={<TotaisPage />} />
      </Route>
    </Routes>
  );
}

export default App;
