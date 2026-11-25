import { FiActivity, FiPlus } from "react-icons/fi";

function Header({ onAdd }) {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-accent-700 to-accent-500 shadow-lg">
      <div className="max-w-[1300px] mx-auto px-6 py-4 flex items-center justify-between gap-3 max-sm:flex-col max-sm:items-start">
        <div className="flex items-center gap-3 text-white">
          <FiActivity className="text-3xl" />
          <div>
            <h1 className="text-xl font-bold tracking-tight max-sm:text-lg">
              Patient Admission Manager
            </h1>
            <p className="text-sm opacity-85">Hospital Staff Dashboard</p>
          </div>
        </div>
        <button
          onClick={onAdd}
          className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-accent-500 text-dark-bg font-semibold rounded-lg hover:bg-accent-400 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(245,166,35,0.3)] transition-all cursor-pointer"
        >
          <FiPlus /> Add Patient
        </button>
      </div>
    </header>
  );
}

export default Header;
