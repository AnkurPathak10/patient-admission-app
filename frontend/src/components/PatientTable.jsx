import { FiEdit2, FiTrash2, FiCheckCircle } from "react-icons/fi";

function PatientTable({ patients, loading, onEdit, onDelete, onDischarge }) {
  if (loading) {
    return (
      <div className="text-center py-16 text-dark-muted">
        <div className="w-9 h-9 border-[3px] border-dark-border border-t-accent-500 rounded-full mx-auto mb-4 animate-spin-slow" />
        <p>Loading patients...</p>
      </div>
    );
  }

  if (patients.length === 0) {
    return (
      <div className="text-center py-16 text-dark-muted">
        <p className="text-lg font-semibold mb-1">No patients found</p>
        <p className="text-sm text-dark-faint">
          Add a new patient or adjust your filters.
        </p>
      </div>
    );
  }

  const badgeClass = (status) =>
    status === "Admitted"
      ? "inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-accent-500/15 text-accent-400 border border-accent-500/30"
      : "inline-block px-2.5 py-1 rounded-full text-xs font-semibold tracking-wide bg-status-success/15 text-status-success border border-status-success/30";

  const iconBtnBase =
    "inline-flex items-center justify-center w-[34px] h-[34px] rounded-md bg-transparent border-none cursor-pointer transition-all text-dark-muted hover:bg-dark-input";

  return (
    <>
      {/* ── Desktop / Tablet table ──────────────────────────────── */}
      <div className="hidden sm:block overflow-x-auto rounded-xl border border-dark-border bg-dark-secondary shadow-sm">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {["Name", "Age", "Gender", "Ward", "Department", "Doctor", "Admitted", "Status", "Actions"].map(
                (h) => (
                  <th
                    key={h}
                    className="px-4 py-3.5 text-left text-[0.78rem] font-bold uppercase tracking-wider text-accent-400 bg-dark-elevated border-b-2 border-accent-700 whitespace-nowrap"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {patients.map((p) => (
              <tr
                key={p.id}
                className="transition-colors hover:bg-accent-500/[0.04] last:border-b-0"
              >
                <td className="px-4 py-3 text-sm font-semibold text-accent-300 border-b border-dark-border">
                  {p.name}
                </td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">{p.age}</td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">{p.gender}</td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">{p.ward}</td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">{p.department}</td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">{p.doctor}</td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">
                  {new Date(p.admissionDate).toLocaleDateString("en-IN")}
                </td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">
                  <span className={badgeClass(p.status)}>{p.status}</span>
                </td>
                <td className="px-4 py-3 text-sm border-b border-dark-border">
                  <div className="flex gap-1">
                    <button
                      className={`${iconBtnBase} hover:text-accent-400`}
                      onClick={() => onEdit(p)}
                      title="Edit patient"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      className={`${iconBtnBase} hover:text-status-danger`}
                      onClick={() => onDelete(p)}
                      title="Delete patient"
                    >
                      <FiTrash2 />
                    </button>
                    {p.status === "Admitted" && (
                      <button
                        className={`${iconBtnBase} hover:text-status-success`}
                        onClick={() => onDischarge(p)}
                        title="Discharge patient"
                      >
                        <FiCheckCircle />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Mobile cards ────────────────────────────────────────── */}
      <div className="flex flex-col gap-3.5 sm:hidden">
        {patients.map((p) => (
          <div
            key={p.id}
            className="bg-dark-card border border-dark-border rounded-xl p-4 shadow-sm"
          >
            {/* Card header */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-base font-bold text-accent-300">{p.name}</h3>
              <span className={badgeClass(p.status)}>{p.status}</span>
            </div>

            {/* Card details */}
            <div className="grid grid-cols-2 gap-2 mb-3.5 text-[0.85rem]">
              <div>
                <span className="text-dark-faint mr-1">Age:</span>
                <span>{p.age}</span>
              </div>
              <div>
                <span className="text-dark-faint mr-1">Gender:</span>
                <span>{p.gender}</span>
              </div>
              <div>
                <span className="text-dark-faint mr-1">Ward:</span>
                <span>{p.ward}</span>
              </div>
              <div>
                <span className="text-dark-faint mr-1">Dept:</span>
                <span>{p.department}</span>
              </div>
              <div>
                <span className="text-dark-faint mr-1">Doctor:</span>
                <span>{p.doctor}</span>
              </div>
              <div>
                <span className="text-dark-faint mr-1">Admitted:</span>
                <span>{new Date(p.admissionDate).toLocaleDateString("en-IN")}</span>
              </div>
            </div>

            {/* Card actions */}
            <div className="flex gap-2 flex-wrap border-t border-dark-border pt-3">
              <button
                onClick={() => onEdit(p)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-dark-border rounded-md text-dark-text hover:border-accent-500 hover:text-accent-400 transition-colors cursor-pointer"
              >
                <FiEdit2 /> Edit
              </button>
              <button
                onClick={() => onDelete(p)}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-status-danger rounded-md text-status-danger hover:bg-status-danger/15 transition-colors cursor-pointer"
              >
                <FiTrash2 /> Delete
              </button>
              {p.status === "Admitted" && (
                <button
                  onClick={() => onDischarge(p)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold border border-status-success rounded-md text-status-success hover:bg-status-success/15 transition-colors cursor-pointer"
                >
                  <FiCheckCircle /> Discharge
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default PatientTable;
