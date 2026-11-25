"""
FastAPI application – Patient Admission Management API.
"""

from contextlib import asynccontextmanager
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from prisma import Prisma
from pydantic import ValidationError
from dotenv import load_dotenv

from schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse,
    OptionsResponse,
    GENDERS,
    WARDS,
    DEPARTMENTS,
    DOCTORS,
    STATUSES,
)

load_dotenv()

db = Prisma()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await db.connect()
    yield
    await db.disconnect()


app = FastAPI(
    title="Patient Admission Management API",
    version="1.0.0",
    lifespan=lifespan,
)

# CORS – allow the React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ─────────────────────────────────────────────────────────────

def _patient_to_response(p) -> dict:
    return {
        "id": p.id,
        "name": p.name,
        "age": p.age,
        "gender": p.gender,
        "ward": p.ward,
        "department": p.department,
        "doctor": p.doctor,
        "admissionDate": p.admissionDate.strftime("%Y-%m-%d"),
        "status": p.status,
        "createdAt": p.createdAt.isoformat(),
        "updatedAt": p.updatedAt.isoformat(),
    }


def _format_validation_errors(e: ValidationError) -> list[dict]:
    errors = []
    for err in e.errors():
        field = err["loc"][-1] if err["loc"] else "unknown"
        errors.append({"field": field, "message": err["msg"]})
    return errors


# ── Routes ──────────────────────────────────────────────────────────────

@app.get("/api/options", response_model=OptionsResponse)
async def get_options():
    """Return dropdown option lists for the frontend."""
    return {
        "genders": GENDERS,
        "wards": WARDS,
        "departments": DEPARTMENTS,
        "doctors": DOCTORS,
        "statuses": STATUSES,
    }


@app.get("/api/patients")
async def list_patients(
    search: Optional[str] = Query(None, description="Search by patient name"),
    ward: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    doctor: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
):
    """List all patients with optional search & filters."""
    where = {}

    if search:
        where["name"] = {"contains": search, "mode": "insensitive"}
    if ward:
        where["ward"] = ward
    if department:
        where["department"] = department
    if doctor:
        where["doctor"] = doctor
    if status:
        where["status"] = status

    patients = await db.patient.find_many(
        where=where,
        order={"createdAt": "desc"},
    )
    return [_patient_to_response(p) for p in patients]


@app.get("/api/patients/{patient_id}")
async def get_patient(patient_id: str):
    """Get a single patient by ID."""
    patient = await db.patient.find_unique(where={"id": patient_id})
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    return _patient_to_response(patient)


@app.post("/api/patients", status_code=201)
async def create_patient(payload: dict):
    """Create a new patient with full validation."""
    try:
        data = PatientCreate(**payload)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=_format_validation_errors(e))

    patient = await db.patient.create(
        data={
            "name": data.name,
            "age": data.age,
            "gender": data.gender,
            "ward": data.ward,
            "department": data.department,
            "doctor": data.doctor,
            "admissionDate": datetime.strptime(data.admissionDate, "%Y-%m-%d"),
            "status": data.status or "Admitted",
        }
    )
    return _patient_to_response(patient)


@app.put("/api/patients/{patient_id}")
async def update_patient(patient_id: str, payload: dict):
    """Update a patient with full validation."""
    existing = await db.patient.find_unique(where={"id": patient_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")

    try:
        data = PatientUpdate(**payload)
    except ValidationError as e:
        raise HTTPException(status_code=422, detail=_format_validation_errors(e))

    patient = await db.patient.update(
        where={"id": patient_id},
        data={
            "name": data.name,
            "age": data.age,
            "gender": data.gender,
            "ward": data.ward,
            "department": data.department,
            "doctor": data.doctor,
            "admissionDate": datetime.strptime(data.admissionDate, "%Y-%m-%d"),
            "status": data.status or "Admitted",
        },
    )
    return _patient_to_response(patient)


@app.patch("/api/patients/{patient_id}/discharge")
async def discharge_patient(patient_id: str):
    """Mark a patient as Discharged."""
    existing = await db.patient.find_unique(where={"id": patient_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")
    if existing.status == "Discharged":
        raise HTTPException(status_code=400, detail="Patient is already discharged")

    patient = await db.patient.update(
        where={"id": patient_id},
        data={"status": "Discharged"},
    )
    return _patient_to_response(patient)


@app.delete("/api/patients/{patient_id}")
async def delete_patient(patient_id: str):
    """Delete a patient."""
    existing = await db.patient.find_unique(where={"id": patient_id})
    if not existing:
        raise HTTPException(status_code=404, detail="Patient not found")

    await db.patient.delete(where={"id": patient_id})
    return {"message": "Patient deleted successfully"}


@app.get("/api/health")
async def health():
    return {"status": "ok"}

