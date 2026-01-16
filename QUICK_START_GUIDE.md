# 🚀 Quick Start Guide - Candidate API Testing

## 📧 Your Test Account

**Email:** `sahoojyotiranjan114@gmail.com`  
**Password:** `Test@1234`  
**Base URL:** `http://localhost/jobportal-backend`

---

## ⚡ Quick Setup (5 Minutes)

### Step 1: Start Your Server
```bash
# Make sure your backend server is running
# If using XAMPP/WAMP, ensure Apache and MySQL are running
# Navigate to: http://localhost/phpmyadmin to verify database
```

### Step 2: Import Postman Collection

You have **2 options**:

#### Option A: Use the Text Guide (Easy)
1. Open `jobportal-backend/postman/CANDIDATE_API_COLLECTION.txt`
2. Copy-paste each request into Postman manually
3. Follow the order listed

#### Option B: Manual Setup in Postman
1. Open Postman
2. Click "New Collection"
3. Name it "Candidate API Tests"
4. Add requests from the text file

---

## 🎯 Testing Flow (Recommended Order)

### **STEP 1: Login & Get Token** ⭐ (MUST DO FIRST!)

```
Method: POST
URL: http://localhost/jobportal-backend/auth/login.php
Headers: Content-Type: application/json

Body (raw JSON):
{
    "email": "sahoojyotiranjan114@gmail.com",
    "password": "Test@1234"
}
```

**Expected Response:**
```json
{
    "status": "success",
    "message": "Login successful",
    "data": {
        "token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
        "user": {
            "id": 5,
            "email": "sahoojyotiranjan114@gmail.com",
            "role": "candidate",
            "name": "Jyotiranjan Sahoo"
        }
    }
}
```

**ACTION:** Copy the `token` value! You'll need it for ALL other requests.

---

### **STEP 2: Set Authorization for All Requests**

For EVERY request after login, add this header:
```
Authorization: Bearer YOUR_TOKEN_HERE
```

In Postman:
1. Go to "Authorization" tab
2. Type: Bearer Token
3. Paste your token

---

### **STEP 3: Test Profile** 📋

#### Get Current Profile
```
GET http://localhost/jobportal-backend/candidate/profile.php
Authorization: Bearer YOUR_TOKEN
```

#### Update Profile
```
POST http://localhost/jobportal-backend/candidate/profile.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "full_name": "Jyotiranjan Sahoo",
    "phone": "+91-9876543210",
    "profile_headline": "Full Stack Developer",
    "city": "Bhubaneswar, Odisha",
    "skills": "JavaScript, React, Node.js, PHP, MySQL",
    "experience_years": 3,
    "bio": "Passionate developer with 3 years experience"
}
```

---

### **STEP 4: Add Work Experience** 💼

```
POST http://localhost/jobportal-backend/candidate/work_experience.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "company_name": "Tech Solutions Pvt Ltd",
    "job_title": "Software Engineer",
    "location": "Bhubaneswar, Odisha",
    "employment_type": "full_time",
    "start_date": "2021-06-01",
    "end_date": null,
    "is_current": true,
    "description": "Developing web applications using MERN stack",
    "achievements": "• Built 5 major features\n• Improved performance by 40%",
    "skills_used": "React, Node.js, MongoDB"
}
```

---

### **STEP 5: Add Skills** 🛠️

Add multiple skills (run this 3-4 times with different skills):

```
POST http://localhost/jobportal-backend/candidate/skills.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "skill_name": "React",
    "proficiency": "expert",
    "years_of_experience": 3,
    "is_primary": true
}
```

Try these skills:
- React (expert, 3 years, primary)
- Node.js (advanced, 3 years, primary)
- PHP (intermediate, 2 years, not primary)
- MySQL (advanced, 3 years, primary)
- JavaScript (expert, 4 years, primary)

---

### **STEP 6: Add Education** 🎓

```
POST http://localhost/jobportal-backend/candidate/education.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "institution_name": "KIIT University",
    "degree": "Bachelor of Technology",
    "field_of_study": "Computer Science",
    "start_year": 2017,
    "end_year": 2021,
    "grade": "8.5 CGPA"
}
```

---

### **STEP 7: Add a Project** 🎨

```
POST http://localhost/jobportal-backend/candidate/projects.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "project_name": "E-commerce Platform",
    "description": "Full-stack e-commerce with payment integration",
    "role": "Full Stack Developer",
    "technologies_used": "React, Node.js, MongoDB, Stripe",
    "project_url": "https://demo.example.com",
    "github_url": "https://github.com/jyoti/ecommerce",
    "start_date": "2023-01-01",
    "end_date": "2023-06-30",
    "is_ongoing": false,
    "is_featured": true
}
```

---

### **STEP 8: Add Certification** 🏆

```
POST http://localhost/jobportal-backend/candidate/certifications.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "certification_name": "AWS Certified Solutions Architect",
    "issuing_organization": "Amazon Web Services",
    "issue_date": "2023-05-15",
    "expiry_date": "2026-05-15",
    "credential_id": "AWS-123456789",
    "does_not_expire": false
}
```

---

### **STEP 9: Check Your Achievements!** 🎮

```
GET http://localhost/jobportal-backend/candidate/achievements.php
Authorization: Bearer YOUR_TOKEN
```

You should see earned badges like:
- ✅ Profile Starter
- ✅ Profile Pro (if profile > 50% complete)
- ✅ Skill Builder (if 5+ skills added)
- ✅ Education Elite (if education added)

---

### **STEP 10: View Analytics** 📊

```
GET http://localhost/jobportal-backend/candidate/analytics.php
Authorization: Bearer YOUR_TOKEN
```

