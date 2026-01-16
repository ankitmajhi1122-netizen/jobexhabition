# Candidate API Documentation

## 🎯 Overview

This document covers all API endpoints available for candidate users in the Job Portal system.

**Base URL:** `/candidate/`  
**Authentication:** Required (JWT token in Authorization header)  
**Content-Type:** `application/json`

---

## 📋 Table of Contents

1. [Profile Management](#profile-management)
2. [Saved Jobs](#saved-jobs)
3. [Work Experience](#work-experience)
4. [Education](#education)
5. [Skills](#skills)
6. [Projects/Portfolio](#projectsportfolio)
7. [Certifications](#certifications)
8. [Applications](#applications)
9. [Notifications](#notifications)
10. [Achievements](#achievements)
11. [Job Alerts](#job-alerts)
12. [Analytics](#analytics)
13. [Cover Letters](#cover-letters)
14. [File Uploads](#file-uploads)

---

## Profile Management

### Get Profile
```http
GET /candidate/profile.php
```

**Response:**
```json
{
  "status": "success",
  "message": "Candidate Profile",
  "data": {
    "id": 1,
    "user_id": 5,
    "full_name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "photo_url": "/uploads/photos/photo_5_1234567890.jpg",
    "profile_headline": "Senior Software Engineer",
    "city": "New York",
    "skills": "JavaScript, React, Node.js",
    "experience_years": 5,
    "education": "BSc Computer Science",
    "current_role": "Full Stack Developer",
    "bio": "Passionate developer with 5 years experience...",
    "portfolio_url": "https://johndoe.com",
    "linkedin_url": "https://linkedin.com/in/johndoe",
    "expected_salary": "$80,000 - $100,000",
    "resume_url": "/uploads/resumes/resume_5_1234567890.pdf",
    "profile_completeness": 85,
    "open_to_work": true,
    "job_seeking_status": "actively_looking"
  }
}
```

### Update Profile
```http
POST /candidate/profile.php
```

**Request Body:**
```json
{
  "full_name": "John Doe",
  "phone": "+1234567890",
  "profile_headline": "Senior Software Engineer",
  "city": "New York",
  "skills": "JavaScript, React, Node.js, Python",
  "experience_years": 5,
  "education": "BSc Computer Science, MIT",
  "current_role": "Full Stack Developer",
  "bio": "Passionate developer...",
  "portfolio_url": "https://johndoe.com",
  "linkedin_url": "https://linkedin.com/in/johndoe",
  "expected_salary": "$80,000 - $100,000"
}
```

---

## Saved Jobs

### Get All Saved Jobs
```http
GET /candidate/saved_jobs.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "saved_job_id": 1,
      "job_id": 42,
      "notes": "Great company culture",
      "saved_at": "2026-01-15 10:30:00",
      "title": "Senior React Developer",
      "location": "New York, NY",
      "job_type": "Full-time",
      "salary_min": 80000,
      "salary_max": 120000,
      "company_name": "TechCorp",
      "logo_url": "/uploads/logos/techcorp.png"
    }
  ]
}
```

### Save a Job
```http
POST /candidate/saved_jobs.php
```

**Request Body:**
```json
{
  "job_id": 42,
  "notes": "Interesting opportunity, apply next week"
}
```

### Unsave a Job
```http
DELETE /candidate/saved_jobs.php
```

**Request Body:**
```json
{
  "job_id": 42
}
```

### Update Notes
```http
PUT /candidate/saved_jobs.php
```

**Request Body:**
```json
{
  "job_id": 42,
  "notes": "Applied on Jan 15"
}
```

---

## Work Experience

### Get All Work Experience
```http
GET /candidate/work_experience.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "company_name": "TechCorp",
      "job_title": "Senior Developer",
      "location": "New York, NY",
      "employment_type": "full_time",
      "start_date": "2020-01-15",
      "end_date": null,
      "is_current": true,
      "description": "Leading frontend development team...",
      "achievements": "• Increased performance by 40%\n• Led team of 5",
      "skills_used": "React, TypeScript, AWS"
    }
  ]
}
```

### Add Work Experience
```http
POST /candidate/work_experience.php
```

**Request Body:**
```json
{
  "company_name": "TechCorp",
  "job_title": "Senior Developer",
  "location": "New York, NY",
  "employment_type": "full_time",
  "start_date": "2020-01-15",
  "end_date": null,
  "is_current": true,
  "description": "Leading frontend development...",
  "achievements": "• Increased performance by 40%",
  "skills_used": "React, TypeScript, AWS"
}
```

### Update Work Experience
```http
PUT /candidate/work_experience.php
```

**Request Body:**
```json
{
  "id": 1,
  "company_name": "TechCorp Inc",
  "job_title": "Lead Developer",
  "is_current": true
}
```

### Delete Work Experience
```http
DELETE /candidate/work_experience.php
```

**Request Body:**
```json
{
  "id": 1
}
```

---

## Education

### Get All Education
```http
GET /candidate/education.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "institution_name": "MIT",
      "degree": "Bachelor of Science",
      "field_of_study": "Computer Science",
      "start_year": 2015,
      "end_year": 2019,
      "grade": "3.8 GPA",
      "activities": "ACM Programming Club President",
      "description": "Focus on AI and Machine Learning"
    }
  ]
}
```

### Add Education
```http
POST /candidate/education.php
```

**Request Body:**
```json
{
  "institution_name": "MIT",
  "degree": "Bachelor of Science",
  "field_of_study": "Computer Science",
  "start_year": 2015,
  "end_year": 2019,
  "grade": "3.8 GPA"
}
```

### Update Education
```http
PUT /candidate/education.php
```

### Delete Education
```http
DELETE /candidate/education.php
```

---

## Skills

### Get All Skills
```http
GET /candidate/skills.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "skill_name": "React",
      "proficiency": "expert",
      "years_of_experience": 5,
      "is_primary": true,
      "endorsement_count": 12
    },
    {
      "id": 2,
      "skill_name": "Node.js",
      "proficiency": "advanced",
      "years_of_experience": 4,
      "is_primary": true,
      "endorsement_count": 8
    }
  ]
}
```

**Proficiency Levels:** `beginner`, `intermediate`, `advanced`, `expert`

### Add Skill
```http
POST /candidate/skills.php
```

**Request Body:**
```json
{
  "skill_name": "React",
  "proficiency": "expert",
  "years_of_experience": 5,
  "is_primary": true
}
```

### Update Skill
```http
PUT /candidate/skills.php
```

### Delete Skill
```http
DELETE /candidate/skills.php
```

---

## Projects/Portfolio

### Get All Projects
```http
GET /candidate/projects.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "project_name": "E-commerce Platform",
      "description": "Built full-stack e-commerce app",
      "role": "Lead Developer",
      "technologies_used": "React, Node.js, MongoDB",
      "project_url": "https://demo.example.com",
      "github_url": "https://github.com/user/project",
      "thumbnail_url": "/uploads/projects/thumb1.jpg",
      "start_date": "2023-01-01",
      "end_date": "2023-06-01",
      "is_ongoing": false,
      "is_featured": true
    }
  ]
}
```

### Add Project
```http
POST /candidate/projects.php
```

**Request Body:**
```json
{
  "project_name": "E-commerce Platform",
  "description": "Full-stack application with payment integration",
  "role": "Lead Developer",
  "technologies_used": "React, Node.js, MongoDB, Stripe",
  "project_url": "https://demo.example.com",
  "github_url": "https://github.com/user/project",
  "start_date": "2023-01-01",
  "end_date": "2023-06-01",
  "is_ongoing": false,
  "is_featured": true
}
```

---

## Certifications

### Get All Certifications
```http
GET /candidate/certifications.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "certification_name": "AWS Certified Solutions Architect",
      "issuing_organization": "Amazon Web Services",
      "issue_date": "2023-05-15",
      "expiry_date": "2026-05-15",
      "credential_id": "AWS-123456",
      "credential_url": "https://aws.amazon.com/verify/123456",
      "does_not_expire": false
    }
  ]
}
```

### Add Certification
```http
POST /candidate/certifications.php
```

**Request Body:**
```json
{
  "certification_name": "AWS Certified Solutions Architect",
  "issuing_organization": "Amazon Web Services",
  "issue_date": "2023-05-15",
  "expiry_date": "2026-05-15",
  "credential_id": "AWS-123456",
  "credential_url": "https://aws.amazon.com/verify/123456",
  "does_not_expire": false
}
```

---

## Applications

### Get My Applications
```http
GET /candidate/applications.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "application_id": 1,
      "job_id": 42,
      "status": "shortlisted",
      "applied_at": "2026-01-10 14:30:00",
      "title": "Senior React Developer",
      "location": "New York, NY",
      "salary_min": 80000,
      "salary_max": 120000,
      "company_name": "TechCorp"
    }
  ]
}
```

**Status Values:** `applied`, `viewed`, `shortlisted`, `rejected`, `hired`

---

## Notifications

### Get Notifications
```http
GET /candidate/notifications.php?limit=20&unread=true
```

**Query Parameters:**
- `limit` (optional): Number of notifications to return (default: 20)
- `unread` (optional): Set to `true` to get only unread notifications

**Response:**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": 1,
        "type": "application_status",
        "title": "Application Shortlisted",
        "message": "Your application for Senior Developer has been shortlisted",
        "link": "/candidate/applications/1",
        "is_read": false,
        "created_at": "2026-01-17 10:30:00"
      },
      {
        "id": 2,
        "type": "profile_view",
        "title": "Profile Viewed",
        "message": "TechCorp viewed your profile",
        "link": "/candidate/profile",
        "is_read": false,
        "created_at": "2026-01-17 09:15:00"
      }
    ],
    "unread_count": 5
  }
}
```

**Notification Types:**
- `application_status` - Application status changed
- `profile_view` - Company viewed your profile
- `new_job` - New job matching your alerts
- `message` - New message from recruiter
- `interview` - Interview scheduled
- `system` - System notifications

### Mark as Read
```http
PUT /candidate/notifications.php
```

**Mark Single Notification:**
```json
{
  "action": "mark_read",
  "id": 1
}
```

**Mark All as Read:**
```json
{
  "action": "mark_read"
}
```

### Delete Notification
```http
DELETE /candidate/notifications.php
```

**Request Body:**
```json
{
  "id": 1
}
```

---

## Achievements

### Get All Achievements
```http
GET /candidate/achievements.php
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "achievements": [
      {
        "id": 1,
        "name": "Profile Master",
        "description": "Complete your profile to 100%",
        "icon": "💎",
        "category": "profile",
        "points": 50,
        "is_earned": true,
        "earned_at": "2026-01-15 14:30:00"
      },
      {
        "id": 2,
        "name": "Job Seeker",
        "description": "Apply to 5 jobs",
        "icon": "📋",
        "category": "applications",
        "points": 25,
        "is_earned": false,
        "earned_at": null
      }
    ],
    "recent_achievements": [
      {
        "id": 1,
        "name": "Profile Master",
        "earned_at": "2026-01-15 14:30:00"
      }
    ],
    "stats": {
      "total_points": 125,
      "earned_count": 5,
      "total_count": 40,
      "completion_percentage": 13
    }
  }
}
```

**Achievement Categories:**
- `profile` - Profile completion
- `applications` - Job applications
- `social` - Networking and engagement
- `learning` - Education and growth
- `milestone` - Time-based milestones

---

## Job Alerts

### Get All Job Alerts
```http
GET /candidate/job_alerts.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "alert_name": "React Jobs in NYC",
      "keywords": "react, frontend",
      "location": "New York",
      "min_salary": 80000,
      "max_salary": 120000,
      "job_type": "full_time",
      "experience_level": "senior",
      "frequency": "daily",
      "is_active": true,
      "last_sent_at": "2026-01-17 08:00:00",
      "created_at": "2026-01-10 10:00:00"
    }
  ]
}
```

**Frequency Options:** `instant`, `daily`, `weekly`

### Create Job Alert
```http
POST /candidate/job_alerts.php
```

**Request Body:**
```json
{
  "alert_name": "React Jobs in NYC",
  "keywords": "react, frontend, javascript",
  "location": "New York",
  "min_salary": 80000,
  "max_salary": 120000,
  "job_type": "full_time",
  "experience_level": "senior",
  "frequency": "daily",
  "is_active": true
}
```

### Update Job Alert
```http
PUT /candidate/job_alerts.php
```

**Request Body:**
```json
{
  "id": 1,
  "alert_name": "Updated Alert Name",
  "frequency": "weekly",
  "is_active": false
}
```

### Delete Job Alert
```http
DELETE /candidate/job_alerts.php
```

**Request Body:**
```json
{
  "id": 1
}
```

---

## Analytics

### Get Analytics Dashboard
```http
GET /candidate/analytics.php
```

**Response:**
```json
{
  "status": "success",
  "data": {
    "applications": {
      "total": 25,
      "applied": 10,
      "viewed": 8,
      "shortlisted": 5,
      "rejected": 2,
      "hired": 0,
      "response_rate": 60.0,
      "success_rate": 20.0
    },
    "monthly_trend": [
      {"month": "2025-08", "count": 3},
      {"month": "2025-09", "count": 5},
      {"month": "2025-10", "count": 7},
      {"month": "2025-11", "count": 4},
      {"month": "2025-12", "count": 3},
      {"month": "2026-01", "count": 3}
    ],
    "profile_views": {
      "total": 45,
      "unique_companies": 12,
      "days_viewed": 8
    },
    "top_job_types": [
      {"job_type": "full_time", "count": 18},
      {"job_type": "contract", "count": 5},
      {"job_type": "part_time", "count": 2}
    ],
    "profile_completeness": 85
  }
}
```

**Metrics Explained:**
- `response_rate`: % of applications that received any response
- `success_rate`: % of applications that were shortlisted or hired
- `monthly_trend`: Number of applications per month (last 6 months)
- `unique_companies`: Number of different companies that viewed profile

---

## Cover Letters

### Get All Cover Letters
```http
GET /candidate/cover_letters.php
```

**Response:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "template_name": "Software Engineer Template",
      "content": "Dear Hiring Manager,\n\nI am excited to apply...",
      "is_default": true,
      "created_at": "2026-01-10 10:00:00",
      "updated_at": "2026-01-15 14:30:00"
    }
  ]
}
```

### Create Cover Letter
```http
POST /candidate/cover_letters.php
```

**Request Body:**
```json
{
  "template_name": "Software Engineer Template",
  "content": "Dear Hiring Manager,\n\nI am writing to express my interest in the {{job_title}} position at {{company_name}}...",
  "is_default": true
}
```

**Template Variables:**
- `{{job_title}}` - Will be replaced with job title
- `{{company_name}}` - Will be replaced with company name
- `{{your_name}}` - Will be replaced with candidate's name

### Update Cover Letter
```http
PUT /candidate/cover_letters.php
```

### Delete Cover Letter
```http
DELETE /candidate/cover_letters.php
```

---

## File Uploads

### Upload Profile Photo
```http
POST /candidate/photo_upload.php
Content-Type: multipart/form-data
```

**Form Data:**
- `photo`: Image file (JPG, PNG, WEBP, max 2MB)

**Response:**
```json
{
  "status": "success",
  "message": "Photo uploaded successfully",
  "data": {
    "url": "/uploads/photos/photo_5_1234567890.jpg"
  }
}
```

### Upload Resume
```http
POST /candidate/upload-resume.php
Content-Type: multipart/form-data
```

**Form Data:**
- `resume`: Resume file (PDF, DOC, DOCX, max 5MB)

**Response:**
```json
{
  "status": "success",
  "message": "Resume uploaded successfully",
  "data": {
    "url": "/uploads/resumes/resume_5_1234567890.pdf"
  }
}
```

---

## Error Responses

All endpoints return consistent error responses:

```json
{
  "status": "error",
  "message": "Error description here"
}
```

**Common HTTP Status Codes:**
- `200` - Success
- `400` - Bad Request (missing/invalid parameters)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (not a candidate user)
- `404` - Not Found
- `405` - Method Not Allowed
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

---

## Authentication

All endpoints require a valid JWT token in the Authorization header:

```http
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```

To obtain a token, use the login endpoint:

```http
POST /auth/login.php
Content-Type: application/json

{
  "email": "candidate@example.com",
  "password": "password123"
}
```

---

## Rate Limiting

- File uploads: 10 requests per hour
- Other endpoints: 100 requests per 15 minutes
- Exceeding limits returns `429 Too Many Requests`

---

## Testing with Postman

Import the Postman collection:
`/postman/Job_Exhibition_FULL.postman_collection.json`

Set environment variables:
- `base_url`: Your API base URL
- `token`: Your JWT authentication token

---

## Changelog

### Version 2.0 (2026-01-17)
- Added saved jobs endpoints
- Added work experience CRUD
- Added education management
- Added skills management
- Added projects/portfolio
- Added certifications
- Added notifications system
- Added achievements/gamification
- Added job alerts
- Added analytics dashboard
- Added cover letter templates
- Added profile photo upload

### Version 1.0 (Initial)
- Basic profile management
- Application tracking
- Resume upload

---

**Last Updated:** 2026-01-17  
**API Version:** 2.0  
**Author:** JobPortal Development Team
