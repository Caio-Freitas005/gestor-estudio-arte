import { NavLink, useLocation } from "react-router";
import { Collapse } from "@mui/material";
import { ExpandMore, ChevronRight } from "@mui/icons-material";

interface SubItem {
  to: string;
  label: string;
  icon: React.ReactNode;
  end?: boolean;
}

interface SidebarItemProps {
  to?: string;
  label: string;
  icon: React.ReactNode;
  activePath?: string;
  isOpen?: boolean;
  onToggle?: () => void;
  subItems?: SubItem[];
}

function SidebarItem({
  to,
  label,
  icon,
  activePath,
  isOpen,
  onToggle,
  subItems,
}: SidebarItemProps) {
  const location = useLocation();

  // Verifica se o caminho atual coincide com o activePath ou com o "to" direto
  const isCurrentPath = activePath
    ? location.pathname.includes(activePath)
    : to === "/"
    ? location.pathname === "/"
    : to
    ? location.pathname.includes(to)
    : false;

  const activeClass =
    "flex items-center p-3 text-pink-600 bg-pink-50 rounded-lg border-r-4 border-pink-500 group transition-all font-bold";
  const inactiveClass =
    "flex items-center p-3 text-gray-600 rounded-lg hover:bg-pink-50 hover:text-pink-600 group transition-all";

  const subItemClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-2 ps-11 text-sm rounded-lg transition-all ${
      isActive
        ? "text-pink-600 font-bold bg-pink-50/50"
        : "text-gray-500 hover:text-pink-500 hover:bg-pink-50/30"
    }`;

  if (!subItems || subItems.length === 0) {
    return (
      <li>
        <NavLink
          to={to || "/"}
          className={({ isActive }) => (isActive ? activeClass : inactiveClass)}
        >
          <div className="flex items-center">
            <span className="flex items-center !text-lg text-current">
              {icon}
            </span>
            <span className="ms-3">{label}</span>
          </div>
        </NavLink>
      </li>
    );
  }

  return (
    <li>
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between ${
          isCurrentPath ? activeClass : inactiveClass
        }`}
      >
        <div className="flex items-center">
          {icon}
          <span className="ms-3">{label}</span>
        </div>
        {isOpen || isCurrentPath ? (
          <ExpandMore fontSize="small" />
        ) : (
          <ChevronRight fontSize="small" />
        )}
      </button>

      <Collapse in={isOpen || isCurrentPath} timeout="auto">
        <ul className="py-2 space-y-1">
          {subItems?.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.end} className={subItemClass}>
                <span className="me-2 flex items-center !text-lg text-current">
                  {item.icon}
                </span>
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </Collapse>
    </li>
  );
}

export default SidebarItem;
