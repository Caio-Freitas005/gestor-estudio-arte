import { useState } from "react";
import { Link, Outlet } from "react-router";
import { ListAlt, AddCircleOutline } from "@mui/icons-material";
import SidebarItem from "./components/SidebarItem";

function App() {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const toggleMenu = (menu: string) => {
    setOpenMenu(openMenu === menu ? null : menu);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed top-0 left-0 z-40 w-64 h-screen sm:translate-x-0">
        <div className="h-full px-4 py-6 overflow-y-auto bg-white border-r border-gray-200 shadow-sm">
          <div className="mb-10 px-4">
            <Link to="/">
              <h1 className="text-2xl font-black tracking-tight text-gray-800">
                GAPM<span className="text-pink-500">.</span>
                <span className="block text-xs font-medium text-gray-400 uppercase tracking-widest">
                  Gestor Ateliê
                </span>
              </h1>
            </Link>
          </div>

          <ul className="space-y-2 font-medium">
            <SidebarItem
              to="/"
              label="Dashboard"
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h7v9H3V3zM14 3h7v5h-7V3zM14 11h7v10h-7V11zM3 15h7v6H3v-6z"
                  />
                </svg>
              }
            />
            <SidebarItem
              label="Pedidos"
              activePath="/pedidos"
              isOpen={openMenu === "pedidos"}
              onToggle={() => toggleMenu("pedidos")}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              }
              subItems={[
                {
                  to: "/pedidos",
                  label: "Listagem",
                  icon: <ListAlt />,
                  end: true,
                },
                {
                  to: "/pedidos/cadastrar",
                  label: "Novo Pedido",
                  icon: <AddCircleOutline />,
                },
              ]}
            />

            <SidebarItem
              label="Clientes"
              activePath="/clientes"
              isOpen={openMenu === "clientes"}
              onToggle={() => toggleMenu("clientes")}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              }
              subItems={[
                {
                  to: "/clientes",
                  label: "Listagem",
                  icon: <ListAlt />,
                  end: true,
                },
                {
                  to: "/clientes/cadastrar",
                  label: "Novo Cliente",
                  icon: <AddCircleOutline />,
                },
              ]}
            />

            <SidebarItem
              label="Produtos"
              activePath="/produtos"
              isOpen={openMenu === "produtos"}
              onToggle={() => toggleMenu("produtos")}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              }
              subItems={[
                {
                  to: "/produtos",
                  label: "Listagem",
                  icon: <ListAlt />,
                  end: true,
                },
                {
                  to: "/produtos/cadastrar",
                  label: "Novo Produto",
                  icon: <AddCircleOutline />,
                },
              ]}
            />
          </ul>
        </div>
      </aside>

      <main className="p-4 sm:ml-64 min-h-screen">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm min-h-[calc(100vh-2rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

export default App;
