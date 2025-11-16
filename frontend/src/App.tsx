import { Outlet, Link } from "react-router";
import "./App.css";

function App() {
  return (
    <>
      <div id="app-layout">
        {/* Um menu de navegação simples */}
        <nav style={{ padding: "1rem", backgroundColor: "#333" }}>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Dashboard
          </Link>
          <Link to="/clientes">Clientes</Link>
          {/* /produtos aqui quando a US-07 for iniciada */}
        </nav>

        <hr />

        {/* O 'Outlet' é onde o react-router irá renderizar a página da rota atual */}
        <main style={{ padding: "1rem" }}>
          <Outlet />
        </main>
      </div>
    </>
  );
}

export default App;
