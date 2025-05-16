import { useSearchParams } from 'react-router';
import { useMemo } from 'react';
import type { Route } from './+types/component-state';

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
  return data as Country[];
}

export default function SearchParamsComponent({
  loaderData,
}: Route.ComponentProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get('search') || '';
  const region = searchParams.get('region') || '';

  // Helper function for updating multiple params
  const updateParams = (
    updates: Record<string, string | null>,
    replace = true
  ) => {
    setSearchParams(
      (searchParams) => {
        Object.entries(updates).forEach(([key, value]) => {
          value !== null
            ? searchParams.set(key, value)
            : searchParams.delete(key);
        });
        return searchParams;
      },
      { replace }
    );
  };

  // Extract unique regions
  const regions = useMemo(() => {
    const uniqueRegions = new Set(
      loaderData.map((country: Country) => country.region)
    );
    return Array.from(uniqueRegions).sort();
  }, [loaderData]);

  // Filter countries
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

  // Event handlers using updateParams
  const handleSearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateParams({ search: e.target.value || null });
  };

  const handleRegionChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    updateParams({ region: e.target.value || null });
  };

  const resetFilters = () => {
    setSearchParams({});
  };

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between flex-wrap gap-3 mb-8 items-end">
          <div>
            <h2 className="text-3xl font-semibold mb-2 text-gray-900">
              Explore Countries
            </h2>
            <p className="text-gray-600">
              Filters are saved in the URL — so they stick around even
              after you refresh the page!
            </p>
          </div>

          {(search || region) && (
            <button
              onClick={resetFilters}
              className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition flex items-center gap-2"
              aria-label="Reset all filters"
            >
              <span>Reset All</span>
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative w-full sm:w-1/2">
            <input
              type="search"
              placeholder="Search by name..."
              value={search}
              onChange={handleSearchChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              aria-label="Search countries"
            />
          </div>

          <select
            value={region}
            onChange={handleRegionChange}
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
              onClick={resetFilters}
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
                    <span className="font-medium">Region:</span>{' '}
                    {country.region}
                  </div>
                  <div>
                    <span className="font-medium">Population:</span>{' '}
                    {country.population.toLocaleString()}
                  </div>
                  {country.capital && country.capital.length > 0 && (
                    <div>
                      <span className="font-medium">Capital:</span>{' '}
                      {country.capital[0]}
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

// import { useSearchParams } from 'react-router';
// import { useMemo } from 'react';
// import type { Route } from './+types/component-state';

// // Define proper types for country data
// interface Country {
//   cca3: string;
//   name: {
//     common: string;
//     official: string;
//   };
//   region: string;
//   population: number;
//   capital?: string[];
//   flags?: {
//     svg: string;
//     png: string;
//   };
// }

// export async function clientLoader(): Promise<Country[]> {
//   const res = await fetch('https://restcountries.com/v3.1/all');
//   const data = await res.json();
//   return data as Country[];
// }

// export default function SearchParamsComponent({
//   loaderData,
// }: Route.ComponentProps) {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const search = searchParams.get('search') || '';
//   const region = searchParams.get('region') || '';

//   // Extract unique regions from data for dynamic region options
//   const regions = useMemo(() => {
//     const uniqueRegions = new Set(
//       loaderData.map((country: Country) => country.region)
//     );
//     return Array.from(uniqueRegions).sort();
//   }, [loaderData]);

//   // Memoize filtered countries to prevent unnecessary recalculations
//   const filteredCountries = useMemo(() => {
//     return loaderData.filter((country: Country) => {
//       const matchesRegion =
//         !region ||
//         country.region.toLowerCase() === region.toLowerCase();
//       const matchesSearch =
//         !search ||
//         country.name.common
//           .toLowerCase()
//           .includes(search.toLowerCase());
//       return matchesSearch && matchesRegion;
//     });
//   }, [loaderData, search, region]);

//   // Update search parameter
//   const handleSearchChange = (
//     e: React.ChangeEvent<HTMLInputElement>
//   ) => {
//     const newSearch = e.target.value;

//     setSearchParams(
//       (searchParams) => {
//         if (newSearch) {
//           searchParams.set('search', newSearch);
//         } else {
//           searchParams.delete('search');
//         }
//         return searchParams;
//       },
//       { replace: true }
//     );
//   };

//   // Update region parameter
//   const handleRegionChange = (
//     e: React.ChangeEvent<HTMLSelectElement>
//   ) => {
//     const newRegion = e.target.value;
//     setSearchParams(
//       (searchParams) => {
//         if (newRegion) {
//           searchParams.set('region', newRegion);
//         } else {
//           searchParams.delete('region');
//         }
//         return searchParams;
//       },
//       { replace: true }
//     );
//   };

//   // Reset all filters
//   const resetFilters = () => {
//     setSearchParams({});
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen py-8">
//       <div className="container mx-auto px-4 max-w-7xl">
//         <div className="flex justify-between flex-wrap gap-3 mb-8 items-end">
//           <div>
//             <h2 className="text-3xl font-semibold mb-2 text-gray-900">
//               Explore Countries
//             </h2>
//             <p className="text-gray-600">
//               Filters are saved in the URL — so they stick around even
//               after you refresh the page!
//             </p>
//           </div>

//           {(search || region) && (
//             <button
//               onClick={resetFilters}
//               className="px-4 py-2 cursor-pointer bg-gray-200 hover:bg-gray-300 rounded-md text-gray-700 transition flex items-center gap-2"
//               aria-label="Reset all filters"
//             >
//               <span>Reset All</span>
//             </button>
//           )}
//         </div>

//         <div className="flex flex-col sm:flex-row gap-4 mb-8">
//           <div className="relative w-full sm:w-1/2">
//             <input
//               type="search"
//               placeholder="Search by name..."
//               value={search}
//               onChange={handleSearchChange}
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
//               aria-label="Search countries"
//             />
//           </div>

//           <select
//             value={region}
//             onChange={handleRegionChange}
//             className="w-full sm:w-1/2 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
//             aria-label="Filter by region"
//           >
//             <option value="">All Regions</option>
//             {regions.map((regionName) => (
//               <option
//                 key={regionName}
//                 value={regionName.toLowerCase()}
//               >
//                 {regionName}
//               </option>
//             ))}
//           </select>
//         </div>

//         {filteredCountries.length === 0 ? (
//           <div className="bg-white rounded-lg p-8 text-center shadow">
//             <p className="text-gray-600 text-lg">
//               No countries match your filters.
//             </p>
//             <button
//               onClick={resetFilters}
//               className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
//             >
//               Reset Filters
//             </button>
//           </div>
//         ) : (
//           <div className="mb-4 text-gray-600">
//             Found {filteredCountries.length}{' '}
//             {filteredCountries.length === 1 ? 'country' : 'countries'}
//           </div>
//         )}

//         <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredCountries.map((country: Country) => (
//             <li
//               key={country.cca3}
//               className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
//             >
//               {country.flags?.svg && (
//                 <div className="h-40 overflow-hidden">
//                   <img
//                     src={country.flags.svg}
//                     alt={`Flag of ${country.name.common}`}
//                     className="w-full h-full object-cover"
//                   />
//                 </div>
//               )}
//               <div className="p-3">
//                 <h3 className="text-xl font-semibold">
//                   {country.name.common}
//                 </h3>
//                 <div className="text-gray-600 mt-2 space-y-1">
//                   <div>
//                     <span className="font-medium">Region:</span>{' '}
//                     {country.region}
//                   </div>
//                   <div>
//                     <span className="font-medium">Population:</span>{' '}
//                     {country.population.toLocaleString()}
//                   </div>
//                   {country.capital && country.capital.length > 0 && (
//                     <div>
//                       <span className="font-medium">Capital:</span>{' '}
//                       {country.capital[0]}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </li>
//           ))}
//         </ul>
//       </div>
//     </div>
//   );
// }
