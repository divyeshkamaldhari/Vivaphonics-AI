# Software Requirements Specification (SRS)

## VIVA Phonics Management Software

---

### 1. Introduction

#### 1.1 Purpose

This Software Requirements Specification (SRS) defines the detailed requirements for the VIVA Phonics Management Software, a web-based application to automate the management of students, tutors, schedules, and payments for VIVA Phonics, a business focused on teaching students to read efficiently. The software replaces a manual Google Sheet-based system, streamlining operations and improving efficiency. This document provides developers with precise specifications to implement all features outlined in the Product Requirements Document (PRD).

#### 1.2 Scope

The VIVA Phonics Management Software will include the following features:

- User authentication with role-based access (Admin, Tutor).
- User profile management.
- Student management (add, edit, delete, assign tutors, track status).
- Tutor management (add, edit, delete, manage availability, assign students).
- Scheduling (create, edit, cancel sessions; manage conflicts; handle paused schedules).
- Payment calculations (based on tutor rates and completed sessions).
- Dashboard with key metrics and visualizations.

The software will not include unrelated features such as marketing tools or student learning content management.

#### 1.3 Definitions, Acronyms, and Abbreviations

- **Admin:** The business owner or primary user with full system access.
- **Tutor:** A secondary user with limited access to schedules and session statuses.
- **Session:** A tutoring appointment with a specific student, tutor, date, time, and duration.
- **Slot:** A tutor’s available time block for scheduling sessions.
- **SRS:** Software Requirements Specification.
- **PRD:** Product Requirements Document.
- **UI:** User Interface.
- **API:** Application Programming Interface.

#### 1.4 References

- PRD: VIVA Phonics Management Software PRD (artifact_id: 5fdfd3a3-31b9-4093-80bc-ddc2dc5b1e3f).
- Client’s Google Sheet (to be provided for field and workflow analysis).

---

### 2. Overall Description

#### 2.1 Product Perspective

The VIVA Phonics Management Software is a standalone web application with a client-server architecture. It will use a relational database to store user, student, tutor, session, and payment data. The front end will be built with a modern JavaScript framework (e.g., React), and the back end will use a framework like Node.js or Django with RESTful APIs. The system will be hosted on a cloud platform (e.g., AWS, Azure) to ensure scalability and reliability.

#### 2.2 Product Functions

- **User Authentication:** Secure registration, login, and role-based access.
- **My Profile:** View and edit user details.
- **Student Management:** Manage student records and assignments.
- **Tutor Management:** Manage tutor profiles and availability.
- **Scheduling:** Create and manage tutoring sessions, handle conflicts, and update availability.
- **Payment Calculations:** Compute tutor payments based on sessions.
- **Dashboard:** Display key metrics and visualizations.

#### 2.3 User Classes and Characteristics

- **Admin:**
  - Full access to all features.
  - Responsible for managing students, tutors, schedules, and payments.
  - Expected to have basic computer literacy but no advanced technical skills.
- **Tutor:**
  - Limited access to view schedules, mark session statuses, and view payment history.
  - May have varying levels of tech proficiency.
- **Students/Parents (Potential Future Users):**
  - Limited access to view schedules (to be confirmed).

#### 2.4 Operating Environment

- **Client:** Web browsers (Chrome, Firefox, Safari, Edge) on desktop and mobile devices.
- **Server:** Cloud-based server with a Linux-based OS.
- **Database:** Relational database (e.g., PostgreSQL, MySQL).
- **Network:** Internet access with HTTPS for secure communication.

#### 2.5 Design and Implementation Constraints

- The system must replicate the functionality of the client’s Google Sheet, with fields and workflows to be confirmed via analysis.
- The first milestone includes only User Authentication and My Profile; other features will be developed in subsequent phases.
- The UI must be intuitive, resembling the Google Sheet layout where possible.
- Data migration from the Google Sheet is out of scope for initial development.

#### 2.6 Assumptions and Dependencies

