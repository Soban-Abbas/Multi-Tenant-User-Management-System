# Multi-Tenant User Management System

A backend system built with **Node.js + Express + PostgreSQL** that allows multiple companies (tenants) to register on the platform, onboard their own employees using a unique **company code**, and manage those employees (search, filter, paginate, deactivate/reactivate) — all isolated per company via `company_id`.

Authentication is handled with **JWT**, and access control is role-based (`company`, `manager`, `employee`).

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express 5 |
| Database | PostgreSQL (`pg`) |
| Auth | JSON Web Tokens (`jsonwebtoken`) |
| Password Hashing | `bcrypt` |
| Validation | `express-validator` |
| Env Config | `dotenv` |

---

## Project Structure

```
src/
├── app.js                     # App entry point, mounts routes + error middleware
├── controllers/
│   ├── companyController.js   # Business logic for company routes
│   └── employeeController.js  # Business logic for employee routes
├── models/
│   ├── companyModel.js        # DB queries for companies
│   └── employeeModel.js       # DB queries for employees
├── routes/
│   ├── companyRoutes.js       # /company/* route definitions
│   └── employeeRoutes.js      # /employee/* route definitions
├── middlewares/
│   └── globalErrorHandlingMiddleware.js  # Central error handler
├── helpers/
│   ├── isCompany.js           # Role guard: only 'company'
│   ├── isCompanyEmployees.js  # Role guard: 'employee' or 'manager'
│   ├── isEmployee.js          # Role guard: only 'employee'
│   ├── isManager.js           # Role guard: only 'manager'
│   ├── isAdmin.js             # Role guard: only 'admin'
│   ├── is_active.js           # Checks employee.is_active before allowing action
│   ├── checkEmailandPass.js   # Basic email/password sanity check
│   └── startserver.js         # Creates tables (if not exist) + starts Express server
├── util/
│   ├── generateJWT.js         # Signs JWT (1h expiry)
│   └── verifyToken.js         # Verifies JWT, attaches decoded payload to req.details
├── validators/
│   ├── companyFormValidation.js    # Register-company validation rules
│   ├── companyLoginValidation.js   # Login validation (used by both company & employee login)
│   └── employeeFormValidation.js   # Register-employee validation rules
└── database/
    ├── pool.js                # pg Pool connection
    ├── tablesCreation.js      # CREATE TABLE IF NOT EXISTS (companies, employees)
    └── altertable.js          # One-off ALTER TABLE script (adds company_code column)
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
database=your_db_name
user=your_db_user
password=your_db_password
host=localhost
port=5432

jwtKey=your_jwt_secret_key
```

## Setup & Run

```bash
npm install
npm run dev     # nodemon
# or
npm start
```

Server runs on **`http://localhost:3000`**. Tables (`companies`, `employees`) are auto-created on startup if they don't already exist.

---

## Authentication

- On successful **login** (company or employee), a JWT is returned in the response body.
- Protected routes expect the token in the header:
  ```
  Authorization: Bearer <token>
  ```
- `verifyToken` middleware decodes the token and attaches the payload to `req.details` → `{ id, email, role }`.
- Role-guard middlewares (`IsCompany`, `isCompanyEmployees`, etc.) then check `req.details.role`.

---

## API Endpoints

### Base URL: `http://localhost:3000`

---

## 🏢 Company Routes — `/company`

### 1. Register Company
**`POST /company/register`**
Public route. Validates input, hashes password, generates a unique `company_code` (used later by employees to join).

**Request Body**
```json
{
  "name": "Acme Corp",
  "email": "acme@company.com",
  "password": "secret123",
  "confirmPassword": "secret123"
}
```

**Success — 201**
```json
{
  "message": "New Company added Successfully",
  "companyDetails": {
    "id": 1,
    "name": "Acme Corp",
    "email": "acme@company.com",
    "total_employees_registered": 0,
    "company_code": "a1b2c3d4"
  }
}
```

**Error — 422** (validation failed, e.g. name > 15 chars, invalid email, email already registered, password/confirmPassword mismatch, password < 5 chars)
```json
{ "error": [ /* array of express-validator error objects */ ] }
```

