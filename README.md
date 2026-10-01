# School Management System

A full-stack school and college management platform for organizing users, classes, attendance, academic results, and fee records in one place.

The project uses a React frontend, an Express API, and MongoDB for persistence. Authentication is JWT-based and access is controlled by user role.

## Project Status

The core foundation is in place and the application is actively evolving.

### Available now

- JWT authentication with registration and login
- Role-based access for administrators, teachers, and students
- Automatic student ID generation
- Class creation and teacher assignment
- Student enrollment and class membership management
- Attendance marking and attendance history
- Result creation and filtered result viewing
- Fee creation, fee status viewing, and payment marking
- Responsive React dashboard with loading, error, and toast states

### In progress

- Expanding dedicated result, fee, and notice screens in the frontend
- Broader reporting and analytics
- Production deployment configuration

## Technology Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React 19, Vite, React Router, Tailwind CSS, Axios, React Hook Form, Yup, Sonner, Lucide React |
| Backend | Node.js, Express 5, Mongoose, JWT, bcrypt, CORS, dotenv |
| Database | MongoDB / MongoDB Atlas |

## Repository Structure

```text
SchoolManagement/
├── Client/                 # React + Vite frontend
│   ├── public/
│   └── src/
│       ├── components/     # Shared UI and dashboard components
│       ├── context/        # Authentication context
│       ├── layouts/        # Auth and dashboard layouts
│       ├── pages/          # Login, registration, and dashboard pages
│       ├── routes/         # Public and protected routing
│       ├── services/       # API service modules
│       └── utils/          # Shared helpers
├── Server/                 # Express + MongoDB backend
│   ├── src/
│   │   ├── config/         # Database configuration
│   │   ├── middleware/     # Authentication and authorization
│   │   ├── models/         # Mongoose models
│   │   └── routes/         # REST API routes
│   └── Server.js           # API entry point
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- A running MongoDB instance or a MongoDB Atlas connection string

### 1. Clone and enter the project

```bash
git clone <repository-url>
cd SchoolManagement
```

### 2. Install backend dependencies

```bash
cd Server
npm install
```

Create `Server/.env`:

```env
MONGO_URI=mongodb://127.0.0.1:27017/school-management
JWT_SECRET=replace-with-a-long-random-secret
PORT=3000
CLIENT_URL=http://localhost:5173

# Optional values used by the admin seed command
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
TEACHER_REGISTRATION_CODE=replace-with-teacher-code
ADMIN_REGISTRATION_CODE=replace-with-admin-code
```

Start the API:

```bash
npm start
```

The backend runs at `http://localhost:3000` by default.

To create the first administrator, configure the `ADMIN_*` values and run:

```bash
npm run seed:admin
```

Public registration is intentionally limited to student accounts. Teachers and administrators must be created through a backend-controlled process.

The role-specific registration endpoints accept the server-only codes above:

- `POST /api/auth/register/student`
- `POST /api/auth/register/teacher`
- `POST /api/auth/register/admin`

Registration codes must never be placed in frontend or `VITE_` environment variables.

### 3. Install frontend dependencies

Open a second terminal from the project root:

```bash
cd Client
npm install
npm run dev
```

The frontend runs at `http://localhost:5173` by default.

## Available Scripts

### Client

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Create a production build |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run format` | Format frontend files with Prettier |

### Server

| Command | Purpose |
| --- | --- |
| `npm start` | Start the Express API |
| `npm test` | Placeholder test command |

## API Overview

All API routes are prefixed with `/api`.

| Area | Endpoint | Access |
| --- | --- | --- |
| Auth | `POST /api/auth/register` | Public |
| Auth | `POST /api/auth/login` | Public |
| Auth | `GET /api/auth/me` | Protected |
| Auth | `POST /api/auth/logout` | Protected |
| Admin | `POST /api/admin/teachers` | Admin |
| Auth | `GET /api/auth/admin-dashboard` | Admin |
| Auth | `GET /api/auth/teacher-dashboard` | Teacher |
| Auth | `GET /api/auth/student-dashboard` | Student |
| Classes | `POST /api/classes/create-class` | Admin |
| Classes | Class and student management endpoints | Protected |
| Attendance | Attendance marking and viewing endpoints | Role-based |
| Results | `POST /api/results` | Admin, Teacher |
| Results | `GET /api/results` | Admin, Teacher, Student |
| Fees | `POST /api/fees/add-fees` | Admin |
| Fees | `GET /api/fees/view` | Protected |
| Fees | `PUT /api/fees/:id/pay` | Admin |
| Profile | `GET /api/users/profile` | Protected |
| Profile | `PUT /api/users/profile` | Protected |
| Notices | `GET /api/notices` | Student |

Protected requests require a JWT access token:

```http
Authorization: Bearer <token>
```

## Roles and Permissions

- **Admin**: manage classes, teachers, students, fees, and school-wide records.
- **Teacher**: manage attendance and results for assigned classes.
- **Student**: access personal dashboard information, attendance, results, and fee records.

## Development Notes

- Both applications use ES modules.
- Backend imports include explicit `.js` extensions.
- Keep secrets and database credentials in `Server/.env`; never commit them.
- Backend requests are protected with JWT, role authorization, Helmet, CORS allowlisting, rate limiting, and server-side validation.
- Teacher attendance, results, and fee reads are restricted to assigned classes; students can only read their own records.
- The frontend expects the API to be available at the URL configured in its service layer.
- MongoDB must be available before starting the server.

## Roadmap

- Add complete frontend workflows for results and fees.
- Add notices and role-targeted announcements.
- Add attendance, result, and fee summaries with charts and exports.
- Improve validation, automated testing, and API documentation.
- Deploy the API, frontend, and database using production environment variables.

## Contributing

1. Create a feature branch.
2. Keep changes focused and consistent with the existing structure.
3. Run `npm run lint` and `npm run build` inside `Client`.
4. Test API changes against a local MongoDB instance.
5. Open a pull request with a concise description of the change.

## License

This project currently does not declare a license. Add one before distributing it publicly.