- The client will provide access to the Google Sheet for detailed analysis.
- The system will be web-based unless otherwise specified.
- No third-party integrations (e.g., payment gateways) are required in the initial phase.

---

### 3. System Features

#### 3.1 User Authentication

##### 3.1.1 Description and Priority

Users must register, log in, and access features based on their roles (Admin or Tutor). This is a high-priority feature, part of the first milestone.

##### 3.1.2 Functional Requirements

- **FR1.1: Registration**
  - Users can register with an email, password, and role (Admin or Tutor).
  - Password must be at least 8 characters, including one uppercase letter, one number, and one special character.
  - Send an email verification link; users must verify within 24 hours to activate their account.
  - Store user data: email, hashed password, role, verification status, and created_at timestamp.
  - Display error messages for invalid inputs (e.g., duplicate email, weak password).

- **FR1.2: Login**
  - Users log in with email and password.
  - Implement rate limiting (5 attempts per 15 minutes per IP).
  - Redirect to the dashboard (Admin) or schedule view (Tutor) upon successful login.
  - Display error messages for incorrect credentials or unverified accounts.

- **FR1.3: Password Recovery**
  - Users can request a password reset via email.
  - Send a time-sensitive (1-hour) reset link to the registered email.
  - Allow users to set a new password following the same rules as registration.

- **FR1.4: Role-Based Access**
  - Admins have access to all features (student management, tutor management, scheduling, payments, dashboard).
  - Tutors can only view their schedules, mark session statuses, and view their profile/payment history.
  - Implement access control via middleware to restrict API endpoints by role.

##### 3.1.3 Stimulus/Response Sequences

- **Registration:**
  - User submits registration form → System validates inputs → Sends verification email → User clicks link → Account activated.
- **Login:**
  - User submits credentials → System verifies → Redirects to appropriate page or displays error.
- **Password Recovery:**
  - User requests reset → System sends reset link → User submits new password → Password updated.

##### 3.1.4 Associated Interfaces

- **UI:** Registration form, login form, password recovery form.
- **API Endpoints:**
  - `POST /api/register`: Create user account.
  - `POST /api/login`: Authenticate user.
  - `POST /api/password-reset`: Request password reset.
  - `POST /api/password-reset/confirm`: Update password.

#### 3.2 My Profile

##### 3.2.1 Description and Priority

Users can view and edit their personal details. This is a high-priority feature, part of the first milestone.

##### 3.2.2 Functional Requirements

- **FR2.1: View Profile**
  - Display user details: full name, email, phone number, role.
  - For Tutors, display additional fields: qualifications, hourly rate, total sessions completed (read-only).

- **FR2.2: Edit Profile**
  - Allow users to update: full name, phone number, and password.
  - Validate inputs (e.g., phone number format, password rules).
  - Save changes to the database and display a success message.
  - For Tutors, Admins can edit qualifications and hourly rate (handled in Tutor Management).

##### 3.2.3 Stimulus/Response Sequences

- **View Profile:**
  - User navigates to profile page → System fetches and displays user data.
- **Edit Profile:**
  - User submits updated details → System validates and saves → Displays success message or error.

##### 3.2.4 Associated Interfaces

- **UI:** Profile page with read-only fields and an edit form.
- **API Endpoints:**
  - `GET /api/profile`: Fetch user profile.
  - `PUT /api/profile`: Update user profile.

#### 3.3 Student Management

##### 3.3.1 Description and Priority

Admins can manage student records, assign tutors, and track statuses. This is a medium-priority feature, to be developed in a later milestone.

##### 3.3.2 Functional Requirements

- **FR3.1: List Students**
  - Display a table of students with columns: ID, full name, status (active, inactive, paused), assigned tutor, contact email, contact phone.
  - Support sorting by column and filtering by status.
  - Include action buttons: View, Edit, Delete, Assign Tutor.

- **FR3.2: Add Student**
  - Provide a form to enter: full name, email, phone, status (default: active).
  - Validate inputs (e.g., email format, required fields).
  - Save to database and assign a unique student ID.