**Error — 400** (insert failed unexpectedly)
```json
{ "error": "Registration Failed! " }
```

---

### 2. Company Login
**`POST /company/login`**
Public route.

**Request Body**
```json
{
  "email": "acme@company.com",
  "password": "secret123"
}
```

**Success — 200**
```json
{
  "message": "Company Login Successfull",
  "companyData": {
    "id": 1,
    "name": "Acme Corp",
    "company_email": "acme@company.com",
    "company_code": "a1b2c3d4",
    "total_employees": 3,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error — 401** (missing/invalid email or password format, checked before hitting DB)
```json
{ "error": "Wrong email or password" }
```

**Error — 401** (email not found in DB, or password doesn't match)
```json
{ "error": "wrong Email or password" }
```

> ⚠️ Note: there are two slightly differently-cased "wrong email/password" messages coming from two different layers (validator vs controller) — see **Known Issues** below.

---

### 3. Search Employees by Name
**`GET /company/search/employee?name=john`**
🔒 Requires `Authorization` header + role `company`.

**Query Params:** `name` (optional, partial match, case-insensitive, limited to 3 results)

**Success — 200**
```json
{
  "data": [
    { "id": 5, "name": "John Doe", "email": "john@acme.com", "role": "employee" }
  ]
}
```

**Error — 404**
```json
{ "error": "No match found" }
```

**Error — 401** (no token / wrong role)
```json
{ "error": "Please Login First" }
```
```json
{ "error": "Only company Can Access this route" }
```

---

### 4. Filter Employees (active / inactive)
**`GET /company/employees/filter?active=true&page=1&limit=10`**
🔒 Requires `Authorization` header + role `company`.

**Query Params:** `active` (`true`/`false`, default `true`), `page`, `limit`

**Success — 200**
```json
{
  "message": "Active Employees",
  "activeEmployees": [
    { "id": 5, "name": "John Doe", "email": "john@acme.com", "role": "employee", "is_active": true }
  ]
}
```

**Error — 404**
```json
{ "error": "NO  Employee is Active " }
```
or
```json
{ "error": "NO  Employee is InActive " }
```

---

### 5. Recover / Reactivate Employee Account
**`PUT /company/recoverAccount`**
🔒 Requires `Authorization` header + role `company`. Reactivates a soft-deleted employee that belongs to the requesting company.

**Request Body**
```json
{
  "email": "john@acme.com",
  "password": "secret123"
}
```

**Success — 200**
```json
{
  "message": "Employee Account Activated Successfully",
  "id": 5,
  "name": "John Doe",
  "Employee_Email": "john@acme.com",
  "activation": true
}
```

**Error — 401** (employee belongs to a different company)
```json
{ "error": "This Employee is not associated with your company" }
```

**Error — 409** (employee already active)
```json
{ "error": "This Employee is already active" }
```

**Error — 401** (wrong password)
```json
{ "error": "Wrong email or password" }
```

---

### 6. Get All Employees (Paginated)
**`GET /company/employees?page=1&limit=10`**
🔒 Requires `Authorization` header + role `company`.

**Success — 200**
```json
{
  "message": "Employees fetch successfully",
  "employees": [
    { "id": 5, "name": "John Doe", "email": "john@acme.com", "role": "employee", "is_active": true }
  ]
}
```

**Error — 404**
```json
{ "error": " employee  not found" }
```

---

## 👤 Employee Routes — `/employee`

### 1. Register Employee
**`POST /employee/register`**
Public route. Employee joins a company using the company's `company_code`.

**Request Body**
```json
{
  "name": "John Doe",
  "email": "john@acme.com",
  "password": "secret123",
  "confirmPassword": "secret123",
  "company_code": "a1b2c3d4",
  "role": "employee"
}
```
> `role` must be `"employee"` or `"manager"`.

**Success — 201**
```json
{
  "message": "Employee register successfully",
  "employeeDetails": {
    "id": 5,
    "name": "John Doe",
    "email": "john@acme.com",
    "role": "employee",
    "company": "Acme Corp"
  }
}
```

**Error — 422** (validation errors: name < 4 chars / non-letters, invalid email, password < 6 chars, password mismatch, empty company_code, invalid role)
```json
{ "error": [ /* array of express-validator error objects */ ] }
```

**Error — 422** (wrong company code)
```json
{ "error": "Wrong Company Code" }
```

**Error — 422** (duplicate email)
```json
{ "error": "Email already registed" }
```

---

### 2. Employee Login
**`POST /employee/login`**
Public route.

**Request Body**
```json
{
  "email": "john@acme.com",
  "password": "secret123"
}
```

**Success — 200**
```json
{
  "id": 5,
  "name": "John Doe",
  "email": "john@acme.com",
  "role": "employee",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Error — 401** (format-level check, or wrong password)
```json
{ "error": "Wrong email or password" }
```

**Error — 404** (account deactivated by company)
```json
{ "error": "To login your profile please contact youe company" }
```

---

### 3. Delete (Soft-Delete) Employee
**`DELETE /employee/delete`**
🔒 Requires `Authorization` header, employee must currently be active, role must be `employee` or `manager`. Sets `is_active = false` (does not remove the row).

**Request Body**
```json
{
  "email": "john@acme.com",
  "password": "secret123"
}
```

**Success — 200**
```json
{ "message": "Employee deleted Successfully" }
```

**Error — 404** (already inactive / not found)
```json
{ "error": "User not Found " }
```

**Error — 401** (wrong password / not logged in / wrong role)
```json
{ "error": "Wrong email or password" }
```

---

## Error Response Format (Global)

Any unhandled/thrown error not caught explicitly in a controller falls through `next(error)` into the global error handler:

```js
res.status(err.status || 500).json({
  error: err.message || "Internal Server Error"
})
```

So **every error response across the API follows this shape**:
```json
{ "error": "<message>" }
```
except validation errors from `express-validator`, which return:
```json
{ "error": [ /* array of { type, value, msg, path, location } */ ] }
```

---

## Database Schema

**companies**
| column | type |
|---|---|
| id | serial (PK) |
| name | varchar(20) |
| email | varchar(40) |
| password | text (hashed) |
| total_employees | integer, default 0 |
| company_code | varchar (unique, added via `altertable.js`) |

**employees**
| column | type |
|---|---|
| id | serial (PK) |
| name | varchar(20) |
| email | varchar(40) |
| password | text (hashed) |
| department | varchar(20), default null |
| role | varchar(20) — `employee` / `manager` |
| company | varchar(20) |
| company_id | integer (FK → companies.id) |
| is_active | boolean, default true |

---

## Known Issues / Things to Clean Up

A few things worth fixing as you keep improving this project:

1. **Inconsistent error messages** — `/company/login` and `/employee/login` can return "Wrong email or password" (from validator) OR a differently-cased "wrong Email or password" (from the model layer). Worth unifying into one message.
2. **`filterEmployees` response bug** — when `active=false`, the success message still says `"Active Employees"` instead of `"Inactive Employees"`.
3. **Typo** — `"To login your profile please contact youe company"` → should be *"your"*.
4. **`is_active` query param default** — `req.query.active || true` means an unset query string always evaluates truthy the first time even before the `=== "true"` check runs; works, but slightly fragile logic worth double-checking with edge cases like `active=false` as a literal string vs boolean.
5. **`altertable.js`** — not awaited (`pool.query(...)` without `await`) and currently commented out in `startserver.js`. Fine for now since `company_code` is already part of `tablesCreation.js`'s create statement... actually it isn't in `tablesCreation.js`'s `companies` table definition, only added via `altertable.js`. Worth adding `company_code` directly into `tablesCreation.js` so a fresh DB doesn't miss the column.
6. No **rate limiting** or **helmet**-style security headers yet — good next addition before any real deployment.

Let me know if you want me to actually go fix any of these in the code, or if you want a **Postman collection** / `.http` file generated alongside this README.
