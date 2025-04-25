# Tech Stack Document

## VIVA Phonics Management Software

---

### 1. Introduction

#### 1.1 Purpose

This Tech Stack Document defines the technology stack, architecture, and implementation details for the VIVA Phonics Management Software, a web-based application to manage students, tutors, schedules, and payments. The document is based on the Software Requirements Specification (SRS) and uses the MERN stack (MongoDB, Express.js, React, Node.js) as specified. It provides a clear roadmap for developers, detailing which features are implemented on the frontend and backend, how they function, and the tools and libraries used.

#### 1.2 Scope

The tech stack supports the following features from the SRS:
- User authentication (registration, login, password recovery).
- User profile management.
- Student management (add, edit, delete, assign tutors).
- Tutor management (add, edit, delete, manage availability).
- Scheduling (create, edit, cancel sessions; handle paused schedules).
- Payment calculations (based on tutor rates and completed sessions).
- Dashboard with metrics and visualizations.

This document covers the technology choices, architecture, and feature-specific implementation details, ensuring the MERN stack is leveraged effectively.

#### 1.3 Definitions, Acronyms, and Abbreviations

- **MERN:** MongoDB, Express.js, React, Node.js.
- **Frontend:** React-based client-side application.
- **Backend:** Node.js with Express.js server and MongoDB database.
- **API:** Application Programming Interface (RESTful).
- **JWT:** JSON Web Token for authentication.
- **SRS:** Software Requirements Specification (artifact_id: 8ebb7d5a-bf7b-4351-9351-fd32dac14906).

#### 1.4 References

- SRS: VIVA Phonics Management Software SRS (artifact_id: 8ebb7d5a-bf7b-4351-9351-fd32dac14906).
- Client’s Google Sheet (to be analyzed for field mappings).

---

### 2. Technology Stack

#### 2.1 Frontend

- **Framework:** React (v18.x)
  - Reason: React’s component-based architecture supports reusable UI components, ideal for dynamic pages like dashboards and tables.
- **State Management:** Redux Toolkit
  - Reason: Manages complex state (e.g., user sessions, student/tutor lists) with predictable state updates.
- **Routing:** React Router (v6.x)
  - Reason: Handles client-side navigation for pages like Dashboard, Student Management, etc.
- **Styling:** Tailwind CSS
  - Reason: Provides utility-first CSS for rapid, responsive UI development, aligning with SRS usability requirements.
- **HTTP Client:** Axios
  - Reason: Simplifies API calls to the backend with robust error handling.
- **Charting Library:** Chart.js with react-chartjs-2
  - Reason: Supports dashboard visualizations (line and pie charts) as per SRS.
- **Calendar Library:** FullCalendar with React integration
  - Reason: Provides an interactive calendar for scheduling, supporting SRS requirements.
- **Form Validation:** Formik with Yup
  - Reason: Streamlines form handling and validation for registration, student/tutor forms, etc.
- **Build Tool:** Vite
  - Reason: Faster development and build times compared to Create React App.

#### 2.2 Backend

- **Runtime:** Node.js (v20.x)
  - Reason: Asynchronous, event-driven runtime suitable for scalable RESTful APIs.
- **Framework:** Express.js (v4.x)
  - Reason: Lightweight and flexible for building RESTful APIs as specified in the SRS.
- **Database:** MongoDB (v7.x) with Mongoose ODM
  - Reason: NoSQL database supports flexible schemas for student, tutor, and session data; Mongoose simplifies data modeling and validation.
- **Authentication:** JWT
  - Reason: Secure, stateless authentication for role-based access control.
- **Email Service:** Nodemailer with SendGrid
  - Reason: Handles email verification and password reset emails.
- **Environment Variables:** dotenv
  - Reason: Manages configuration (e.g., MongoDB URI, JWT secret).
- **Logging:** Winston
  - Reason: Logs API requests and errors for audit requirements.
- **API Documentation:** Swagger (OpenAPI)
  - Reason: Documents RESTful endpoints for developer reference.

#### 2.3 DevOps and Infrastructure

- **Cloud Platform:** AWS (EC2 for hosting, S3 for backups)
  - Reason: Scalable, reliable hosting with backup capabilities.
