now frontend plan that my ai can reed backend then make frontend enty point should be user story type then other it should be profesnal style and all things should properly conect to backend one thing 1st create a typescript project using terminal and it should be use axios for api and hoc components and all roles have defernt  views  color view should diferten after login and all things have difrent i want profesnal best job portal and user story should be  best profesnal animeted and user should belive that its a trusted website 

You are a senior frontend architect and product engineer.

PROJECT
-------
Name: Job Exhibition
Frontend Type: Professional Job Portal
Backend: Existing REST APIs (already implemented)
Backend Base URL: https://jobexhibition.com/jobportal-backend
Tech Stack:
- TypeScript
- React
- Axios (API communication)
- HOC-based authentication & authorization
- Role-based routing
- Modern UI/UX standards

GOAL
----
Create a production-grade frontend that correctly reads backend APIs, 
handles role-based flows, and provides a clean, scalable, enterprise-level user experience.

--------------------------------------------------
STEP 1: PROJECT INITIALIZATION (MANDATORY)
--------------------------------------------------
1. Create a TypeScript project using terminal:
   - Use Vite + React + TypeScript
2. Folder name: jobportal-frontend
3. Configure:
   - Absolute imports
   - Environment variables (.env)
   - ESLint & Prettier
4. Install required libraries:
   - axios
   - react-router-dom
   - jwt-decode
   - react-hook-form
   - yup / zod
   - tailwindcss or equivalent professional UI system

--------------------------------------------------
STEP 2: API COMMUNICATION LAYER
--------------------------------------------------
1. Create a centralized Axios instance:
   - Base URL from environment
   - Request interceptor (attach token)
   - Response interceptor (handle errors)
2. No API call should be made without Axios instance
3. Handle:
   - 401 → auto logout
   - 403 → access denied
   - 500 → global error handler

--------------------------------------------------
STEP 3: USER ROLES (STRICT)
--------------------------------------------------
System must support these roles:
1. Admin
2. Company / Employer
3. Consultancy
4. Candidate (Job Seeker)

Each role:
- Has a different dashboard
- Has different navigation
- Has different permissions
- Cannot access other role pages

--------------------------------------------------
STEP 4: AUTHENTICATION FLOW (USER STORY)
--------------------------------------------------
User Story:
“As a user, I want to register, verify my email, login securely, and access 
only the pages that match my role.”

Frontend must implement:
1. Registration (role-based)
2. OTP verification screen
3. Login
4. Forgot password
5. Reset password
6. Secure token storage
7. Auto-login on refresh

--------------------------------------------------
STEP 5: HOC & ROUTE PROTECTION
--------------------------------------------------
1. Create Higher Order Components:
   - withAuth
   - withRole(role[])
2. Protect routes using HOCs
3. Redirect:
   - Not logged in → login
   - Wrong role → unauthorized page

--------------------------------------------------
STEP 6: ROLE-BASED DASHBOARDS (USER STORIES)
--------------------------------------------------

ADMIN USER STORY
----------------
“As an admin, I want to manage users, jobs, grievances, and platform health.”

Admin UI:
- Dashboard stats
- User management
- Job approval/removal
- Grievance handling

COMPANY USER STORY
------------------
“As a company, I want to post jobs, view applicants, and manage hiring.”

Company UI:
- Company profile
- Post job (first 3 free)
- Manage jobs
- View applicants
- Subscription status

CONSULTANCY USER STORY
----------------------
“As a consultancy, I want to post jobs with clear service charges.”

Consultancy UI:
- Profile
- Post consultancy jobs
- Mention charges & terms
- Job management

CANDIDATE USER STORY
--------------------
“As a candidate, I want to search jobs, apply, and track my applications.”

Candidate UI:
- Profile
- Resume upload
- Job search & filters
- Apply for jobs
- Application status tracking

--------------------------------------------------
STEP 7: JOB MODULE (COMMON)
--------------------------------------------------
1. Job listing page
2. Filters:
   - Location
   - Skill
   - Salary
   - Experience
3. Job details page
4. Company vs Consultancy tag
5. Apply button (candidate only)

--------------------------------------------------
STEP 8: GRIEVANCE MODULE
--------------------------------------------------
User Story:
“As a candidate, I want to raise a complaint if something goes wrong.”

Frontend:
- Complaint form
- Status tracking
- Admin response visibility

--------------------------------------------------
STEP 9: STATE MANAGEMENT
--------------------------------------------------
1. Central auth state
2. User role persistence
3. Token expiration handling
4. API loading & error states

--------------------------------------------------
STEP 10: UI/UX STANDARDS
--------------------------------------------------
1. Clean, corporate design
2. Consistent spacing & typography
3. Responsive layout
4. Accessible components
5. Professional empty states & loaders

--------------------------------------------------
STEP 11: FOLDER STRUCTURE (MANDATORY)
--------------------------------------------------
src/
├── api/
├── auth/
├── components/
├── hoc/
├── layouts/
├── pages/
│   ├── admin/
│   ├── company/
│   ├── consultancy/
│   ├── candidate/
├── routes/
├── types/
├── utils/

--------------------------------------------------
STEP 12: FINAL DELIVERY RULES
--------------------------------------------------
1. Frontend must match backend API exactly
2. No hardcoded data
3. Strong TypeScript typing
4. Reusable components
5. Clean code & comments
6. No role or security bypass

--------------------------------------------------
FINAL EXPECTATION
-----------------
Deliver:
1. Project setup commands
2. Complete folder structure
3. Authentication & routing logic
4. Role-based dashboards
5. Axios integration
6. Production-ready frontend

Work step-by-step.
Do not skip steps.
Do not assume APIs.
Build enterprise-quality UI.
