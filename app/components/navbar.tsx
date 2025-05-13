import { NavLink } from 'react-router';

export const Navbar = () => {
  return (
    <header className="w-full shadow-sm">
      <div className="container px-4 flex flex-col md:flex-row items-center justify-between py-5 mx-auto max-w-7xl">
        <div className="flex flex-col md:flex-row items-center">
          <nav className="flex flex-wrap items-center leading-9">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `mr-5 ${
                  isActive
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/use-state"
              className={({ isActive }) =>
                `mr-5 ${
                  isActive
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              useState
            </NavLink>
            <NavLink
              to="/url-params"
              className={({ isActive }) =>
                `mr-5 ${
                  isActive
                    ? 'text-blue-600 font-medium'
                    : 'text-gray-600 hover:text-gray-900'
                }`
              }
            >
              useSearchParams
            </NavLink>
          </nav>
        </div>
      </div>
    </header>
  );
};
