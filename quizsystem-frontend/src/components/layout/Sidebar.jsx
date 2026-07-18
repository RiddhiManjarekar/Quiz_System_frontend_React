import { NavLink } from "react-router-dom";
import { useEffect } from "react";

function Sidebar({
  menuItems = [],
  isOpen = false,
  onClose,
}) {
  /*
  |--------------------------------------------------------------------------
  | Prevent body scrolling when sidebar is open (mobile)
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    if (window.innerWidth < 1024) {
      document.body.style.overflow = isOpen ? "hidden" : "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Backdrop */}

      <div
        onClick={onClose}
        className={`
          fixed inset-0 z-40
          bg-black/50 backdrop-blur-[1px]
          transition-opacity duration-300
          lg:hidden
          ${
            isOpen
              ? "opacity-100 visible"
              : "opacity-0 invisible"
          }
        `}
      />

      {/* Sidebar */}

      <aside
        className={`
          fixed left-0 top-0 z-50
          flex h-dvh w-64 flex-col
          bg-slate-900 text-white shadow-2xl

          transition-transform duration-300 ease-in-out

          lg:w-72
          lg:translate-x-0

          ${
            isOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        {/* Logo */}

        <div className="flex h-16 shrink-0 items-center justify-between border-b border-slate-800 px-5 lg:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-lg">
              🎓
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-bold">
                Quiz System
              </h1>

              <p className="truncate text-xs text-slate-400">
                Management Portal
              </p>
            </div>
          </div>

          {/* Mobile Close */}

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="
              rounded-lg p-2
              transition
              hover:bg-slate-800
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
              lg:hidden
            "
          >
            ✕
          </button>
        </div>

        {/* Navigation */}

        <nav
          className="
            flex-1
            overflow-y-auto
            overscroll-contain
            p-4
          "
        >
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.end}
                  onClick={() => {
                    if (window.innerWidth < 1024) {
                      onClose?.();
                    }
                  }}
                  className={({ isActive }) =>
                    `
                    flex items-center gap-3

                    rounded-xl

                    px-4 py-3

                    transition-all
                    duration-200

                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500

                    ${
                      isActive
                        ? "bg-blue-600 text-white shadow-lg"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white hover:translate-x-1"
                    }
                  `
                  }
                >
                  <span className="shrink-0 text-xl">
                    {item.icon}
                  </span>

                  <span className="truncate font-medium">
                    {item.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer */}

        <div className="shrink-0 border-t border-slate-800 p-4 text-center">
          <p className="text-xs text-slate-400">
            © 2026 Quiz System
          </p>

          <p className="mt-1 text-[11px] text-slate-500">
            Version 1.0
          </p>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;