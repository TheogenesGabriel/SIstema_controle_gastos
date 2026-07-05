import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="app-shell">
      <header className="app-header">
        <h1 className="app-title">
          <span className="mark"></span>Livro Caixa
        </h1>
        <div className="app-subtitle">    Controle de gastos residenciais</div>
        <nav className="app-nav">
          <NavLink to="/pessoas" className={({ isActive }) => (isActive ? "active" : "")}>
            Pessoas
          </NavLink>
          <NavLink to="/transacoes" className={({ isActive }) => (isActive ? "active" : "")}>
            Transações
          </NavLink>
          <NavLink to="/totais" className={({ isActive }) => (isActive ? "active" : "")}>
            Totais
          </NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