- **FR3.3: Edit Student**
  - Allow updating all fields except student ID.
  - If status changes to inactive, remove associated sessions and update tutor availability (see Scheduling).
  - If status changes to paused, mark future sessions as paused (configurable rule).

- **FR3.4: Delete Student**
  - Soft delete by marking as archived (not visible in default list).
  - Remove associated sessions and update tutor availability.

- **FR3.5: Assign Tutor**
  - Display a dropdown of available tutors.
  - Save the assignment and update the student record.

##### 3.3.3 Stimulus/Response Sequences

- **List Students:**
  - Admin navigates to student management → System fetches and displays student list.
- **Add Student:**
  - Admin submits form → System validates and saves → Student appears in list.
- **Edit/Delete/Assign:**
  - Admin performs action → System updates database → Refreshes list or displays error.

##### 3.3.4 Associated Interfaces

- **UI:** Student list table, add/edit forms, assign tutor dropdown.
- **API Endpoints:**
  - `GET /api/students`: List students.
  - `POST /api/students`: Add student.
  - `PUT /api/students/:id`: Update student.
  - `DELETE /api/students/:id`: Delete student.
  - `PUT /api/students/:id/assign-tutor`: Assign tutor.

#### 3.4 Tutor Management

##### 3.4.1 Description and Priority

Admins can manage tutor profiles and availability. This is a medium-priority feature, to be developed in a later milestone.

##### 3.4.2 Functional Requirements

- **FR4.1: List Tutors**
  - Display a table with columns: ID, full name, email, phone, hourly rate, qualifications, total sessions.
  - Support sorting and filtering (e.g., by hourly rate).
  - Include action buttons: View, Edit, Delete, Manage Availability.

- **FR4.2: Add Tutor**
  - Provide a form to enter: full name, email, phone, qualifications, hourly rate (decimal, min: 0.01).
  - Validate inputs and save to database with a unique tutor ID.

- **FR4.3: Edit Tutor**
  - Allow updating all fields except tutor ID.
  - If hourly rate changes, apply to new sessions only.

- **FR4.4: Delete Tutor**
  - Soft delete by marking as archived.
  - Reassign or cancel associated sessions (prompt Admin for action).

- **FR4.5: Manage Availability**
  - Display a weekly calendar view of tutor’s available slots (e.g., Monday 3-5 PM).
  - Allow adding/removing slots (start time, end time, day of week).
  - Slots are recurring until manually changed.
  - Prevent overlapping slots.

##### 3.4.3 Stimulus/Response Sequences

- **List Tutors:**
  - Admin navigates to tutor management → System displays tutor list.
- **Add/Edit/Delete:**
  - Admin performs action → System updates database → Refreshes list.
- **Manage Availability:**
  - Admin selects tutor → System displays calendar → Admin updates slots → System saves.

##### 3.4.4 Associated Interfaces

- **UI:** Tutor list table, add/edit forms, availability calendar.
- **API Endpoints:**
  - `GET /api/tutors`: List tutors.
  - `POST /api/tutors`: Add tutor.
  - `PUT /api/tutors/:id`: Update tutor.
  - `DELETE /api/tutors/:id`: Delete tutor.
  - `GET /api/tutors/:id/availability`: Fetch availability.
  - `PUT /api/tutors/:id/availability`: Update availability.

#### 3.5 Scheduling

##### 3.5.1 Description and Priority

Admins can create and manage tutoring sessions, ensuring no conflicts and handling paused schedules. This is a medium-priority feature.

##### 3.5.2 Functional Requirements

- **FR5.1: List Sessions**
  - Display a table with columns: ID, student name, tutor name, date, time, duration, status (scheduled, completed, canceled, paused).
  - Support filtering by date range, student, tutor, or status.
  - Include action buttons: Edit, Cancel, Mark Status.

- **FR5.2: Create Session**
  - Provide a form: student (dropdown), tutor (dropdown), date, start time, duration (in minutes, min: 15, max: 120), status (default: scheduled).
  - Validate: tutor must be available, no overlapping sessions.
  - Allow batch creation (e.g., same time slot for next 4 weeks).
  - Save to database with a unique session ID.

