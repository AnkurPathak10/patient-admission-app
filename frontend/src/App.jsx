import { useState, useEffect, useCallback } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  getOptions,
  getPatients,
  createPatient,
  updatePatient,
  deletePatient,
  dischargePatient,
} from "./api";
import PatientForm from "./components/PatientForm";
import PatientTable from "./components/PatientTable";
import Filters from "./components/Filters";
import ConfirmModal from "./components/ConfirmModal";
import Header from "./components/Header";

function App() {
  const [patients, setPatients] = useState([]);
  const [options, setOptions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);

  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    ward: "",
    department: "",
    doctor: "",
    status: "",
  });

  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    getOptions()
      .then((res) => setOptions(res.data))
      .catch(() => toast.error("Failed to load options"));
  }, []);

  const fetchPatients = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (filters.ward) params.ward = filters.ward;
      if (filters.department) params.department = filters.department;
      if (filters.doctor) params.doctor = filters.doctor;
      if (filters.status) params.status = filters.status;

      const res = await getPatients(params);
      setPatients(res.data);
    } catch {
      toast.error("Failed to fetch patients");
    } finally {
      setLoading(false);
    }
  }, [search, filters]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleAdd = () => {
    setEditingPatient(null);
    setShowForm(true);
  };

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleFormSubmit = async (data) => {
    try {
      if (editingPatient) {
        await updatePatient(editingPatient.id, data);
        toast.success("Patient updated successfully");
      } else {
        await createPatient(data);
        toast.success("Patient added successfully");
      }
      setShowForm(false);
      setEditingPatient(null);
      fetchPatients();
    } catch (err) {
      if (err.response?.status === 422) {
        const detail = err.response.data.detail;
        if (Array.isArray(detail)) {
          const messages = detail.map((e) => `${e.field}: ${e.message}`);
          toast.error(messages.join("\n"), { duration: 5000 });
          const errorMap = {};
          detail.forEach((e) => {
            errorMap[e.field] = e.message;
          });
          return errorMap;
        }
      }
      toast.error(err.response?.data?.detail || "Something went wrong");
      return null;
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) return;
    try {
      await deletePatient(confirmDelete.id);
      toast.success("Patient deleted");
      setConfirmDelete(null);
      fetchPatients();
    } catch {
      toast.error("Failed to delete patient");
    }
  };

  const handleDischarge = async (patient) => {
    try {
      await dischargePatient(patient.id);
      toast.success(`${patient.name} has been discharged`);
      fetchPatients();
    } catch (err) {
      toast.error(
        err.response?.data?.detail || "Failed to discharge patient"
      );
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setSearch("");
    setFilters({ ward: "", department: "", doctor: "", status: "" });
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#2d2d2d",
            color: "#f5f5f5",
            border: "1px solid #404040",
          },
        }}
      />

      <Header onAdd={handleAdd} />

      <main className="max-w-[1300px] mx-auto p-6 max-sm:p-4">
        <Filters
          options={options}
          search={search}
          onSearchChange={setSearch}
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        <PatientTable
          patients={patients}
          loading={loading}
          onEdit={handleEdit}
          onDelete={(p) => setConfirmDelete(p)}
          onDischarge={handleDischarge}
        />
      </main>

      {showForm && (
        <PatientForm
          options={options}
          patient={editingPatient}
          onSubmit={handleFormSubmit}
          onClose={() => {
            setShowForm(false);
            setEditingPatient(null);
          }}
        />
      )}

      {confirmDelete && (
        <ConfirmModal
          title="Delete Patient"
          message={`Are you sure you want to delete "${confirmDelete.name}"? This action cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(null)}
        />
      )}
    </div>
  );
}

export default App;
