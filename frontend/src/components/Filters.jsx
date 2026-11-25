import { FiSearch, FiX } from "react-icons/fi";

function Filters({
  options,
  search,
  onSearchChange,
  filters,
  onFilterChange,
  onClearFilters,
}) {
  const hasActiveFilters =
    search || filters.ward || filters.department || filters.doctor || filters.status;

  const selectClass =
    "flex-1 min-w-[160px] max-sm:min-w-0 max-sm:w-full px-3.5 py-2.5 bg-dark-card border border-dark-border rounded-md text-dark-text text-sm cursor-pointer transition-colors focus:outline-none focus:border-accent-500";

  return (
    <div className="mb-6 flex flex-col gap-3.5">
      {/* Search bar */}
      <div className="relative flex items-center">
        <FiSearch className="absolute left-3.5 text-dark-faint text-lg" />
        <input
          type="text"
          placeholder="Search patients by name..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full py-3 pl-11 pr-10 bg-dark-card border border-dark-border rounded-xl text-dark-text text-[0.95rem] placeholder:text-dark-faint transition-colors focus:outline-none focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]"
        />
        {search && (
          <button
            className="absolute right-2.5 text-dark-faint hover:text-dark-text cursor-pointer"
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            <FiX className="text-lg" />
          </button>
        )}
      </div>

      {/* Filter dropdowns */}
      <div className="flex flex-wrap gap-2.5 items-center max-sm:flex-col">
        <select
          className={selectClass}
          value={filters.ward}
          onChange={(e) => onFilterChange("ward", e.target.value)}
        >
          <option value="">All Wards</option>
          {options?.wards?.map((w) => (
            <option key={w} value={w}>{w}</option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.department}
          onChange={(e) => onFilterChange("department", e.target.value)}
        >
          <option value="">All Departments</option>
          {options?.departments?.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.doctor}
          onChange={(e) => onFilterChange("doctor", e.target.value)}
        >
          <option value="">All Doctors</option>
          {options?.doctors?.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <select
          className={selectClass}
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
        >
          <option value="">All Statuses</option>
          {options?.statuses?.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="inline-flex items-center gap-1 px-3 py-2 text-sm border border-dark-border rounded-md text-dark-text hover:border-accent-500 hover:text-accent-400 transition-colors cursor-pointer"
          >
            <FiX /> Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default Filters;
