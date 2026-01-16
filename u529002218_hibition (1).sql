-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Jan 16, 2026 at 09:51 PM
-- Server version: 11.8.3-MariaDB-log
-- PHP Version: 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `u529002218_hibition`
--

-- --------------------------------------------------------

--
-- Table structure for table `achievements`
--

CREATE TABLE `achievements` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text NOT NULL,
  `icon` varchar(100) DEFAULT NULL,
  `category` enum('profile','applications','social','learning','milestone') DEFAULT 'milestone',
  `points` int(11) DEFAULT 0,
  `criteria` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `applications`
--

CREATE TABLE `applications` (
  `id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `status` enum('applied','viewed','shortlisted','rejected','hired') DEFAULT 'applied',
  `notes` text DEFAULT NULL,
  `withdrawn` tinyint(1) DEFAULT 0,
  `withdrawn_at` datetime DEFAULT NULL,
  `interview_date` datetime DEFAULT NULL,
  `interview_type` enum('phone','video','in_person') DEFAULT NULL,
  `interview_location` varchar(255) DEFAULT NULL,
  `interview_notes` text DEFAULT NULL,
  `status_updated_at` datetime DEFAULT NULL,
  `cover_letter_id` int(11) DEFAULT NULL,
  `salary_expectation` decimal(10,2) DEFAULT NULL,
  `cover_letter` text DEFAULT NULL,
  `applied_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `applications`
--

INSERT INTO `applications` (`id`, `job_id`, `candidate_id`, `status`, `notes`, `withdrawn`, `withdrawn_at`, `interview_date`, `interview_type`, `interview_location`, `interview_notes`, `status_updated_at`, `cover_letter_id`, `salary_expectation`, `cover_letter`, `applied_at`) VALUES
(7, 2, 4, 'viewed', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-16 18:47:00'),
(8, 1, 4, 'applied', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-16 18:51:00'),
(9, 3, 4, 'applied', NULL, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2026-01-16 18:54:07');

-- --------------------------------------------------------

--
-- Table structure for table `application_documents`
--

CREATE TABLE `application_documents` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `document_type` enum('cover_letter','portfolio','certificate','transcript','other') NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `application_timeline`
--

CREATE TABLE `application_timeline` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `status` varchar(50) NOT NULL,
  `notes` text DEFAULT NULL,
  `changed_by_user_id` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidates`
--

CREATE TABLE `candidates` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `full_name` varchar(255) NOT NULL,
  `profile_headline` varchar(200) DEFAULT NULL,
  `current_role` varchar(255) DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `skills` text DEFAULT NULL,
  `experience_years` int(11) DEFAULT NULL,
  `resume_url` varchar(255) DEFAULT NULL,
  `photo_url` varchar(255) DEFAULT NULL,
  `profile_completeness` int(11) DEFAULT 0,
  `profile_visibility` enum('public','private','connections_only') DEFAULT 'public',
  `show_resume_to_all` tinyint(1) DEFAULT 1,
  `allow_recruiter_contact` tinyint(1) DEFAULT 1,
  `anonymous_mode` tinyint(1) DEFAULT 0,
  `open_to_work` tinyint(1) DEFAULT 1,
  `open_to_work_visibility` enum('all','recruiters_only','hidden') DEFAULT 'all',
  `job_seeking_status` enum('actively_looking','open_to_offers','not_looking') DEFAULT 'open_to_offers',
  `portfolio_url` varchar(255) DEFAULT NULL,
  `linkedin_url` varchar(255) DEFAULT NULL,
  `expected_salary` varchar(100) DEFAULT NULL,
  `preferred_salary_min` decimal(10,2) DEFAULT NULL,
  `preferred_salary_max` decimal(10,2) DEFAULT NULL,
  `notice_period` varchar(50) DEFAULT NULL,
  `last_profile_update` datetime DEFAULT NULL,
  `city` varchar(100) DEFAULT NULL,
  `education` text DEFAULT NULL,
  `languages` text DEFAULT NULL,
  `certifications` text DEFAULT NULL,
  `achievements` text DEFAULT NULL,
  `availability` enum('immediate','2weeks','1month','not_looking') DEFAULT 'immediate',
  `willing_to_relocate` tinyint(1) DEFAULT 0,
  `preferred_job_types` text DEFAULT NULL,
  `preferred_locations` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidates`
--

INSERT INTO `candidates` (`id`, `user_id`, `full_name`, `profile_headline`, `current_role`, `bio`, `phone`, `skills`, `experience_years`, `resume_url`, `photo_url`, `profile_completeness`, `profile_visibility`, `show_resume_to_all`, `allow_recruiter_contact`, `anonymous_mode`, `open_to_work`, `open_to_work_visibility`, `job_seeking_status`, `portfolio_url`, `linkedin_url`, `expected_salary`, `preferred_salary_min`, `preferred_salary_max`, `notice_period`, `last_profile_update`, `city`, `education`, `languages`, `certifications`, `achievements`, `availability`, `willing_to_relocate`, `preferred_job_types`, `preferred_locations`) VALUES
(1, 4, 'Jyotiranjan Sahoppp', NULL, 'fdfdggfgfgf', '', '9988776633', 'react', 0, NULL, NULL, 0, 'public', 1, 1, 0, 1, 'all', 'open_to_offers', '', '', '', NULL, NULL, NULL, NULL, 'bdk', '', NULL, NULL, NULL, 'immediate', 0, NULL, NULL),
(2, 7, 'sai', NULL, NULL, NULL, '1234567890', NULL, NULL, NULL, NULL, 0, 'public', 1, 1, 0, 1, 'all', 'open_to_offers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'immediate', 0, NULL, NULL),
(3, 8, 'sai', NULL, NULL, NULL, '1234567890', NULL, NULL, NULL, NULL, 0, 'public', 1, 1, 0, 1, 'all', 'open_to_offers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'immediate', 0, NULL, NULL),
(4, 12, 'Greenbacks micro services', NULL, NULL, NULL, '9861920897', NULL, NULL, NULL, NULL, 0, 'public', 1, 1, 0, 1, 'all', 'open_to_offers', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'immediate', 0, NULL, NULL),
(5, 14, 'jyoti', NULL, '', '', '1234567891', '', 0, NULL, NULL, 0, 'public', 1, 1, 0, 1, 'all', 'open_to_offers', '', '', '', NULL, NULL, NULL, NULL, 'bhubneswar', '', NULL, NULL, NULL, 'immediate', 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `candidate_achievements`
--

CREATE TABLE `candidate_achievements` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `achievement_id` int(11) NOT NULL,
  `earned_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidate_documents`
--

CREATE TABLE `candidate_documents` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `document_name` varchar(255) NOT NULL,
  `document_type` enum('resume','certificate','transcript','portfolio','reference','other') NOT NULL,
  `document_url` varchar(255) NOT NULL,
  `file_size` int(11) DEFAULT NULL,
  `mime_type` varchar(100) DEFAULT NULL,
  `folder` varchar(100) DEFAULT 'General',
  `is_public` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `uploaded_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `candidate_skills`
--

CREATE TABLE `candidate_skills` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `skill_name` varchar(100) NOT NULL,
  `proficiency` enum('beginner','intermediate','advanced','expert') DEFAULT 'intermediate',
  `years_of_experience` int(11) DEFAULT 0,
  `is_primary` tinyint(1) DEFAULT 0,
  `endorsement_count` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `candidate_skills`
--

INSERT INTO `candidate_skills` (`id`, `candidate_id`, `skill_name`, `proficiency`, `years_of_experience`, `is_primary`, `endorsement_count`, `created_at`) VALUES
(1, 4, 'java', 'beginner', 0, 1, 0, '2026-01-16 20:53:27'),
(2, 4, 'ruerr', 'beginner', 0, 1, 0, '2026-01-16 20:55:40');

-- --------------------------------------------------------

--
-- Table structure for table `career_goals`
--

CREATE TABLE `career_goals` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `goal_type` enum('job_title','salary','skills','company','location','custom') NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `target_value` text DEFAULT NULL,
  `current_value` text DEFAULT NULL,
  `target_date` date DEFAULT NULL,
  `progress` int(11) DEFAULT 0,
  `achieved` tinyint(1) DEFAULT 0,
  `achieved_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `certifications`
--

CREATE TABLE `certifications` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `certification_name` varchar(255) NOT NULL,
  `issuing_organization` varchar(255) NOT NULL,
  `issue_date` date DEFAULT NULL,
  `expiry_date` date DEFAULT NULL,
  `credential_id` varchar(100) DEFAULT NULL,
  `credential_url` varchar(255) DEFAULT NULL,
  `does_not_expire` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `companies`
--

CREATE TABLE `companies` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `registration_no` varchar(100) DEFAULT NULL,
  `contact_person` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `logo_url` varchar(255) DEFAULT NULL,
  `website` varchar(255) DEFAULT NULL,
  `is_consultancy` tinyint(1) DEFAULT 0,
  `subscription_plan` enum('free','basic','premium') DEFAULT 'free',
  `jobs_posted_count` int(11) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `companies`
--

INSERT INTO `companies` (`id`, `user_id`, `company_name`, `registration_no`, `contact_person`, `phone`, `address`, `logo_url`, `website`, `is_consultancy`, `subscription_plan`, `jobs_posted_count`) VALUES
(2, 2, 'greenbacks', NULL, NULL, '9876543210', NULL, NULL, NULL, 0, 'free', 1),
(3, 5, 'Jena Consultancy', NULL, NULL, '9988776644', NULL, NULL, NULL, 1, 'free', 0),
(4, 6, 'Tech Giants Ltd', '', '', '', 'Main Street, Pune', NULL, 'https://techgiants.com', 0, 'free', 1),
(5, 9, 'Hardini Dynamics Pvt Ltd', NULL, NULL, '6371428907', NULL, NULL, NULL, 0, 'free', 0),
(6, 10, 'greenbacks', '78545566225555', 'akdjdhf', '7788881800', 'at kalishganga po himalaya dist yampuri pin 786', NULL, 'www.xyz.com', 0, 'free', 1),
(7, 11, 'Greenbacks micro services', NULL, NULL, '9861920897', NULL, NULL, NULL, 0, 'free', 0),
(8, 13, 'Greenbacks Micro Services', NULL, NULL, '9861920897', NULL, NULL, NULL, 0, 'free', 0);

-- --------------------------------------------------------

--
-- Table structure for table `company_reviews`
--

CREATE TABLE `company_reviews` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `rating` int(11) NOT NULL CHECK (`rating` between 1 and 5),
  `work_life_balance` int(11) DEFAULT NULL CHECK (`work_life_balance` between 1 and 5),
  `salary_benefits` int(11) DEFAULT NULL CHECK (`salary_benefits` between 1 and 5),
  `culture` int(11) DEFAULT NULL CHECK (`culture` between 1 and 5),
  `management` int(11) DEFAULT NULL CHECK (`management` between 1 and 5),
  `career_growth` int(11) DEFAULT NULL CHECK (`career_growth` between 1 and 5),
  `review_title` varchar(200) NOT NULL,
  `review_text` text NOT NULL,
  `pros` text DEFAULT NULL,
  `cons` text DEFAULT NULL,
  `advice_to_management` text DEFAULT NULL,
  `employment_status` enum('current','former') NOT NULL,
  `job_title` varchar(100) DEFAULT NULL,
  `years_at_company` int(11) DEFAULT NULL,
  `is_anonymous` tinyint(1) DEFAULT 0,
  `is_verified` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `helpful_count` int(11) DEFAULT 0,
  `status` enum('pending','approved','rejected') DEFAULT 'pending',
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `conversations`
--

CREATE TABLE `conversations` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `job_id` int(11) DEFAULT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `last_message_at` datetime DEFAULT current_timestamp(),
  `is_archived` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cover_letters`
--

CREATE TABLE `cover_letters` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `template_name` varchar(100) NOT NULL,
  `content` text NOT NULL,
  `is_default` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `education`
--

CREATE TABLE `education` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `institution_name` varchar(255) NOT NULL,
  `degree` varchar(100) NOT NULL,
  `field_of_study` varchar(100) DEFAULT NULL,
  `start_year` int(11) DEFAULT NULL,
  `end_year` int(11) DEFAULT NULL,
  `grade` varchar(50) DEFAULT NULL,
  `activities` text DEFAULT NULL,
  `description` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `grievances`
--

CREATE TABLE `grievances` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `target_id` int(11) DEFAULT NULL,
  `subject` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `status` enum('open','resolved','dismissed') DEFAULT 'open',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `interviews`
--

CREATE TABLE `interviews` (
  `id` int(11) NOT NULL,
  `application_id` int(11) NOT NULL,
  `interview_type` enum('phone','video','in_person','assessment') NOT NULL,
  `scheduled_date` datetime NOT NULL,
  `duration_minutes` int(11) DEFAULT 60,
  `timezone` varchar(50) DEFAULT 'UTC',
  `location` varchar(255) DEFAULT NULL,
  `meeting_link` varchar(255) DEFAULT NULL,
  `meeting_password` varchar(100) DEFAULT NULL,
  `interviewer_name` varchar(100) DEFAULT NULL,
  `interviewer_email` varchar(100) DEFAULT NULL,
  `interviewer_phone` varchar(20) DEFAULT NULL,
  `candidate_status` enum('pending','confirmed','declined','rescheduled','completed','cancelled') DEFAULT 'pending',
  `company_status` enum('pending','confirmed','cancelled') DEFAULT 'confirmed',
  `company_notes` text DEFAULT NULL,
  `candidate_notes` text DEFAULT NULL,
  `feedback` text DEFAULT NULL,
  `rating` int(11) DEFAULT NULL,
  `reminder_sent` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` int(11) NOT NULL,
  `employer_id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `job_type` enum('permanent','temporary','contract') DEFAULT 'permanent',
  `location` varchar(100) DEFAULT NULL,
  `salary_min` decimal(10,2) DEFAULT NULL,
  `salary_max` decimal(10,2) DEFAULT NULL,
  `experience_required` varchar(50) DEFAULT NULL,
  `is_consultancy_job` tinyint(1) DEFAULT 0,
  `service_charge` text DEFAULT NULL,
  `terms_conditions` text DEFAULT NULL,
  `status` enum('active','closed','removed') DEFAULT 'active',
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `employer_id`, `title`, `description`, `category`, `job_type`, `location`, `salary_min`, `salary_max`, `experience_required`, `is_consultancy_job`, `service_charge`, `terms_conditions`, `status`, `created_at`) VALUES
(1, 2, 'Senior PHP Developer', 'We are looking for an experienced PHP developer...', 'IT', 'permanent', 'Pune', 500000.00, 1200000.00, '3-5 Years', 0, NULL, NULL, 'active', '2026-01-11 08:56:04'),
(2, 6, 'Java Develoer', 'Need strong Java skils.', 'IT', 'permanent', 'Main Street, Pune', 600000.00, 1400000.00, '2-4 Years', 0, NULL, NULL, 'active', '2026-01-11 09:22:56'),
(3, 10, 'facility manager for greenbacks', 'operational work for floor', 'admin', 'permanent', 'India', 15000.00, 20000.00, '1-2years', 0, NULL, NULL, 'active', '2026-01-13 05:39:13');

-- --------------------------------------------------------

--
-- Table structure for table `job_alerts`
--

CREATE TABLE `job_alerts` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `alert_name` varchar(100) DEFAULT 'My Alert',
  `keywords` text DEFAULT NULL,
  `location` varchar(100) DEFAULT NULL,
  `min_salary` decimal(10,2) DEFAULT NULL,
  `max_salary` decimal(10,2) DEFAULT NULL,
  `job_type` varchar(50) DEFAULT NULL,
  `experience_level` varchar(50) DEFAULT NULL,
  `frequency` enum('instant','daily','weekly') DEFAULT 'daily',
  `is_active` tinyint(1) DEFAULT 1,
  `last_sent_at` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `messages`
--

CREATE TABLE `messages` (
  `id` int(11) NOT NULL,
  `conversation_id` int(11) NOT NULL,
  `sender_id` int(11) NOT NULL,
  `message` text NOT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `read_at` datetime DEFAULT NULL,
  `sent_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `type` enum('application_status','profile_view','new_job','message','interview','system') NOT NULL,
  `title` varchar(255) NOT NULL,
  `message` text DEFAULT NULL,
  `link` varchar(255) DEFAULT NULL,
  `metadata` text DEFAULT NULL,
  `is_read` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `read_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `profile_views`
--

CREATE TABLE `profile_views` (
  `id` int(11) NOT NULL,
  `company_id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `viewed_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `projects`
--

CREATE TABLE `projects` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `project_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `role` varchar(100) DEFAULT NULL,
  `technologies_used` text DEFAULT NULL,
  `project_url` varchar(255) DEFAULT NULL,
  `github_url` varchar(255) DEFAULT NULL,
  `thumbnail_url` varchar(255) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  `is_ongoing` tinyint(1) DEFAULT 0,
  `is_featured` tinyint(1) DEFAULT 0,
  `display_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `referrals`
--

CREATE TABLE `referrals` (
  `id` int(11) NOT NULL,
  `referrer_id` int(11) NOT NULL,
  `referred_email` varchar(255) NOT NULL,
  `referred_user_id` int(11) DEFAULT NULL,
  `referral_code` varchar(50) NOT NULL,
  `status` enum('pending','registered','completed') DEFAULT 'pending',
  `reward_points` int(11) DEFAULT 0,
  `reward_claimed` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `completed_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review_helpful_votes`
--

CREATE TABLE `review_helpful_votes` (
  `id` int(11) NOT NULL,
  `review_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_jobs`
--

CREATE TABLE `saved_jobs` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `job_id` int(11) NOT NULL,
  `notes` text DEFAULT NULL,
  `saved_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `saved_searches`
--

CREATE TABLE `saved_searches` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `search_name` varchar(100) NOT NULL,
  `search_query` text NOT NULL,
  `filters` text DEFAULT NULL,
  `is_alert_enabled` tinyint(1) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `role` enum('admin','company','consultancy','candidate') NOT NULL,
  `is_verified` tinyint(1) DEFAULT 0,
  `otp_code` varchar(6) DEFAULT NULL,
  `otp_expiry` datetime DEFAULT NULL,
  `status` enum('pending','active','suspended','rejected') DEFAULT 'active',
  `api_token` varchar(255) DEFAULT NULL,
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expiry` datetime DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `password_hash`, `role`, `is_verified`, `otp_code`, `otp_expiry`, `status`, `api_token`, `reset_token`, `reset_expiry`, `created_at`, `updated_at`) VALUES
(2, 'greenbacksmicroservices@gmail.com', '$2y$10$IyGDCQGOORp6R7v1zVaSz.caKBfCWAejDTKhmP3t.D49bGNHytd/S', 'company', 1, NULL, NULL, 'active', '099a70343fda2a75f3f4c8b05215147612a805cb2cec9034b5a066cdd0b021c0', NULL, NULL, '2026-01-11 08:37:58', '2026-01-11 13:56:43'),
(3, 'admin@gmail.com', '$2y$10$K6IdQumBV7ur0rxEJFiRH.S3.ZvLh5lwn3gTtQIfxBMgJN8j74hn.', 'admin', 1, NULL, NULL, 'active', '2186d944203e515e3cea3aa5f2710983520bef366fac4c3229d1066eca404179', NULL, NULL, '2026-01-11 08:53:32', '2026-01-15 06:09:54'),
(4, 'sahoojyotiranjan114@gmail.com', '$2y$10$U.e2M8g0z1Fs8JE5aeSka.dpaikkR8jAHV1iJFmWzZ..e3ZqFyLO.', 'candidate', 1, NULL, NULL, 'active', '4947733c54f3321bec57970b4662322e0f699ebc9d545f25c0d3dd904b6a9dd8', NULL, NULL, '2026-01-11 09:11:31', '2026-01-16 21:22:43'),
(5, 'jenapragnya65@gmail.com', '$2y$10$Vin1Rvcn.KdmyzQ2y5EyWe43EVHVEr2r/7emy/nRnd8TAyWZtwiQ.', 'consultancy', 1, NULL, NULL, 'active', NULL, NULL, NULL, '2026-01-11 09:13:10', '2026-01-11 09:16:44'),
(6, 'rs.sabkapaisa@gmail.com', '$2y$10$qLhT2WmGejqWajkhf1I8dORcnZxS9JrJ1AynNlKj8I5wzlcmuzQKy', 'company', 1, NULL, NULL, 'active', 'd37e9b2b987a427d9769dc0aff528be2612f3f150489691836cb56aa6df7cba3', NULL, NULL, '2026-01-11 09:14:11', '2026-01-11 09:17:11'),
(7, 'Sai@gmail.com', '$2y$10$JfMyhCJaOsg.CZEi5.0lueg0qBAwDw2uUaSdxKSdgWoWQhdILRw8O', 'candidate', 1, NULL, NULL, 'active', '333cc8e9100a98170178146d2061dd1a69de492a83f57aaa11d9d7808114eaac', NULL, NULL, '2026-01-11 11:19:21', '2026-01-11 12:39:28'),
(8, 'Sai1sw@gmail.com', '$2y$10$fgBbKZee5htagZI6/gCowOlvS4CthxJf5vhr75w7qTJyTdhLktJIy', 'candidate', 1, NULL, NULL, 'active', 'c82badef29f4b34368ed3756dbf76d777b826178e62534d17ad92b11d2db9459', NULL, NULL, '2026-01-11 11:33:44', '2026-01-11 13:32:01'),
(9, 'arundhatipadhi30@gmail.com', '$2y$10$m4YJ/8Y04NYZ02TVeGWa9eT3GsnBmZb6GrrTTKcz.y5sJ/RBauYB.', 'company', 0, '989265', '2026-01-11 14:21:12', 'pending', NULL, NULL, NULL, '2026-01-11 14:06:12', '2026-01-11 14:06:12'),
(10, 'rakesh23111993@gmail.com', '$2y$10$QmQGKiOU0rQoKFY81bhvw.oELPqOOq1AkwYiGzps8sDrKkkM1gLf6', 'company', 1, NULL, NULL, 'active', 'd517e4490477f79b964d23a38d74d7d0fc60ccaaaead15675e30132d711e230c', NULL, NULL, '2026-01-13 05:33:15', '2026-01-13 05:34:47'),
(11, 'jenapragnyaparamita@gmail.com', '$2y$10$Hl2hfZe88nORH1ZC50Z2.uN4emIAtBbfzxfz.8ATw8wLdDz6meCza', 'company', 0, '326792', '2026-01-16 17:12:32', 'pending', NULL, NULL, NULL, '2026-01-16 16:57:32', '2026-01-16 16:57:32'),
(12, 'jenapragyanparamita94@gmail.com', '$2y$10$0fRas1OrOmCEfTmnN.f0WOiFu7enkbtYVheuFTaX4ynudOBR/YC7O', 'candidate', 1, NULL, NULL, 'active', 'e76718a24db389772c351412a16244c2b602038f977599fc65bce8eb1c655059', NULL, NULL, '2026-01-16 17:00:19', '2026-01-16 17:01:10'),
(13, 'r75962219@gmail.com', '$2y$10$O2K9/mM8bCaPcdDAIfm/9uRfvkNRq3P1h9NASUl6Oq8tBznYtg166', 'company', 1, NULL, NULL, 'pending', NULL, NULL, NULL, '2026-01-16 17:02:47', '2026-01-16 17:06:05'),
(14, 'jssahoo995@gmail.com', '$2y$10$Ytb3ycgzUnYbcssF6URvKeK16sQ.BO0rOTQ2/8.ow7Wx/iJ6ANYzy', 'candidate', 1, NULL, NULL, 'active', '66d9a29516e2c64ec82635abb5f51a254038325e57aab18884b1d7f19fcfc80e', NULL, NULL, '2026-01-16 21:47:11', '2026-01-16 21:48:29');

-- --------------------------------------------------------

--
-- Table structure for table `work_experience`
--

CREATE TABLE `work_experience` (
  `id` int(11) NOT NULL,
  `candidate_id` int(11) NOT NULL,
  `company_name` varchar(255) NOT NULL,
  `job_title` varchar(255) NOT NULL,
  `location` varchar(100) DEFAULT NULL,
  `employment_type` enum('full_time','part_time','contract','internship','freelance') DEFAULT 'full_time',
  `start_date` date NOT NULL,
  `end_date` date DEFAULT NULL,
  `is_current` tinyint(1) DEFAULT 0,
  `description` text DEFAULT NULL,
  `achievements` text DEFAULT NULL,
  `skills_used` text DEFAULT NULL,
  `display_order` int(11) DEFAULT 0,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `achievements`
--
ALTER TABLE `achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `applications`
--
ALTER TABLE `applications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate_status` (`candidate_id`,`status`),
  ADD KEY `idx_job_status` (`job_id`,`status`);

--
-- Indexes for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_application` (`application_id`);

--
-- Indexes for table `application_timeline`
--
ALTER TABLE `application_timeline`
  ADD PRIMARY KEY (`id`),
  ADD KEY `changed_by_user_id` (`changed_by_user_id`),
  ADD KEY `idx_application` (`application_id`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `candidates`
--
ALTER TABLE `candidates`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);
ALTER TABLE `candidates` ADD FULLTEXT KEY `ft_skills` (`skills`);

--
-- Indexes for table `candidate_achievements`
--
ALTER TABLE `candidate_achievements`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_candidate_achievement` (`candidate_id`,`achievement_id`),
  ADD KEY `achievement_id` (`achievement_id`),
  ADD KEY `idx_candidate` (`candidate_id`);

--
-- Indexes for table `candidate_documents`
--
ALTER TABLE `candidate_documents`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_type` (`document_type`),
  ADD KEY `idx_public` (`is_public`);

--
-- Indexes for table `candidate_skills`
--
ALTER TABLE `candidate_skills`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_candidate_skill` (`candidate_id`,`skill_name`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_primary` (`is_primary`);

--
-- Indexes for table `career_goals`
--
ALTER TABLE `career_goals`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_achieved` (`achieved`);

--
-- Indexes for table `certifications`
--
ALTER TABLE `certifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`);

--
-- Indexes for table `companies`
--
ALTER TABLE `companies`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `company_reviews`
--
ALTER TABLE `company_reviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_company` (`company_id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_rating` (`rating`),
  ADD KEY `idx_status` (`status`);

--
-- Indexes for table `conversations`
--
ALTER TABLE `conversations`
  ADD PRIMARY KEY (`id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_company` (`company_id`),
  ADD KEY `idx_last_message` (`last_message_at`);

--
-- Indexes for table `cover_letters`
--
ALTER TABLE `cover_letters`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_default` (`is_default`);

--
-- Indexes for table `education`
--
ALTER TABLE `education`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`);

--
-- Indexes for table `grievances`
--
ALTER TABLE `grievances`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `interviews`
--
ALTER TABLE `interviews`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_application` (`application_id`),
  ADD KEY `idx_scheduled` (`scheduled_date`),
  ADD KEY `idx_candidate_status` (`candidate_status`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `employer_id` (`employer_id`),
  ADD KEY `idx_location_type` (`location`,`job_type`),
  ADD KEY `idx_status_created` (`status`,`created_at`);
ALTER TABLE `jobs` ADD FULLTEXT KEY `ft_title_description` (`title`,`description`);

--
-- Indexes for table `job_alerts`
--
ALTER TABLE `job_alerts`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_active` (`is_active`);

--
-- Indexes for table `messages`
--
ALTER TABLE `messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_conversation` (`conversation_id`),
  ADD KEY `idx_sender` (`sender_id`),
  ADD KEY `idx_read` (`is_read`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_user` (`user_id`),
  ADD KEY `idx_read` (`is_read`),
  ADD KEY `idx_created` (`created_at`);

--
-- Indexes for table `profile_views`
--
ALTER TABLE `profile_views`
  ADD PRIMARY KEY (`id`),
  ADD KEY `company_id` (`company_id`),
  ADD KEY `candidate_id` (`candidate_id`);

--
-- Indexes for table `projects`
--
ALTER TABLE `projects`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_featured` (`is_featured`);

--
-- Indexes for table `referrals`
--
ALTER TABLE `referrals`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `referral_code` (`referral_code`),
  ADD KEY `referred_user_id` (`referred_user_id`),
  ADD KEY `idx_referrer` (`referrer_id`),
  ADD KEY `idx_code` (`referral_code`);

--
-- Indexes for table `review_helpful_votes`
--
ALTER TABLE `review_helpful_votes`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_vote` (`review_id`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_saved_job` (`candidate_id`,`job_id`),
  ADD KEY `job_id` (`job_id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_saved_at` (`saved_at`);

--
-- Indexes for table `saved_searches`
--
ALTER TABLE `saved_searches`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `api_token` (`api_token`);

--
-- Indexes for table `work_experience`
--
ALTER TABLE `work_experience`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_candidate` (`candidate_id`),
  ADD KEY `idx_current` (`is_current`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `achievements`
--
ALTER TABLE `achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `applications`
--
ALTER TABLE `applications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `application_documents`
--
ALTER TABLE `application_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `application_timeline`
--
ALTER TABLE `application_timeline`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidates`
--
ALTER TABLE `candidates`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `candidate_achievements`
--
ALTER TABLE `candidate_achievements`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidate_documents`
--
ALTER TABLE `candidate_documents`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `candidate_skills`
--
ALTER TABLE `candidate_skills`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `career_goals`
--
ALTER TABLE `career_goals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `certifications`
--
ALTER TABLE `certifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `companies`
--
ALTER TABLE `companies`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `company_reviews`
--
ALTER TABLE `company_reviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `conversations`
--
ALTER TABLE `conversations`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cover_letters`
--
ALTER TABLE `cover_letters`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `education`
--
ALTER TABLE `education`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `grievances`
--
ALTER TABLE `grievances`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `interviews`
--
ALTER TABLE `interviews`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `job_alerts`
--
ALTER TABLE `job_alerts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `messages`
--
ALTER TABLE `messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `profile_views`
--
ALTER TABLE `profile_views`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `projects`
--
ALTER TABLE `projects`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `referrals`
--
ALTER TABLE `referrals`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review_helpful_votes`
--
ALTER TABLE `review_helpful_votes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `saved_searches`
--
ALTER TABLE `saved_searches`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `work_experience`
--
ALTER TABLE `work_experience`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `applications`
--
ALTER TABLE `applications`
  ADD CONSTRAINT `applications_ibfk_1` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `applications_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `application_documents`
--
ALTER TABLE `application_documents`
  ADD CONSTRAINT `application_documents_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `application_timeline`
--
ALTER TABLE `application_timeline`
  ADD CONSTRAINT `application_timeline_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `application_timeline_ibfk_2` FOREIGN KEY (`changed_by_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `candidates`
--
ALTER TABLE `candidates`
  ADD CONSTRAINT `candidates_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_achievements`
--
ALTER TABLE `candidate_achievements`
  ADD CONSTRAINT `candidate_achievements_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `candidate_achievements_ibfk_2` FOREIGN KEY (`achievement_id`) REFERENCES `achievements` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_documents`
--
ALTER TABLE `candidate_documents`
  ADD CONSTRAINT `candidate_documents_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `candidate_skills`
--
ALTER TABLE `candidate_skills`
  ADD CONSTRAINT `candidate_skills_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `career_goals`
--
ALTER TABLE `career_goals`
  ADD CONSTRAINT `career_goals_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `certifications`
--
ALTER TABLE `certifications`
  ADD CONSTRAINT `certifications_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `companies`
--
ALTER TABLE `companies`
  ADD CONSTRAINT `companies_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `company_reviews`
--
ALTER TABLE `company_reviews`
  ADD CONSTRAINT `company_reviews_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `company_reviews_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `conversations`
--
ALTER TABLE `conversations`
  ADD CONSTRAINT `conversations_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_2` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `conversations_ibfk_3` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `cover_letters`
--
ALTER TABLE `cover_letters`
  ADD CONSTRAINT `cover_letters_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `education`
--
ALTER TABLE `education`
  ADD CONSTRAINT `education_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `grievances`
--
ALTER TABLE `grievances`
  ADD CONSTRAINT `grievances_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `interviews`
--
ALTER TABLE `interviews`
  ADD CONSTRAINT `interviews_ibfk_1` FOREIGN KEY (`application_id`) REFERENCES `applications` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `jobs`
--
ALTER TABLE `jobs`
  ADD CONSTRAINT `jobs_ibfk_1` FOREIGN KEY (`employer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `job_alerts`
--
ALTER TABLE `job_alerts`
  ADD CONSTRAINT `job_alerts_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `messages`
--
ALTER TABLE `messages`
  ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`conversation_id`) REFERENCES `conversations` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`sender_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `profile_views`
--
ALTER TABLE `profile_views`
  ADD CONSTRAINT `profile_views_ibfk_1` FOREIGN KEY (`company_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `profile_views_ibfk_2` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `projects`
--
ALTER TABLE `projects`
  ADD CONSTRAINT `projects_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `referrals`
--
ALTER TABLE `referrals`
  ADD CONSTRAINT `referrals_ibfk_1` FOREIGN KEY (`referrer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `referrals_ibfk_2` FOREIGN KEY (`referred_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `review_helpful_votes`
--
ALTER TABLE `review_helpful_votes`
  ADD CONSTRAINT `review_helpful_votes_ibfk_1` FOREIGN KEY (`review_id`) REFERENCES `company_reviews` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `review_helpful_votes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_jobs`
--
ALTER TABLE `saved_jobs`
  ADD CONSTRAINT `saved_jobs_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `saved_jobs_ibfk_2` FOREIGN KEY (`job_id`) REFERENCES `jobs` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `saved_searches`
--
ALTER TABLE `saved_searches`
  ADD CONSTRAINT `saved_searches_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `work_experience`
--
ALTER TABLE `work_experience`
  ADD CONSTRAINT `work_experience_ibfk_1` FOREIGN KEY (`candidate_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
