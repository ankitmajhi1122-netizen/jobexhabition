-- Database Schema for Job Exhibition

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('admin', 'company', 'consultancy', 'candidate') NOT NULL,
    is_verified BOOLEAN DEFAULT 0,
    otp_code VARCHAR(6),
    otp_expiry DATETIME,
    status ENUM('pending', 'active', 'suspended', 'rejected') DEFAULT 'active',
    api_token VARCHAR(255) UNIQUE,
    reset_token VARCHAR(255) NULL,
    reset_expiry DATETIME NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    company_name VARCHAR(255) NOT NULL,
    registration_no VARCHAR(100),
    contact_person VARCHAR(100),
    phone VARCHAR(20),
    address TEXT,
    logo_url VARCHAR(255),
    website VARCHAR(255),
    is_consultancy BOOLEAN DEFAULT 0,
    subscription_plan ENUM('free', 'basic', 'premium') DEFAULT 'free',
    jobs_posted_count INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS candidates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    skills TEXT,
    experience_years INT,
    resume_url VARCHAR(255),
    city VARCHAR(100),
    education TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employer_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    job_type ENUM('permanent', 'temporary', 'contract') DEFAULT 'permanent',
    location VARCHAR(100),
    salary_min DECIMAL(10, 2),
    salary_max DECIMAL(10, 2),
    experience_required VARCHAR(50),
    is_consultancy_job BOOLEAN DEFAULT 0,
    service_charge TEXT,
    terms_conditions TEXT,
    status ENUM('active', 'closed', 'removed') DEFAULT 'active',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employer_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    job_id INT NOT NULL,
    candidate_id INT NOT NULL,
    status ENUM('applied', 'viewed', 'shortlisted', 'rejected', 'hired') DEFAULT 'applied',
    applied_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (job_id) REFERENCES jobs(id) ON DELETE CASCADE,
    FOREIGN KEY (candidate_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS grievances (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    target_id INT, -- Optional: ID of the company/consultancy being reported
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status ENUM('open', 'resolved', 'dismissed') DEFAULT 'open',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
