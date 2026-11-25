import { useState, useEffect } from "react";
import { FiX } from "react-icons/fi";
import { validatePatient } from "../validation";

function PatientForm({ options, patient, onSubmit, onClose }) {
  const isEditing = !!patient;

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    ward: "",
    department: "",
    doctor: "",
    admissionDate: new Date().toISOString().split("T")[0],
    status: "Admitted",
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (patient) {
      setFormData({
        name: patient.name || "",
        age: patient.age?.toString() || "",
        gender: patient.gender || "",
        ward: patient.ward || "",
        department: patient.department || "",
        doctor: patient.doctor || "",
        admissionDate: patient.admissionDate || "",
        status: patient.status || "Admitted",
      });
    }
  }, [patient]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validation = validatePatient({
      ...formData,
      age: formData.age === "" ? undefined : Number(formData.age),
    });

    if (!validation.success) {
      setErrors(validation.errors);
      return;
    }

    setSubmitting(true);
    const backendErrors = await onSubmit({
      ...validation.data,
      age: Number(validation.data.age),
    });
    if (backendErrors) {
      setErrors(backendErrors);
    }
    setSubmitting(false);
  };

  const today = new Date().toISOString().split("T")[0];

  const inputBase =
    "w-full px-3.5 py-2.5 bg-dark-input border rounded-md text-dark-text text-sm transition-colors placeholder:text-dark-faint focus:outline-none focus:border-accent-500 focus:shadow-[0_0_0_3px_rgba(245,166,35,0.15)]";
  const inputOk = `${inputBase} border-dark-border`;
  const inputErr = `${inputBase} border-status-danger`;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-dark-secondary border border-dark-border rounded-2xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl animate-modal-in max-sm:max-h-[95vh] max-sm:m-2"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-dark-border">
          <h2 className="text-lg font-bold text-accent-400">
            {isEditing ? "Edit Patient" : "Add New Patient"}
          </h2>
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center w-8 h-8 rounded-md hover:bg-dark-input text-dark-muted transition-colors cursor-pointer"
            aria-label="Close"
          >
            <FiX className="text-lg" />
          </button>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-6 max-sm:p-4 flex flex-col gap-4"
        >
          {/* Name */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="name" className="text-sm font-semibold text-dark-muted">
              Name <span className="text-accent-500">*</span>
            </label>
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Enter patient name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? inputErr : inputOk}
            />
            {errors.name && (
              <span className="text-xs text-status-danger font-medium">{errors.name}</span>
            )}
          </div>

          {/* Age */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="age" className="text-sm font-semibold text-dark-muted">
              Age <span className="text-accent-500">*</span>
            </label>
            <input
              id="age"
              name="age"
              type="number"
              min="0"
              max="120"
              placeholder="0 – 120"
              value={formData.age}
              onChange={handleChange}
              className={errors.age ? inputErr : inputOk}
            />
            {errors.age && (
              <span className="text-xs text-status-danger font-medium">{errors.age}</span>
            )}
          </div>

          {/* Gender */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="gender" className="text-sm font-semibold text-dark-muted">
              Gender <span className="text-accent-500">*</span>
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={errors.gender ? inputErr : inputOk}
            >
              <option value="">Select Gender</option>
              {options?.genders?.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
            {errors.gender && (
              <span className="text-xs text-status-danger font-medium">{errors.gender}</span>
            )}
          </div>

          {/* Ward */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ward" className="text-sm font-semibold text-dark-muted">
              Ward <span className="text-accent-500">*</span>
            </label>
            <select
              id="ward"
              name="ward"
              value={formData.ward}
              onChange={handleChange}
              className={errors.ward ? inputErr : inputOk}
            >
              <option value="">Select Ward</option>
              {options?.wards?.map((w) => (
                <option key={w} value={w}>{w}</option>
              ))}
            </select>
            {errors.ward && (
              <span className="text-xs text-status-danger font-medium">{errors.ward}</span>
            )}
          </div>

          {/* Department */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="department" className="text-sm font-semibold text-dark-muted">
              Department <span className="text-accent-500">*</span>
            </label>
            <select
              id="department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className={errors.department ? inputErr : inputOk}
            >
              <option value="">Select Department</option>
              {options?.departments?.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.department && (
              <span className="text-xs text-status-danger font-medium">{errors.department}</span>
            )}
          </div>

          {/* Doctor */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="doctor" className="text-sm font-semibold text-dark-muted">
              Doctor <span className="text-accent-500">*</span>
            </label>
            <select
              id="doctor"
              name="doctor"
              value={formData.doctor}
              onChange={handleChange}
              className={errors.doctor ? inputErr : inputOk}
            >
              <option value="">Select Doctor</option>
              {options?.doctors?.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            {errors.doctor && (
              <span className="text-xs text-status-danger font-medium">{errors.doctor}</span>
            )}
          </div>

          {/* Admission Date */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="admissionDate" className="text-sm font-semibold text-dark-muted">
              Admission Date <span className="text-accent-500">*</span>
            </label>
            <input
              id="admissionDate"
              name="admissionDate"
              type="date"
              max={today}
              value={formData.admissionDate}
              onChange={handleChange}
              className={errors.admissionDate ? inputErr : inputOk}
            />
            {errors.admissionDate && (
              <span className="text-xs text-status-danger font-medium">
                {errors.admissionDate}
              </span>
            )}
          </div>

          {/* Status (edit only) */}
          {isEditing && (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="status" className="text-sm font-semibold text-dark-muted">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className={inputOk}
              >
                <option value="Admitted">Admitted</option>
                <option value="Discharged">Discharged</option>
              </select>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2.5 pt-3 border-t border-dark-border">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold border border-dark-border rounded-md text-dark-text hover:border-accent-500 hover:text-accent-400 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 text-sm font-semibold bg-accent-500 text-dark-bg rounded-md hover:bg-accent-400 hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(245,166,35,0.3)] transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Update Patient"
                : "Add Patient"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientForm;