- **FR5.3: Edit Session**
  - Allow updating all fields except session ID.
  - Re-validate availability and conflicts.

- **FR5.4: Cancel Session**
  - Mark session as canceled and update tutor availability.
  - Notify tutor via email (optional, to be confirmed).

- **FR5.5: Mark Session Status**
  - Admins/Tutors can mark sessions as completed, canceled, or paused.
  - Only completed sessions count toward payment calculations.

- **FR5.6: Handle Paused Schedules**
  - If a student’s status is paused, mark all future sessions as paused.
  - Update tutor availability to reflect freed slots.
  - Allow resuming sessions by changing student status to active.

##### 3.5.3 Stimulus/Response Sequences

- **Create Session:**
  - Admin submits form → System validates and saves → Session appears in list.
- **Edit/Cancel/Mark Status:**
  - Admin/Tutor performs action → System updates database → Refreshes list.
- **Pause Schedule:**
  - Admin pauses student → System updates sessions and availability → Reflects in UI.

##### 3.5.4 Associated Interfaces

- **UI:** Session list table, calendar view, create/edit forms.
- **API Endpoints:**
  - `GET /api/sessions`: List sessions.
  - `POST /api/sessions`: Create session.
  - `PUT /api/sessions/:id`: Update session.
  - `DELETE /api/sessions/:id`: Cancel session.
  - `PUT /api/sessions/:id/status`: Update session status.

#### 3.6 Payment Calculations

##### 3.6.1 Description and Priority

The system calculates tutor payments based on completed sessions. This is a medium-priority feature.

##### 3.6.2 Functional Requirements

- **FR6.1: Calculate Payments**
  - For each tutor, sum the duration of completed sessions in a date range.
  - Multiply by the tutor’s hourly rate to compute payment.
  - Exclude paused or canceled sessions.

- **FR6.2: Generate Payment Reports**
  - Display a table: tutor name, total hours, total payment, date range.
  - Support date range selection (e.g., last month, custom range).
  - Allow exporting to CSV.

- **FR6.3: View Payment History (Tutor)**
  - Tutors can view their payment reports (read-only).

##### 3.6.3 Stimulus/Response Sequences

- **Generate Report:**
  - Admin selects date range → System calculates and displays report.
- **Export Report:**
  - Admin clicks export → System generates CSV file.
- **View Payment History:**
  - Tutor navigates to payment history → System displays reports.

##### 3.6.4 Associated Interfaces

- **UI:** Payment report page, date range picker, export button.
- **API Endpoints:**
  - `GET /api/payments`: Generate payment report.
  - `GET /api/payments/export`: Export report as CSV.
  - `GET /api/tutors/:id/payments`: Fetch tutor’s payment history.

#### 3.7 Dashboard

##### 3.7.1 Description and Priority

The dashboard provides Admins with key metrics and visualizations. This is a medium-priority feature.

##### 3.7.2 Functional Requirements

- **FR7.1: Display Metrics**
  - Show: number of active students, upcoming sessions (next 7 days), total payments due (current month).
  - Use cards/widgets for each metric.

- **FR7.2: Visualizations**
  - Line chart: Number of sessions per week (last 4 weeks).
  - Pie chart: Sessions by status (scheduled, completed, canceled, paused).
  - Use a charting library (e.g., Chart.js).

- **FR7.3: Refresh Data**
  - Automatically refresh metrics every 5 minutes or on manual refresh.

##### 3.7.3 Stimulus/Response Sequences

- **View Dashboard:**
  - Admin navigates to dashboard → System fetches and displays metrics/charts.
- **Refresh:**
  - Admin clicks refresh → System updates data.

##### 3.7.4 Associated Interfaces

- **UI:** Dashboard with widgets and charts.
- **API Endpoints:**
  - `GET /api/dashboard`: Fetch dashboard data.

---

### 4. Data Requirements

#### 4.1 Data Models

