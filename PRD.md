Product Requirements Document (PRD)

## VIVA Phonics Management Software

---

### 1. Introduction

#### 1.1 Purpose

The VIVA Phonics Management Software aims to streamline the operations of VIVA Phonics, a business dedicated to helping students learn to read efficiently with the support of expert tutors. Currently, the client manages all business operations—student listings, tutor schedules, slot management, and payment calculations—through a Google Sheet. This manual process has become inefficient as the business grows. The software will automate these tasks, replicating and enhancing the existing system to save time, reduce errors, and improve overall efficiency.

#### 1.2 Scope

The software will focus on the following core functionalities:

- User authentication with role-based access
- Student management (e.g., adding, editing, tracking status)
- Tutor management (e.g., profiles, availability, assignments)
- Scheduling and slot management for tutoring sessions
- Payment calculations for tutors
- A dashboard for quick insights into key metrics

The software will not address unrelated business functions such as marketing or customer acquisition.

---

### 2. Stakeholders

- **Admin (Business Owner):** The primary user responsible for managing students, tutors, schedules, and payments.
- **Tutors:** Secondary users who will view their schedules, mark session statuses, and potentially access payment history.
- **Students/Parents:** Potential users with limited access (e.g., to view schedules), pending further clarification from the client.

---

### 3. Functional Requirements

#### 3.1 User Authentication

- Users can register with an email and password, including email verification.
- Login functionality with a password recovery option.
- Role-based access control:
  - **Admin:** Full access to all features.
  - **Tutor:** Limited access to view schedules and mark sessions.

#### 3.2 My Profile

- Users can view and edit personal details (e.g., name, contact info).
- Tutors can view their schedules and payment history (if applicable).

#### 3.3 Student Management

- Admin can add, edit, and delete student records.
- Student details include (to be confirmed via Google Sheet analysis):
  - Full name
  - Contact information (email, phone)
  - Status (active, inactive, paused)
  - Assigned tutor
  - Schedule (list of sessions)
- Assign students to tutors manually.
- Mark students as inactive when they are no longer serviced, releasing associated tutor slots.

#### 3.4 Tutor Management

- Admin can add, edit, and delete tutor records.
- Tutor details include (to be confirmed via Google Sheet analysis):
  - Full name
  - Contact information
  - Qualifications
  - Hourly rate
  - Availability (weekly slots)
- Set tutor availability as recurring weekly slots (e.g., Monday 3-5 PM).
- Assign students to tutors manually.

#### 3.5 Scheduling

- Create tutoring sessions with details: date, time, duration, student, tutor, and status (scheduled, completed, canceled, paused).
- Support scheduling individual sessions or batches (e.g., next 4 weeks).
- Prevent scheduling conflicts by checking tutor availability and existing sessions.
- Allow rescheduling or canceling sessions.
- When a student pauses their schedule:
  - Mark future sessions as paused or canceled.
  - Update tutor availability to reflect freed slots.

#### 3.6 Payment Calculations

- Automatically calculate tutor payments based on completed sessions.
- Support fixed hourly rates per tutor (configurable by admin).
- Generate payment reports for a specified date range (e.g., monthly summaries).
- Exclude paused or canceled sessions from payment calculations (configurable rules to be confirmed).

#### 3.7 Dashboard

- Provide an overview of key metrics, including:
  - Number of active students
  - Upcoming sessions (e.g., this week)
  - Total payments due to tutors
- Include visual elements (e.g., charts) for quick insights.

---

### 4. Non-Functional Requirements

- **Performance:** Handle up to 100 concurrent users with response times under 2 seconds.
- **Security:** Encrypt sensitive data (e.g., student and tutor information), use HTTPS, and implement secure authentication.
- **Usability:** Design an intuitive interface, mirroring the Google Sheet layout where applicable to ease the transition.
- **Scalability:** Support growth in the number of students, tutors, and sessions without performance degradation.

---

### 5. User Interface

- **General:** Clean, modern, and responsive design compatible with desktop and mobile devices.
- **Student/Tutor Management:** Tables listing students/tutors with sortable columns (e.g., name, status) and action buttons (add, edit, delete).
- **Scheduling:** Calendar view for session overview, with filters by tutor or student, and a form for creating new sessions.
- **Payment Calculations:** Report page with date range selection and exportable summaries.
- **Dashboard:** Widget-based layout displaying key metrics and charts.
- **Design Process:** UI mockups will be created in Figma for client review prior to development.

---

### 6. Integration

- **Optional Integrations (Future Consideration):**
  - Payment gateways for processing tutor payments.
  - Calendar apps (e.g., Google Calendar) for scheduling reminders.

---

### 7. Constraints

- Development will proceed in phases, with the first milestone focusing on:
  - User authentication
  - My Profile
- Subsequent milestones (Student Management, Tutor Management, Scheduling, Payment Calculations, Dashboard) will be added to the contract by the client.

---

### 8. Assumptions

- The software will be web-based unless otherwise specified.
- The client will provide access to the current Google Sheet for detailed analysis of fields and workflows.
- Initial data migration from the Google Sheet will be handled as a separate task.

---

### 9. Risks

- Misinterpreting the Google Sheet’s structure could lead to incorrect feature assumptions.
- Scope creep as the client may request additional features during development.
- Technical challenges in implementing real-time availability updates or complex payment rules.

---

### 10. Timeline

- **First Milestone (User Authentication & My Profile):** To be completed within \[insert client-specified timeframe\].
- Subsequent milestones will be scheduled upon client approval and contract updates.

---

### 11. Additional Notes

- The exact fields, workflows, and payment calculation rules will be finalized after analyzing the client’s Google Sheet.
- The software should allow flexibility for manual adjustments (e.g., marking students inactive, changing tutor assignments) to align with current practices.
- Figma mockups will cover the entire system and serve as the basis for client feedback before coding begins.