- **CI/CD:** GitHub Actions
  - Reason: Automates testing, building, and deployment.
- **Version Control:** Git with GitHub
  - Reason: Standard for code management and collaboration.
- **Containerization (Optional):** Docker
  - Reason: Simplifies deployment consistency (to be considered for future phases).
- **Testing:**
  - Unit Testing: Jest (frontend and backend)
  - Integration Testing: Supertest (backend APIs)
  - End-to-End Testing: Cypress (frontend)
  - Reason: Ensures 80% test coverage as per SRS.

#### 2.4 Security

- **HTTPS:** AWS Certificate Manager or Let’s Encrypt
  - Reason: Encrypts all communications.
- **Data Encryption:** MongoDB encryption at rest; bcrypt for password hashing
  - Reason: Secures sensitive data (e.g., passwords, emails).
- **Input Sanitization:** express-validator
  - Reason: Prevents SQL injection and XSS attacks.
- **Rate Limiting:** express-rate-limit
  - Reason: Protects login and password reset endpoints.

#### 2.5 Development Tools

- **IDE:** VS Code
- **Linting:** ESLint (with Airbnb style guide) and Prettier
- **Package Manager:** npm
- **API Testing:** Postman

---

### 3. System Architecture

The VIVA Phonics Management Software follows a client-server architecture:

- **Frontend (React):**
  - Hosted on AWS S3 or EC2 with a CDN (e.g., CloudFront).
  - Communicates with the backend via RESTful APIs.
  - Manages UI rendering, state, and client-side validation.

- **Backend (Node.js/Express):**
  - Hosted on AWS EC2.
  - Handles business logic, database operations, and authentication.
  - Exposes RESTful APIs (e.g., `/api/students`, `/api/sessions`).

- **Database (MongoDB):**
  - Hosted on MongoDB Atlas or AWS EC2.
  - Stores user, student, tutor, session, and availability data.
  - Uses Mongoose for schema validation and querying.

- **Communication:**
  - HTTPS for secure API calls.
  - JWT for authentication in API requests.
  - Nodemailer for email notifications.

- **Diagram (Conceptual):**
  ```
  [React Frontend] <-> [Express APIs] <-> [MongoDB]
      |                  |                   |
   (AWS S3/EC2)     (AWS EC2)        (MongoDB Atlas/EC2)
  ```

---

### 4. Feature Implementation Details

Each feature from the SRS is detailed below, specifying frontend and backend responsibilities, how the feature works, and the technologies used.

#### 4.1 User Authentication (SRS Section 3.1)

##### 4.1.1 Description

Users register, log in, and recover passwords with role-based access (Admin, Tutor). This is part of the first milestone.

##### 4.1.2 Frontend Implementation

- **Components:**
  - `RegisterPage`: Form with email, password, role (dropdown: Admin, Tutor).
  - `LoginPage`: Form with email and password fields.
  - `PasswordResetPage`: Form to request reset link and set new password.
- **Functionality:**
  - Use Formik/Yup for form validation (e.g., email format, password rules).
  - Call backend APIs via Axios (`/api/register`, `/api/login`, `/api/password-reset`).
  - Store JWT in localStorage upon login; redirect to Dashboard (Admin) or Schedule (Tutor).
  - Display error messages (e.g., “Invalid credentials”) using Tailwind CSS alerts.
- **Libraries:** React Router (navigation), Axios (API calls), Formik/Yup (forms), Tailwind CSS (styling).

##### 4.1.3 Backend Implementation

- **API Endpoints:**
  - `POST /api/register`: Validate inputs (express-validator), hash password (bcrypt), save user to MongoDB, send verification email (Nodemailer).
  - `POST /api/login`: Verify credentials, issue JWT, return user data.
  - `POST /api/password-reset`: Send reset link with time-sensitive token.
  - `POST /api/password-reset/confirm`: Validate token, update password.
- **Functionality:**
  - Use Mongoose for user schema (email, password, role, verified).
  - Implement rate limiting (express-rate-limit) for login (5 attempts/15 mins).
  - Store verification/reset tokens in MongoDB with expiration.
- **Libraries:** Express.js, Mongoose, bcrypt, JWT, Nodemailer, express-validator, express-rate-limit.

##### 4.1.4 How It Works

