# Job Exhibition Backend API - Sample Requests & Responses

## 1. Registration (Company)
**Endpoint**: `POST /jobportal-backend/auth/register.php`

**Request:**
```json
{
    "email": "techcorp@example.com",
    "password": "SecurePassword123!",
    "role": "company",
    "data": {
        "company_name": "Tech Corp Solutions",
        "phone": "9876543210"
    }
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Registration successful. Please verify your email.",
    "data": {
        "user_id": 15
    }
}
```

## 2. Login
**Endpoint**: `POST /jobportal-backend/auth/login.php`

**Request:**
```json
{
    "email": "techcorp@example.com",
    "password": "SecurePassword123!"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Login successful",
    "data": {
        "token": "a1b2c3d4e5f6...",
        "role": "company",
        "user_id": 15
    }
}
```

## 3. Forgot Password
**Endpoint**: `POST /jobportal-backend/auth/forgot-password.php`

**Request:**
```json
{
    "email": "techcorp@example.com"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "If your email is registered, you will receive a reset link."
}
```

## 4. Reset Password
**Endpoint**: `POST /jobportal-backend/auth/reset-password.php`

**Request:**
```json
{
    "token": "a1b2c3d4e5f6...",
    "password": "NewSecurePassword123!"
}
```

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Password reset successfully"
}
```

## 5. Post Job (Company)
**Endpoint**: `POST /jobportal-backend/jobs/create.php`
**Headers**: `Authorization: Bearer <token>`

**Request:**
```json
{
    "title": "Senior PHP Developer",
    "description": "We are looking for an experienced PHP developer...",
    "category": "IT",
    "job_type": "permanent",
    "location": "Pune",
    "salary_min": 500000,
    "salary_max": 1200000,
    "experience_required": "3-5 Years"
}
```

## 6. View My Applications (Candidate)
**Endpoint**: `GET /jobportal-backend/candidate/applications.php`
**Headers**: `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
    "success": true,
    "message": "My Applications",
    "data": [
        {
            "application_id": 5,
            "status": "applied",
            "applied_at": "2024-01-11 12:00:00",
            "title": "Senior PHP Developer",
            "company_name": "Tech Corp Solutions"
        }
    ]
}
```

## 7. View Job Applicants (Company)
**Endpoint**: `GET /jobportal-backend/company/applicants.php?job_id=101`
**Headers**: `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Applicants fetched",
    "data": [
        {
            "application_id": 5,
            "full_name": "John Doe",
            "resume_url": "/uploads/resumes/resume_123.pdf",
            "email": "john@example.com"
        }
    ]
}
```

## 8. Upload Resume (Candidate)
**Endpoint**: `POST /jobportal-backend/candidate/upload-resume.php`
**Headers**:
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request (Form Data):**
- `resume`: [File] (PDF/DOC)

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Resume uploaded successfully",
    "data": {
        "url": "/uploads/resumes/resume_5_1704900000.pdf"
    }
}
```

## 9. View Candidates (Admin)
**Endpoint**: `GET /jobportal-backend/admin/candidates.php`
**Headers**: `Authorization: Bearer <token>`

**Response (200 OK):**
```json
{
    "success": true,
    "message": "Candidates fetched",
    "data": [
        {
            "id": 5,
            "full_name": "John Doe",
            "resume_url": "/uploads/resumes/resume_123.pdf",
            "email": "john@example.com"
        }
    ]
}
```
