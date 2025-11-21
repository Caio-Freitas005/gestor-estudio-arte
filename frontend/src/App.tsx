import { Outlet, Link } from "react-router";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Navegação com Tailwind */}
      <nav className="p-4 bg-gray-800 text-white flex gap-6 shadow-md">
        <Link to="/" className="hover:text-blue-400 font-semibold transition-colors">
          Dashboard
        </Link>
        <Link to="/clientes" className="hover:text-blue-400 font-semibold transition-colors">
          Clientes
        </Link>
        <Link to="/produtos" className="hover:text-blue-400 font-semibold transition-colors">
          Produtos
        </Link>
        <Link to="/pedidos" className="hover:text-blue-400 font-semibold transition-colors">
          Pedidos
        </Link>
      </nav>

      {/* Área principal */}
      <main className="p-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

export default App;