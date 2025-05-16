import { useState, useMemo } from 'react';
import type { Route } from './+types/component-state';
import { useNavigation } from 'react-router';

// Define proper types for country data
interface Country {
  cca3: string;
  name: {
    common: string;
    official: string;
  };
  region: string;
  population: number;
  capital?: string[];
  flags?: {
    svg: string;
    png: string;
  };
}

export async function clientLoader(): Promise<Country[]> {
  const res = await fetch('https://restcountries.com/v3.1/all');
  const data = await res.json();
  return data;
}

export default function ComponentState({
  loaderData,
}: Route.ComponentProps) {
  const [search, setSearch] = useState('');
  const [region, setRegion] = useState('');

  // Extract unique regions from data for dynamic region options
  const regions = useMemo(() => {
    const uniqueRegions = new Set(
      loaderData.map((country: Country) => country.region)
    );
    return Array.from(uniqueRegions).sort();
  }, [loaderData]);

  // Memoize filtered countries to prevent unnecessary recalculations
  const filteredCountries = useMemo(() => {
    return loaderData.filter((country: Country) => {
      const matchesRegion =
        !region ||
        country.region.toLowerCase() === region.toLowerCase();
      const matchesSearch =
        !search ||
        country.name.common
          .toLowerCase()
          .includes(search.toLowerCase());
      return matchesSearch && matchesRegion;
    });
  }, [loaderData, search, region]);

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold mb-2 text-gray-900">
            Explore Countries
          </h2>
          <p className="text-gray-600">
            Data filtering is handled locally within the component's
            state. (Try applying a filter — note that it resets if you
            refresh the page.)
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative w-full sm:w-1/2">
            <input
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Search countries"
            />
          </div>

          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
            aria-label="Filter by region"
          >
            <option value="">All Regions</option>
            {regions.map((regionName) => (
              <option
                key={regionName}
                value={regionName.toLowerCase()}
              >
                {regionName}
              </option>
            ))}
          </select>
        </div>

        {filteredCountries.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow">
            <p className="text-gray-600 text-lg">
              No countries match your filters.
            </p>
            <button
              onClick={() => {
                setSearch('');
                setRegion('');
              }}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="mb-4 text-gray-600">
            Found {filteredCountries.length}{' '}
            {filteredCountries.length === 1 ? 'country' : 'countries'}
          </div>
        )}

        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCountries.map((country: Country) => (
            <li
              key={country.cca3}
              className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
            >
              {country.flags?.svg && (
                <div className="h-40 overflow-hidden">
                  <img
                    src={country.flags.svg}
                    alt={`Flag of ${country.name.common}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="p-3">
                <h3 className="text-xl font-semibold">
                  {country.name.common}
                </h3>
                <div className="text-gray-600 mt-2 space-y-1">
                  <div>
                    <span>Region:</span> {country.region}
                  </div>
                  <div>
                    <span>Population:</span>{' '}
                    {country.population.toLocaleString()}
                  </div>
                  {country.capital && country.capital.length > 0 && (
                    <div>
                      <span>Capital:</span> {country.capital[0]}
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
