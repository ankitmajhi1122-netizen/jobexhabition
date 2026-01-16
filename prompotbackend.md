You are a senior backend engineer with strong experience in PHP (8+), MySQL, REST APIs, security, and clean architecture.

PROJECT CONTEXT
---------------
Project Name: Job Exhibition
Domain: https://jobexhibition.com
Backend Folder Path: /jobportal-backend
Hosting: Shared hosting (Apache)
Language: PHP 8+
Database: MySQL (PDO)
Mailer: PHPMailer (Gmail SMTP)

PURPOSE
-------
Build a secure, scalable backend for a Job Portal platform that connects:
1. Companies / Businesses / Industries
2. Consultancies
3. Job Seekers (Candidates)

This backend must strictly follow best practices and MUST NOT contain errors, hardcoded logic bugs, or insecure patterns.

--------------------------------------------------
DATABASE CONNECTION (MANDATORY – USE EXACT DETAILS)
--------------------------------------------------
Use PDO only.

Function already defined and must be reused everywhere:

```php
function getPDO(): PDO {
    $host = 'localhost';
    $db   = 'u529002218_hibition';
    $user = 'u529002218_hibition';
    $pass = 'Rakesh@29032003';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    return new PDO($dsn, $user, $pass, $options);
}
````

DO NOT duplicate DB connection logic.
DO NOT use mysqli.

---

## EMAIL CONFIGURATION (MANDATORY – USE EXACT DETAILS)

Use PHPMailer with Gmail SMTP.

```php
function makeMailer(): PHPMailer {
    $mail = new PHPMailer(true);
    $mail->isSMTP();
    $mail->SMTPAuth = true;
    $mail->Host = 'smtp.gmail.com';
    $mail->Port = 587;
    $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
    $mail->Username = 'jyotijrs9404j@gmail.com';
    $mail->Password = 'prsx sihj jdne qikf';
    $mail->CharSet = 'UTF-8';
    $mail->isHTML(true);
    $mail->setFrom('jyotijrs9404j@gmail.com', 'Job Exhibition');
    return $mail;
}
```

Use email for:

* OTP verification
* Registration confirmation
* Password reset
* Job application notifications

---

## USER ROLES

1. Admin
2. Company / Employer
3. Consultancy
4. Candidate (Job Seeker)

---

## CORE BACKEND FEATURES TO IMPLEMENT

1. AUTHENTICATION SYSTEM

   * Secure registration & login
   * Password hashing (password_hash)
   * Email verification via OTP
   * Forgot password & reset password
   * Role-based access control

2. COMPANY / EMPLOYER MODULE

   * Company registration & verification
   * Post jobs (first 3 jobs FREE)
   * Manage job listings (CRUD)
   * View applicants
   * Choose hiring type:

     * Permanent
     * Temporary
     * Contract

3. CONSULTANCY MODULE

   * Consultancy registration
   * Job posting with:

     * Clear service charges
     * Terms & conditions field
   * Visibility tag: “Consultancy Job”
   * No payment handling by platform

4. CANDIDATE MODULE

   * Candidate registration (FREE always)
   * Profile management
   * Resume upload (PDF/DOC)
   * Apply for jobs
   * Track application status

5. JOB MANAGEMENT

   * Job categories
   * Skills
   * Locations
   * Salary range
   * Experience level
   * Company / Consultancy tag

6. GRIEVANCE & COMPLAINT SYSTEM

   * Candidates can submit complaints
   * Admin review panel
   * Actions:

     * Remove consultancy jobs
     * Suspend users if misuse detected

7. ADMIN PANEL (Backend APIs only)

   * Dashboard stats
   * Approve / reject companies & consultancies
   * Manage users
   * Manage job postings
   * Handle grievances

---

## HR & SOFTWARE ADD-ON MODULE

(Optional but structured)

* Employee attendance (Present / Absent)
* Login tracking
* Task assignment
* Work status
* Reminders
* Location tracking
* Activity logs
* 7-day free trial logic

---

## API & CODE STANDARDS

* Use REST API structure
* JSON responses only
* HTTP status codes properly
* Input validation & sanitization
* Prepared statements only
* No direct echo of DB errors
* Central error handling
* Token-based auth (JWT or session-based – choose one and be consistent)

---

## FOLDER STRUCTURE (MANDATORY)

/jobportal-backend
│── config/
│   ├── database.php
│   ├── mailer.php
│
│── auth/
│   ├── register.php
│   ├── login.php
│   ├── verify-otp.php
│   ├── forgot-password.php
│   ├── reset-password.php
│
│── admin/
│── company/
│── consultancy/
│── candidate/
│── jobs/
│── grievance/
│── middleware/
│── utils/

---

## IMPORTANT RULES

❌ Do NOT assume frontend logic
❌ Do NOT invent credentials
❌ Do NOT change database or email credentials
❌ Do NOT skip validation or security
✅ Write clean, production-ready code
✅ Explain each API briefly after writing it

## FINAL OUTPUT EXPECTATION

Generate:

1. Database schema (tables + relations)
2. Secure backend APIs
3. Sample request & response JSON
4. Clear comments in code
5. Zero syntax or logic errors

Start step-by-step.
Do not rush.
Do not skip modules.