- **User:**
  - `id`: UUID, primary key.
  - `email`: String, unique, max 255 chars.
  - `password`: String, hashed.
  - `full_name`: String, max 100 chars.
  - `phone`: String, max 20 chars, nullable.
  - `role`: Enum (Admin, Tutor).
  - `verified`: Boolean, default false.
  - `created_at`: Timestamp.

- **Student:**
  - `id`: UUID, primary key.
  - `full_name`: String, max 100 chars.
  - `email`: String, max 255 chars, nullable.
  - `phone`: String, max 20 chars, nullable.
  - `status`: Enum (Active, Inactive, Paused), default Active.
  - `tutor_id`: UUID, foreign key (Tutor), nullable.
  - `created_at`: Timestamp.
  - `archived`: Boolean, default false.

- **Tutor:**
  - `id`: UUID, primary key.
  - `full_name`: String, max 100 chars.
  - `email`: String, max 255 chars, nullable.
  - `phone`: String, max 20 chars, nullable.
  - `qualifications`: Text, nullable.
  - `hourly_rate`: Decimal, min 0.01.
  - `created_at`: Timestamp.
  - `archived`: Boolean, default false.

- **Availability:**
  - `id`: UUID, primary key.
  - `tutor_id`: UUID, foreign key (Tutor).
  - `day_of_week`: Enum (Monday, Tuesday, ..., Sunday).
  - `start_time`: Time.
  - `end_time`: Time.

- **Session:**
  - `id`: UUID, primary key.
  - `student_id`: UUID, foreign key (Student).
  - `tutor_id`: UUID, foreign key (Tutor).
  - `date`: Date.
  - `start_time`: Time.
  - `duration`: Integer, minutes.
  - `status`: Enum (Scheduled, Completed, Canceled, Paused), default Scheduled.
  - `created_at`: Timestamp.

#### 4.2 Database Schema

- Use a relational database (e.g., PostgreSQL).
- Ensure foreign key constraints for referential integrity.
- Index frequently queried fields (e.g., email, student_id, tutor_id).

---

### 5. External Interface Requirements

#### 5.1 User Interfaces