- **Registration:** User submits form → Frontend validates → Backend saves user, sends email → User verifies email → Account activated.
- **Login:** User submits credentials → Frontend sends to backend → Backend issues JWT → Frontend stores JWT, redirects.
- **Password Recovery:** User requests reset → Backend sends link → User submits new password → Backend updates password.

#### 4.2 My Profile (SRS Section 3.2)

##### 4.2.1 Description

Users view and edit personal details (name, phone, password). Tutors see additional read-only fields (qualifications, hourly rate).

##### 4.2.2 Frontend Implementation

- **Components:**
  - `ProfilePage`: Displays user details in a card; includes an edit form.
- **Functionality:**
  - Fetch profile data via `GET /api/profile` on page load.
  - Use Formik/Yup for edit form validation (e.g., phone format).
  - Submit updates via `PUT /api/profile`.
  - Display success/error messages using Tailwind CSS toasts.
  - For Tutors, show read-only fields (qualifications, hourly rate, total sessions).
- **Libraries:** React, Axios, Formik/Yup, Tailwind CSS.

##### 4.2.3 Backend Implementation

- **API Endpoints:**
  - `GET /api/profile`: Return authenticated user’s data (protected by JWT).
  - `PUT /api/profile`: Update user fields (full_name, phone, password if provided).
- **Functionality:**
  - Use Mongoose to fetch/update user document.
  - Validate inputs (express-validator).
  - Hash new password (bcrypt) if updated.
- **Libraries:** Express.js, Mongoose, bcrypt, JWT, express-validator.

##### 4.2.4 How It Works

- User navigates to profile → Frontend fetches data → Displays in card.
- User edits details → Frontend validates, sends to backend → Backend updates MongoDB → Frontend shows success.

#### 4.3 Student Management (SRS Section 3.3)

##### 4.3.1 Description

Admins manage student records (add, edit, delete, assign tutors, track status).

##### 4.3.2 Frontend Implementation

- **Components:**
  - `StudentListPage`: Table with columns (ID, name, status, tutor, email, phone).
  - `StudentForm`: Form for adding/editing students.
  - `AssignTutorModal`: Modal with tutor dropdown.
- **Functionality:**
  - Fetch students via `GET /api/students` and display in a sortable/filterable table (using a library like react-table).
  - Implement pagination (25 rows/page).
  - Add/Edit forms use Formik/Yup for validation (e.g., email format).
  - Call APIs for add (`POST /api/students`), edit (`PUT /api/students/:id`), delete (`DELETE /api/students/:id`), and assign tutor (`PUT /api/students/:id/assign-tutor`).
  - Handle status changes (e.g., paused → update sessions via backend).
  - Use Tailwind CSS for responsive table/modal styling.
- **Libraries:** React, Axios, Formik/Yup, react-table, Tailwind CSS.

##### 4.3.3 Backend Implementation

- **API Endpoints:**
  - `GET /api/students`: Return paginated student list with filters (status, tutor_id).
  - `POST /api/students`: Create student document.
  - `PUT /api/students/:id`: Update student fields.
  - `DELETE /api/students/:id`: Soft delete (set archived: true).
  - `PUT /api/students/:id/assign-tutor`: Update tutor_id.
- **Functionality:**
  - Use Mongoose for student schema (full_name, email, phone, status, tutor_id, archived).
  - On status change to inactive/paused, trigger session updates (call session service).
  - Validate inputs (express-validator).
  - Support pagination and sorting via MongoDB queries.
- **Libraries:** Express.js, Mongoose, express-validator.

##### 4.3.4 How It Works

- Admin views student list → Frontend fetches data → Displays table.
- Admin adds/edits student → Frontend validates, sends to backend → Backend saves → Table refreshes.
- Admin assigns tutor → Frontend sends tutor_id → Backend updates student → Sessions updated if needed.

#### 4.4 Tutor Management (SRS Section 3.4)

##### 4.4.1 Description

Admins manage tutor profiles and availability.

##### 4.4.2 Frontend Implementation

- **Components:**
  - `TutorListPage`: Table with columns (ID, name, email, phone, hourly rate, qualifications).
  - `TutorForm`: Form for adding/editing tutors.
  - `AvailabilityPage`: Calendar view for managing tutor slots.
