import { FiAlertTriangle } from "react-icons/fi";

function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="bg-dark-secondary border border-dark-border rounded-2xl w-full max-w-[420px] shadow-2xl animate-modal-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8 text-center">
          <FiAlertTriangle className="text-4xl text-status-danger mx-auto mb-3" />
          <h3 className="text-lg font-bold text-dark-text mb-2">{title}</h3>
          <p className="text-sm text-dark-muted leading-relaxed mb-6">{message}</p>
          <div className="flex justify-center gap-3">
            <button
              onClick={onCancel}
              className="px-5 py-2.5 text-sm font-semibold border border-dark-border rounded-md text-dark-text hover:border-accent-500 hover:text-accent-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              className="px-5 py-2.5 text-sm font-semibold bg-status-danger text-white rounded-md hover:bg-red-600 transition-colors cursor-pointer"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