- **General:**
  - Responsive design for desktop (min-width: 1024px) and mobile (min-width: 320px).
  - Use a CSS framework (e.g., Tailwind CSS) for consistent styling.
  - Primary color scheme: Blue (#1E90FF), White (#FFFFFF), Gray (#F5F5F5).
  - Font: Roboto, sans-serif.

- **Pages:**
  - **Login/Register/Password Recovery:** Centered forms with email, password fields, and submit buttons.
  - **Dashboard:** Grid layout with metric cards and charts.
  - **Student/Tutor Management:** Tables with pagination (25 rows per page), sorting, and filtering.
  - **Scheduling:** Calendar view (using a library like FullCalendar) and session forms.
  - **Payment Reports:** Table with date range picker and export button.
  - **Profile:** Card layout with read-only fields and an edit form.

#### 5.2 Software Interfaces

- **Front End:** React with Axios for API calls.
- **Back End:** Node.js/Express or Django with RESTful APIs.
- **Database:** PostgreSQL with an ORM (e.g., Sequelize, Django ORM).
- **Email Service:** SMTP or third-party service (e.g., SendGrid) for verification and password reset emails.
- **Charting Library:** Chart.js for dashboard visualizations.
- **Calendar Library:** FullCalendar for scheduling.

#### 5.3 Communication Interfaces

- **HTTPS:** All API requests use HTTPS.
- **REST APIs:** JSON payloads for data exchange.
- **Email:** SMTP for sending verification and reset emails.

---

### 6. Non-Functional Requirements

#### 6.1 Performance Requirements

- **Response Time:** API responses within 2 seconds for 95% of requests under normal load.
- **Concurrent Users:** Support up to 100 concurrent users.
- **Database Queries:** Optimize for queries returning results in under 500ms.

#### 6.2 Security Requirements

- **Authentication:** Use JWT or session-based authentication.
- **Data Encryption:** Encrypt sensitive data (e.g., passwords, emails) at rest using AES-256.
- **Input Validation:** Sanitize all user inputs to prevent SQL injection and XSS attacks.
- **Rate Limiting:** Apply to login and password reset endpoints.
- **HTTPS:** Enforce for all communications.

#### 6.3 Usability Requirements

- **Intuitive UI:** Mimic Google Sheet layout for tables and forms where applicable.
- **Accessibility:** Follow WCAG 2.1 Level AA guidelines (e.g., keyboard navigation, screen reader support).
- **Error Messages:** Clear, user-friendly messages for all errors.

#### 6.4 Scalability Requirements

- **Horizontal Scaling:** Support adding more servers to handle increased load.
- **Database Scaling:** Use indexing and partitioning for large datasets (e.g., sessions table).

#### 6.5 Reliability Requirements

- **Uptime:** 99.9% availability.
- **Data Backup:** Daily backups with 7-day retention.
- **Error Handling:** Log all errors and provide Admin notifications for critical issues.

---

### 7. Other Requirements

#### 7.1 Regulatory Requirements

- Comply with GDPR for handling personal data (e.g., student/tutor emails, phone numbers).
- Provide data deletion options for archived students/tutors.

#### 7.2 Audit Requirements

- Log all user actions (e.g., create/edit/delete) with timestamps and user IDs.
- Store logs for 6 months.

#### 7.3 Development Requirements

- **Version Control:** Use Git with a branching strategy (e.g., GitFlow).
- **Testing:** Unit tests (80% coverage), integration tests, and end-to-end tests.
- **CI/CD:** Automate builds and deployments using a tool like GitHub Actions.

---

### 8. Assumptions

- The client will provide the Google Sheet for field and workflow analysis within 1 week of project start.
- Initial deployment will be on a single server, with scaling planned for future phases.
- No real-time notifications (e.g., WebSocket-based) are required unless specified.

---

### 9. Constraints

- **First Milestone:** Limited to User Authentication and My Profile.
- **Browser Support:** Latest versions of Chrome, Firefox, Safari, Edge.
- **Development Timeline:** To be confirmed with client for each milestone.

---

### 10. Risks

- **Google Sheet Misinterpretation:** Incorrect assumptions about fields/workflows could lead to rework.
  - **Mitigation:** Conduct a thorough analysis with client validation.
- **Scope Creep:** Client may request additional features mid-development.
  - **Mitigation:** Lock scope for each milestone and use change requests for additions.
- **Performance Issues:** Large session datasets could slow down queries.
  - **Mitigation:** Optimize database with indexing and caching.

---

### 11. Appendix

#### 11.1 Sample Data

- **User:** `{ id: "uuid", email: "admin@viva.com", full_name: "Jane Doe", role: "Admin", verified: true }`
- **Student:** `{ id: "uuid", full_name: "John Smith", email: "john@example.com", status: "Active", tutor_id: "uuid" }`
- **Tutor:** `{ id: "uuid", full_name: "Mary Johnson", hourly_rate: 25.00, qualifications: "PhD in Education" }`
- **Session:** `{ id: "uuid", student_id: "uuid", tutor_id: "uuid", date: "2025-05-01", start_time: "15:00", duration: 60, status: "Scheduled" }`

#### 11.2 UI Mockup Guidelines

- Use Figma for mockups, covering all pages (Login, Dashboard, Student/Tutor Management, Scheduling, Payments, Profile).
- Share mockups with client for approval before coding.
- Ensure consistency with the Google Sheet’s table-based layout for management pages.

#### 11.3 Development Milestones

- **Milestone 1:** User Authentication, My Profile (Figma mockups, implementation, testing).
- **Future Milestones (Pending Client Contract):**
  - Student Management.
  - Tutor Management.
  - Scheduling.
  - Payment Calculations.
  - Dashboard.

---

This SRS provides a complete blueprint for developing the VIVA Phonics Management Software, with detailed functional and non-functional requirements, data models, and interface specifications to guide the development team.