- **Functionality:**
  - Fetch tutors via `GET /api/tutors` and display in a table (react-table).
  - Add/Edit forms use Formik/Yup for validation (e.g., hourly rate > 0.01).
  - Availability page uses FullCalendar to display/add/remove slots.
  - Call APIs for add (`POST /api/tutors`), edit (`PUT /api/tutors/:id`), delete (`DELETE /api/tutors/:id`), and availability (`GET/PUT /api/tutors/:id/availability`).
  - Use Tailwind CSS for styling.
- **Libraries:** React, Axios, Formik/Yup, react-table, FullCalendar, Tailwind CSS.

##### 4.4.3 Backend Implementation

- **API Endpoints:**
  - `GET /api/tutors`: Return paginated tutor list.
  - `POST /api/tutors`: Create tutor document.
  - `PUT /api/tutors/:id`: Update tutor fields.
  - `DELETE /api/tutors/:id`: Soft delete (set archived: true).
  - `GET /api/tutors/:id/availability`: Return tutor’s slots.
  - `PUT /api/tutors/:id/availability`: Update slots.
- **Functionality:**
  - Use Mongoose for tutor schema (full_name, email, phone, qualifications, hourly_rate, archived).
  - Availability schema: tutor_id, day_of_week, start_time, end_time.
  - Validate inputs and prevent overlapping slots.
  - On delete, reassign/cancel sessions (prompt via frontend).
- **Libraries:** Express.js, Mongoose, express-validator.

##### 4.4.4 How It Works

- Admin views tutor list → Frontend fetches data → Displays table.
- Admin adds/edits tutor → Frontend validates, sends to backend → Backend saves → Table refreshes.
- Admin manages availability → Frontend displays calendar, sends updates → Backend saves slots.

#### 4.5 Scheduling (SRS Section 3.5)

##### 4.5.1 Description

Admins create and manage tutoring sessions; Tutors mark statuses.

##### 4.5.2 Frontend Implementation

- **Components:**
  - `SessionListPage`: Table with columns (ID, student, tutor, date, time, duration, status).
  - `SessionForm`: Form for creating/editing sessions.
  - `SessionCalendarPage`: Calendar view of sessions.
- **Functionality:**
  - Fetch sessions via `GET /api/sessions` and display in table (react-table) or calendar (FullCalendar).
  - Create/Edit forms use Formik/Yup; validate tutor availability via backend.
  - Support batch creation (e.g., 4 weeks) by sending multiple session objects.
  - Call APIs for create (`POST /api/sessions`), edit (`PUT /api/sessions/:id`), cancel (`DELETE /api/sessions/:id`), and status update (`PUT /api/sessions/:id/status`).
  - Tutors can only mark status (completed, canceled, paused).
  - Use Tailwind CSS for styling.
- **Libraries:** React, Axios, Formik/Yup, react-table, FullCalendar, Tailwind CSS.

##### 4.5.3 Backend Implementation

- **API Endpoints:**
  - `GET /api/sessions`: Return paginated session list with filters (date, student, tutor, status).
  - `POST /api/sessions`: Create session(s).
  - `PUT /api/sessions/:id`: Update session.
  - `DELETE /api/sessions/:id`: Mark as canceled.
  - `PUT /api/sessions/:id/status`: Update status.
- **Functionality:**
  - Use Mongoose for session schema (student_id, tutor_id, date, start_time, duration, status).
  - Validate availability: Check tutor’s slots and existing sessions.
  - On pause (via student status), update future sessions to paused and free slots.
  - Notify tutors via email on cancellation (optional, via Nodemailer).
- **Libraries:** Express.js, Mongoose, express-validator, Nodemailer.

##### 4.5.4 How It Works

- Admin views sessions → Frontend fetches data → Displays table/calendar.
- Admin creates session → Frontend validates, checks availability via backend → Backend saves → UI refreshes.
- Tutor marks status → Frontend sends update → Backend saves, updates payments if completed.

#### 4.6 Payment Calculations (SRS Section 3.6)

##### 4.6.1 Description

Calculate tutor payments based on completed sessions; generate reports.

##### 4.6.2 Frontend Implementation

- **Components:**
  - `PaymentReportPage`: Table with tutor payments and date range picker.
  - `PaymentHistoryPage` (Tutor): Read-only report view.
