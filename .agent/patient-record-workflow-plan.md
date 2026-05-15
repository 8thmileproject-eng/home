# Patient Record 3-Stage Workflow Implementation Plan

## Overview
Split the current single-step patient record form into 3 sequential stages (Admin → Nursing → Doctor). Each role submits their section independently; the record moves down the pipeline.

---

## Phase 1: Data Model & API

### 1a. Update `DataEntry` schema (`dataEntryStore.ts`)
Add these fields to the `DataEntry` interface and `mapDoc`:
```ts
stage: "registration" | "nursing" | "doctor" | "complete"
completedStages: {
  registration?: { completedBy: string; completedAt: Date; name: string }
  nursing?: { completedBy: string; completedAt: Date; name: string }
  doctor?: { completedBy: string; completedAt: Date; name: string }
}
```

### 1b. Update API (`data-entry/route.ts`)
- **GET** — accept `?stage=` param to filter by stage
- **POST** — create registration (stage: "registration"), require only fullName
- **PATCH** `[id]` — submit next stage's data + update stage + record completedBy
  - `PATCH /api/admin/data-entry/[id]` with `{ stage: "nursing", ...fields }`

### 1c. Create `[id]` route
New file: `src/app/api/admin/data-entry/[id]/route.ts`

---

## Phase 2: Pages

### 2a. Registration page (`/admin/patient-record/registration`)
- Only Section A fields: fullName, gender, dateOfBirth, phoneNumber, address, occupation, maritalStatus, nextOfKin, nextOfKinPhone
- Submit → creates entry with `stage: "registration"`

### 2b. Nursing page (`/admin/patient-record/nursing`)
- Top: queue of patients at `stage: "registration"` (click to select)
- Once selected: show Section A (read-only) + Section B (Medical History) + Section C (Vitals)
- Submit → `PATCH` to update stage to "nursing", save B + C + nurse name

### 2c. Doctor page (`/admin/patient-record/doctor`)
- Top: queue of patients at `stage: "nursing"` (click to select)
- Once selected: show Section A + B + C (read-only) + Sections D–I
- Submit → `PATCH` to update stage to "doctor" or "complete"

### 2d. Remove old `/add` page
Delete or redirect to `/registration`

---

## Phase 3: Navigation & Permissions

### 3a. Update sidebar (`layout.tsx`)
Replace single "Add Record" with 3 sub-items, each with permission check:
| Item | Permission required |
|---|---|
| Registration | `patient-record` (admin-level) |
| Nursing | `patient-record` + nursing role |
| Doctor | `patient-record` + doctor role |

Super admin sees all.

### 3b. Settings → Roles
Ensure the roles API auto-discovers the new pages. The `getAdminPages()` scans directory → new pages show up automatically.

---

## Phase 4: Update List & Dashboard

### 4a. List page
Show `stage` column, filter/search by stage

### 4b. Dashboard
Show counts per stage (registration / nursing / doctor / complete)

---

## Implementation Order
1. Data model + store functions
2. API routes (GET with stage filter, PATCH with [id])
3. Registration page
4. Nursing page (with queue)
5. Doctor page (with queue)
6. Sidebar navigation update
7. Dashboard update
8. List page update
9. Build & verify