See your stats:
- Applications breakdown
- Response rate
- Profile completeness
- Monthly trends

---

### **STEP 11: Create Job Alert** 🔔

```
POST http://localhost/jobportal-backend/candidate/job_alerts.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "alert_name": "React Jobs in Odisha",
    "keywords": "react, frontend, javascript",
    "location": "Bhubaneswar",
    "min_salary": 500000,
    "max_salary": 800000,
    "job_type": "full_time",
    "frequency": "daily",
    "is_active": true
}
```

---

### **STEP 12: Save a Job** 🔖

First, get a job ID from the jobs table, then:

```
POST http://localhost/jobportal-backend/candidate/saved_jobs.php
Authorization: Bearer YOUR_TOKEN
Content-Type: application/json

{
    "job_id": 1,
    "notes": "Great company culture, apply next week"
}
```

---

### **STEP 13: Check Notifications** 🔔

```
GET http://localhost/jobportal-backend/candidate/notifications.php
Authorization: Bearer YOUR_TOKEN
```

You should see notifications from your profile updates!

---

## 📊 Complete Testing Checklist

Use this to track your testing progress:

- [ ] Login successfully and got token
- [ ] Get profile data
- [ ] Update profile information
- [ ] Add 1 work experience
- [ ] Add 3-5 skills
- [ ] Add 1 education record
- [ ] Add 1 project
- [ ] Add 1 certification
- [ ] View achievements (see earned badges)
- [ ] Check analytics dashboard
- [ ] Create 1 job alert
- [ ] Save a job
- [ ] View saved jobs
- [ ] Get notifications
- [ ] Mark notification as read
- [ ] Create cover letter template
- [ ] Upload profile photo (optional)
- [ ] Upload resume (optional)

---

## 🐛 Common Issues & Solutions

### Issue 1: "Unauthorized" Error
**Cause:** Token missing or expired  
**Solution:** Run login again and copy the new token

### Issue 2: "Access denied. Candidates only"
**Cause:** Logged in with wrong account  
**Solution:** Make sure you're using sahoojyotiranjan114@gmail.com

### Issue 3: "Job not found" (when saving job)
**Cause:** Invalid job_id  
**Solution:** Check jobs table for valid IDs or create a job first

### Issue 4: Connection refused
**Cause:** Server not running  
**Solution:** Start XAMPP/WAMP, verify Apache & MySQL are running

### Issue 5: "Method not allowed"
**Cause:** Wrong HTTP method  
**Solution:** Check if using correct method (GET/POST/PUT/DELETE)

---

## 📱 Expected Results After Full Test

After completing all steps, you should have:

✅ **Profile Completeness:** ~70-85%  
✅ **Achievements Earned:** 5-10 badges  
✅ **Total Points:** 100-200 points  
✅ **Work Experience:** 1 entry  
✅ **Skills:** 5 entries  
✅ **Education:** 1 entry  
✅ **Projects:** 1 entry  
✅ **Certifications:** 1 entry  
✅ **Saved Jobs:** 1+ jobs  
✅ **Job Alerts:** 1+ alerts  
✅ **Notifications:** Several unread  

---

## 🎯 What to Test Next

After basic testing:

1. **Update Operations**
   - Edit work experience
   - Update skills proficiency
   - Modify project details

2. **Delete Operations**
   - Remove a skill
   - Delete a certification
   - Unsave a job

3. **Advanced Features**
   - Filter notifications (unread only)
   - Update job alert frequency
   - Create multiple cover letter templates

4. **Analytics**
   - Check how stats change after adding data
   - View monthly trends
   - Track profile views

---

## 📝 Sample Test Data

### Indian Context Data

**Skills to Add:**
- React (expert, 3 years)
- Node.js (advanced, 3 years)
- MongoDB (intermediate, 2 years)
- Express.js (advanced, 2 years)
- AWS (beginner, 1 year)

**Companies (for work experience):**
- Infosys, Bangalore
- TCS, Bhubaneswar
- Wipro, Pune
- Tech Mahindra, Hyderabad

**Universities:**
- KIIT University, Bhubaneswar
- NIT Rourkela
- IIT Bhubaneswar
- VSSUT, Burla

**Salary Ranges (in INR):**
- Junior: 3,00,000 - 5,00,000
- Mid-level: 5,00,000 - 8,00,000
- Senior: 8,00,000 - 15,00,000
- Lead: 15,00,000 - 25,00,000

---

## 🚀 Next Steps After Testing

Once all APIs are tested:

1. **Frontend Development**
   - Build React components for each feature
   - Integrate API calls
   - Add loading states & error handling

2. **UI/UX Enhancement**
   - Add profile completeness progress bar
   - Show achievement badges on dashboard
   - Display analytics charts
   - Notification bell with count

3. **Advanced Features**
   - Real-time notifications (WebSockets)
   - Photo cropping tool
   - Resume parser
   - Job recommendations

---

## 📞 Need Help?

If you encounter issues:

1. Check `API_DOCUMENTATION_CANDIDATE.md` for detailed docs
2. Review `CANDIDATE_API_COLLECTION.txt` for all endpoints
3. Verify database migrations ran successfully
4. Check server logs for errors

---

## ✅ Testing Complete!

Once you've completed all tests:
- ✅ All 12 new endpoints working
- ✅ Profile completeness calculating correctly
- ✅ Achievements being awarded automatically
- ✅ Notifications generating properly
- ✅ Analytics showing correct data

**Status:** Ready for Frontend Integration! 🎉

---

**Last Updated:** 2026-01-17  
**Your Account:** sahoojyotiranjan114@gmail.com  
**Backend Status:** ✅ Fully Functional