- **Functionality:**
  - Fetch reports via `GET /api/payments` with date range query.
  - Display table (react-table) with columns: tutor, hours, payment.
  - Use a date picker (e.g., react-datepicker) for range selection.
  - Export to CSV via `GET /api/payments/export`.
  - Tutors access read-only history via `GET /api/tutors/:id/payments`.
  - Use Tailwind CSS for styling.
- **Libraries:** React, Axios, react-table, react-datepicker, Tailwind CSS.

##### 4.6.3 Backend Implementation

- **API Endpoints:**
  - `GET /api/payments`: Calculate payments for date range.
  - `GET /api/payments/export`: Return CSV file.
  - `GET /api/tutors/:id/payments`: Return tutor’s payment history.
- **Functionality:**
  - Query sessions with status “Completed” in date range.
  - Aggregate hours per tutor, multiply by hourly_rate.
  - Generate CSV using a library like csv-writer.
  - Use Mongoose for session/tutor queries.
- **Libraries:** Express.js, Mongoose, csv-writer.

##### 4.6.4 How It Works

- Admin selects date range → Frontend fetches report → Displays table.
- Admin exports CSV → Backend generates file → Frontend downloads.
- Tutor views history → Frontend fetches → Displays read-only table.

#### 4.7 Dashboard (SRS Section 3.7)

##### 4.7.1 Description

Display key metrics and visualizations for Admins.

##### 4.7.2 Frontend Implementation

- **Components:**
  - `DashboardPage`: Grid with metric cards and charts.
- **Functionality:**
  - Fetch data via `GET /api/dashboard`.
  - Display cards: active students, upcoming sessions, payments due.
  - Render line chart (sessions per week) and pie chart (session statuses) using Chart.js.
  - Auto-refresh every 5 minutes using setInterval.
  - Use Tailwind CSS for responsive grid layout.
- **Libraries:** React, Axios, react-chartjs-2, Tailwind CSS.

##### 4.7.3 Backend Implementation

- **API Endpoints:**
  - `GET /api/dashboard`: Return metrics and chart data.
- **Functionality:**
  - Query MongoDB for:
    - Active students (status: Active).
    - Upcoming sessions (next 7 days, status: Scheduled).
    - Payments due (completed sessions this month).
    - Chart data: Sessions per week (last 4 weeks), sessions by status.
  - Use Mongoose aggregation for chart data.
- **Libraries:** Express.js, Mongoose.

##### 4.7.4 How It Works

- Admin views dashboard → Frontend fetches data → Displays cards and charts.
- Auto-refresh triggers → Frontend re-fetches → Updates UI.

---

### 5. Development Guidelines

#### 5.1 Project Structure

- **Frontend (`client/`):**
  ```
  client/
  ├── src/
  │   ├── components/       # Reusable components (e.g., StudentTable, SessionForm)
  │   ├── pages/           # Page components (e.g., LoginPage, DashboardPage)
  │   ├── redux/           # Redux slices and store
  │   ├── styles/          # Tailwind CSS config
  │   ├── utils/           # Helpers (e.g., API client)
  │   └── App.jsx          # Main app with routes
  ├── package.json
  └── vite.config.js
  ```

- **Backend (`server/`):**
  ```
  server/
  ├── src/
  │   ├── controllers/      # API logic (e.g., userController, sessionController)
  │   ├── models/          # Mongoose schemas (e.g., User, Student)
  │   ├── routes/          # Express routes (e.g., userRoutes, sessionRoutes)
  │   ├── middleware/      # Auth, validation, error handling
  │   ├── config/          # DB connection, env vars
  │   └── app.js           # Express app setup
  ├── package.json
  └── .env
  ```

#### 5.2 Coding Standards

- **Frontend:** Use functional components, hooks, and ESLint with Airbnb style.
- **Backend:** Organize by feature (e.g., user, student), use async/await, and follow REST conventions.
- **Naming:** CamelCase for variables/functions, PascalCase for components/models.
- **Comments:** Document complex logic and API endpoints (JSDoc for backend).

#### 5.3 Testing Strategy

- **Frontend:**
  - Unit tests: Test components and Redux slices with Jest/Testing Library.
  - End-to-end tests: Test flows (e.g., login, add student) with Cypress.
