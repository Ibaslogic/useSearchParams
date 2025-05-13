import { NavLink } from 'react-router';
import type { Route } from './+types/home';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'New React Router App' },
    { name: 'description', content: 'Welcome to React Router!' },
  ];
}

export default function Home() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4 max-w-7xl">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          About This Demo
        </h2>
        <p className="text-gray-600 mb-6">
          This application demonstrates two different approaches to
          managing state in a React application with data filtering
          capabilities:
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              Component State
            </h3>
            <p className="text-gray-600 mb-4">
              Uses React's useState hook to manage filtering state
              locally within the component. The state is lost when
              refreshing the page or sharing the URL.
            </p>
            <NavLink
              to="/use-state"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Try Component State
            </NavLink>
          </div>

          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
            <h3 className="text-xl font-medium text-gray-800 mb-3">
              URL Search Params
            </h3>
            <p className="text-gray-600 mb-4">
              Uses URL search parameters to persist the filtering
              state. The state is preserved when refreshing or sharing
              the URL, making it more user-friendly.
            </p>
            <NavLink
              to="/url-params"
              className="inline-block px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Try URL Params
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
