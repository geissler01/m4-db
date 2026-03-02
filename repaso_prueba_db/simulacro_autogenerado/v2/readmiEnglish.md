# Nexus Billing & Analytics System

A professional Backend solution for managing service billing, employee performance tracking, and business intelligence. This system utilizes a hybrid database approach (**MySQL** for relational data and **MongoDB** for audit logging) and is fully containerized via **Docker**.

---

## Features

- **Hybrid Database Architecture**:
  - **MySQL**: Handles core business logic (Sales, Employees, Customers, Services).
  - **MongoDB**: Stores real-time audit logs for every sensitive operation (Insert, Update, Delete).

- **Automated Database Initialization**:
  - DDL scripts run automatically on startup to ensure the schema is ready.

- **Bulk Data Ingestion**:
  - Custom seeder endpoints to import data via JSON files using Multer.

- **Full CRUD Operations**:
  - Complete management of Sales transactions.

- **Business Intelligence (BI) Endpoints**:
  - Ranking of top-performing employees and service category analysis.

- **Global Error Handling**:
  - Robust middleware to capture and report system errors without crashing.

---

## Technical Stack

- **Runtime**: Node.js & Express
- **Relational DB**: MySQL 8.0
- **NoSQL DB**: MongoDB (Running in Docker)
- **File Handling**: Multer
- **Environment Management**: Dotenv
- **Database Driver**: mysql2/promise

---

## Project Structure

```text
nexus-billing/
├── config/
│   └── db.js            # Database connections (MySQL & Mongo)
├── queries/
│   ├── ddl.js           # Database schema & table creation
│   ├── seeder.js        # Bulk data insertion logic
│   ├── reports.js       # BI & Analytics SELECT queries
│   ├── audit.js         # MongoDB logging logic
│   └── crudSales.js     # Sales CRUD operations (Full Lifecycle)
├── uploads/             # Temporary folder for file processing
├── .env                 # Environment variables (DB credentials)
├── .gitignore           # Files to ignore (node_modules, .env)
└── router.js            # Main entry point & API routes
```

---

## Setup & Installation

### 1. Prerequisites

Node.js (v16+)  
Docker Desktop  
MySQL Server  

---

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=nexus_billing
MONGO_URI=mongodb://localhost:27017/audit_db
```

---

### 3. All Required Commands

#### Docker Commands (MongoDB Setup)

```bash
# Pull and run MongoDB container
docker run -d --name mongo-audit -p 27017:27017 mongo

# Check if container is running
docker ps

# Stop the container
docker stop mongo-audit

# Start the container again
docker start mongo-audit
```

---

#### NPM Commands (App Setup)

```bash
# Initialize project and install dependencies
npm install express mysql2 mongoose dotenv multer

# Start the application
node router.js

# Start with auto-reload (if nodemon is installed)
npx nodemon router.js
```

---

## API Reference

### Data Import (Bulk Upload via Multer)

**POST** `/import/:table`

Description: Upload a JSON file.  
Key: `archivo` (type: File).

Tables: categories, companies, customers, services, employees, sales.

---

### Sales Management (CRUD)

**POST** `/sales/single`  
Create a new sale manually.

**GET** `/sales/:id`  
Get details of a specific sale.

**PUT** `/sales/:id`  
Update sale information (Quantity, Date, Invoice).

**DELETE** `/sales/:id`  
Remove a sale record.

---

### Analytics & Reports (BI)

**GET** `/reports/ranking`  
Employee performance ranking by total revenue.

**GET** `/reports/categories`  
Analysis of sales volume per service category.

---

## Testing with Postman

### Single Insert (POST /sales/single)

Set Body to raw (JSON):

```json
{
  "id": "S101",
  "sale_date": "2026-03-02",
  "employee_id": 1,
  "customer_id": 1,
  "service_id": 1,
  "quantity": 5,
  "invoice_num": "INV-2026-001"
}
```

---

### Update Sale (PUT /sales/:id)

Set Body to raw (JSON):

```json
{
  "sale_date": "2026-03-05",
  "quantity": 10,
  "invoice_num": "INV-2026-MODIFIED"
}
```

---

## Audit System

Every operation that modifies the MySQL database is recorded in a MongoDB collection named `audits`.

This ensures a tamper-proof history of:

- Operation Type: (SINGLE_INSERT, UPDATE_SALE, DELETE_SALE, SEED_DATA)
- Timestamp: Automatic ISO date.
- Description: Detailed trace of the affected record.