- **Backend:**
  - Unit tests: Test controllers and services with Jest.
  - Integration tests: Test API endpoints with Supertest.
- **Coverage:** Aim for 80% as per SRS.

#### 5.4 Deployment

- **Frontend:** Build with Vite, deploy to AWS S3 with CloudFront.
- **Backend:** Deploy to AWS EC2 with PM2 for process management.
- **Database:** Use MongoDB Atlas for managed hosting.
- **CI/CD:** GitHub Actions to run tests, build, and deploy on push to main.

---

### 6. Non-Functional Requirements Implementation

- **Performance:**
  - Frontend: Lazy-load components, optimize images, use memoization.
  - Backend: Index MongoDB fields (e.g., email, student_id), cache frequent queries (e.g., dashboard) with Redis (optional).
  - Target: API responses < 2s for 95% of requests.
- **Security:**
  - Use JWT middleware for protected routes.
  - Encrypt passwords with bcrypt, enable MongoDB encryption at rest.
  - Apply express-validator for input sanitization.
  - Use express-rate-limit for login/password reset.
- **Usability:**
  - Follow Tailwind CSS for responsive, intuitive UI.
  - Mimic Google Sheet table layout using react-table.
  - Ensure WCAG 2.1 AA compliance (e.g., aria-labels).
- **Scalability:**
  - Use MongoDB sharding for large datasets (future).
  - Deploy backend on multiple EC2 instances with a load balancer.
- **Reliability:**
  - Implement Winston logging for errors/audits.
  - Schedule daily backups to AWS S3.
  - Ensure 99.9% uptime with AWS monitoring.

---

### 7. Assumptions and Constraints

- **Assumptions:**
  - Client provides Google Sheet within 1 week for field mapping.
  - Initial deployment targets 100 concurrent users.
  - No real-time features (e.g., WebSocket) required.
- **Constraints:**
  - First milestone limited to User Authentication and My Profile.
  - Must use MERN stack exclusively for core development.
  - Browser support: Latest Chrome, Firefox, Safari, Edge.

---

### 8. Risks and Mitigations

- **Risk:** Misinterpreting Google Sheet workflows.
  - **Mitigation:** Validate mappings with client during analysis.
- **Risk:** Performance bottlenecks with large session datasets.
  - **Mitigation:** Optimize MongoDB queries, add indexes, consider pagination.
- **Risk:** Scope creep from additional client requests.
  - **Mitigation:** Lock scope per milestone, use change requests.

---

### 9. Milestones and Timeline

- **Milestone 1 (User Authentication, My Profile):**
  - Figma mockups (1 week).
  - Frontend: React components, Redux setup (2 weeks).
  - Backend: User APIs, MongoDB setup (2 weeks).
  - Testing and deployment (1 week).
- **Future Milestones (Pending Client Contract):**
  - Student Management, Tutor Management, Scheduling, Payments, Dashboard.
  - Timeline to be defined post-milestone 1.

---

### 10. Appendix

#### 10.1 Sample API Request

- **Register User:**
  ```
  POST /api/register
  Content-Type: application/json
  {
    "email": "admin@viva.com",
    "password": "Password123!",
    "full_name": "Jane Doe",
    "phone": "+1234567890",
    "role": "Admin"
  }
  Response: { "message": "Verification email sent" }
  ```

#### 10.2 MongoDB Schema Example

- **User:**
  ```javascript
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    phone: { type: String },
    role: { type: String, enum: ['Admin', 'Tutor'], required: true },
    verified: { type: Boolean, default: false },
    created_at: { type: Date, default: Date.now }
  });
  ```

#### 10.3 Figma Mockup Guidelines

- Create mockups for: Login, Register, Profile, Dashboard, Student/Tutor Lists, Scheduling Calendar, Payment Reports.
- Use Tailwind CSS colors (blue: #1E90FF, white: #FFFFFF, gray: #F5F5F5).
- Mimic Google Sheet table layout for management pages.
- Share with client for approval before coding.

---

This Tech Stack Document provides a detailed blueprint for building the VIVA Phonics Management Software using the MERN stack, with clear frontend and backend responsibilities, feature implementation plans, and technology choices to guide development.