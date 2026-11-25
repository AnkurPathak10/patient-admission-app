"""
Validation schemas for Patient data.
Mirrors frontend Zod validation on the backend using Pydantic.
"""

from datetime import date, datetime
from typing import Optional
import re
from pydantic import BaseModel, field_validator, Field


# ── Allowed option lists (matching frontend) ──────────────────────────

GENDERS = ["Male", "Female", "Other"]

WARDS = [
    "General Ward",
    "Private Ward",
    "Semi-Private Ward",
    "ICU",
    "NICU",
    "Pediatric Ward",
    "Maternity Ward",
    "Surgical Ward",
    "Orthopedic Ward",
    "Psychiatric Ward",
]

DEPARTMENTS = [
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "Pediatrics",
    "Oncology",
    "Dermatology",
    "Gastroenterology",
    "Pulmonology",
    "Nephrology",
    "General Medicine",
]

DOCTORS = [
    "Dr. Sharma",
    "Dr. Patel",
    "Dr. Gupta",
    "Dr. Reddy",
    "Dr. Iyer",
    "Dr. Khan",
    "Dr. Joshi",
    "Dr. Nair",
    "Dr. Mehta",
    "Dr. Singh",
]

STATUSES = ["Admitted", "Discharged"]


# ── Pydantic schemas ────────────────────────────────────────────────────

class PatientCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    age: int = Field(..., ge=0, le=120)
    gender: str
    ward: str
    department: str
    doctor: str
    admissionDate: str  # ISO date string "YYYY-MM-DD"
    status: Optional[str] = "Admitted"

    @field_validator("name")
    @classmethod
    def name_letters_only(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("Name is required")
        if not re.match(r"^[A-Za-z\s]+$", v):
            raise ValueError("Name must contain letters and spaces only")
        return v

    @field_validator("age", mode="before")
    @classmethod
    def age_range(cls, v):
        v = int(v)
        if v < 0 or v > 120:
            raise ValueError("Age must be between 0 and 120")
        return v

    @field_validator("gender")
    @classmethod
    def gender_valid(cls, v: str) -> str:
        if v not in GENDERS:
            raise ValueError(f"Gender must be one of: {', '.join(GENDERS)}")
        return v

    @field_validator("ward")
    @classmethod
    def ward_valid(cls, v: str) -> str:
        if v not in WARDS:
            raise ValueError(f"Ward must be one of: {', '.join(WARDS)}")
        return v

    @field_validator("department")
    @classmethod
    def department_valid(cls, v: str) -> str:
        if v not in DEPARTMENTS:
            raise ValueError(f"Department must be one of: {', '.join(DEPARTMENTS)}")
        return v

    @field_validator("doctor")
    @classmethod
    def doctor_valid(cls, v: str) -> str:
        if v not in DOCTORS:
            raise ValueError(f"Doctor must be one of: {', '.join(DOCTORS)}")
        return v

    @field_validator("admissionDate")
    @classmethod
    def admission_date_not_future(cls, v: str) -> str:
        try:
            parsed = datetime.strptime(v, "%Y-%m-%d").date()
        except ValueError:
            raise ValueError("Admission date must be in YYYY-MM-DD format")
        if parsed > date.today():
            raise ValueError("Admission date cannot be a future date")
        return v

    @field_validator("status")
    @classmethod
    def status_valid(cls, v: str) -> str:
        if v and v not in STATUSES:
            raise ValueError(f"Status must be one of: {', '.join(STATUSES)}")
        return v


class PatientUpdate(PatientCreate):
    """Same validation rules as create."""
    pass


class PatientResponse(BaseModel):
    id: str
    name: str
    age: int
    gender: str
    ward: str
    department: str
    doctor: str
    admissionDate: str
    status: str
    createdAt: str
    updatedAt: str


class OptionsResponse(BaseModel):
    genders: list[str]
    wards: list[str]
    departments: list[str]
    doctors: list[str]
    statuses: list[str]

