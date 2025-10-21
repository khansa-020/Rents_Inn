'use client'

import { Search } from 'lucide-react'

export default function PropertyFilters({
  search, setSearch,
  filterLocation, setFilterLocation,
  filterSector, setFilterSector,
  filterPrice, setFilterPrice,
  locations = [], sectors = []
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto items-center">
      <div className="relative flex-1 sm:flex-none sm:w-72">
        <input
          type="text"
          placeholder="Search by name, location, sector..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-full bg-white/10 border border-white/20 text-white placeholder-white/60 py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-[#01F5FF]"
        />
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/60 w-4 h-4" />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <select
          value={filterLocation}
          onChange={(e) => setFilterLocation(e.target.value)}
          className="bg-white/10 border border-white/20 text-white rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01F5FF]"
        >
          <option value="">All Locations</option>
          {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
        </select>

        <select
          value={filterSector}
          onChange={(e) => setFilterSector(e.target.value)}
          className="bg-white/10 border border-white/20 text-white rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01F5FF]"
        >
          <option value="">All Sectors</option>
          {sectors.map(sec => <option key={sec} value={sec}>{sec}</option>)}
        </select>

        <select
          value={filterPrice}
          onChange={(e) => setFilterPrice(e.target.value)}
          className="bg-white/10 border border-white/20 text-white rounded-full px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#01F5FF]"
        >
          <option value="">Sort by Price</option>
          <option value="low">Low → High</option>
          <option value="high">High → Low</option>
        </select>
      </div>
    </div>
  )
}
