<?php
require_once __DIR__ . '/../middleware/auth_middleware.php';
require_once __DIR__ . '/../config/database.php';
require_once __DIR__ . '/../utils/functions.php';

$user = authenticate();

if ($user['role'] !== 'candidate') {
    sendError('Access denied. Candidates only.', 403);
}

$pdo = getPDO();

try {
    // Get application statistics
    $sqlApps = "SELECT 
        COUNT(*) as total_applications,
        SUM(CASE WHEN status = 'applied' THEN 1 ELSE 0 END) as applied,
        SUM(CASE WHEN status = 'viewed' THEN 1 ELSE 0 END) as viewed,
        SUM(CASE WHEN status = 'shortlisted' THEN 1 ELSE 0 END) as shortlisted,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected,
        SUM(CASE WHEN status = 'hired' THEN 1 ELSE 0 END) as hired
        FROM applications WHERE candidate_id = ?";
    
    $stmt = $pdo->prepare($sqlApps);
    $stmt->execute([$user['id']]);
    $appStats = $stmt->fetch();
    
    // Get monthly application trend (last 6 months)
    $sqlTrend = "SELECT 
        DATE_FORMAT(applied_at, '%Y-%m') as month,
        COUNT(*) as count
        FROM applications 
        WHERE candidate_id = ? AND applied_at >= DATE_SUB(NOW(), INTERVAL 6 MONTH)
        GROUP BY DATE_FORMAT(applied_at, '%Y-%m')
        ORDER BY month ASC";
    
    $stmt = $pdo->prepare($sqlTrend);
    $stmt->execute([$user['id']]);
    $monthlyTrend = $stmt->fetchAll();
    
    // Get profile views trend
    $sqlViews = "SELECT 
        COUNT(*) as total_views,
        COUNT(DISTINCT company_id) as unique_companies,
        COUNT(DISTINCT DATE(viewed_at)) as days_viewed
        FROM profile_views WHERE candidate_id = ?";
    
    $stmt = $pdo->prepare($sqlViews);
    $stmt->execute([$user['id']]);
    $viewStats = $stmt->fetch();
    
    // Get response rate
    $totalApps = (int)$appStats['total_applications'];
    $responseRate = $totalApps > 0 ? round((($appStats['viewed'] + $appStats['shortlisted'] + $appStats['rejected'] + $appStats['hired']) / $totalApps) * 100, 1) : 0;
    
    // Get success rate (shortlisted + hired / total)
    $successRate = $totalApps > 0 ? round((($appStats['shortlisted'] + $appStats['hired']) / $totalApps) * 100, 1) : 0;
    
    // Get top applied job types
    $sqlJobTypes = "SELECT j.job_type, COUNT(*) as count
        FROM applications a
        JOIN jobs j ON a.job_id = j.id
        WHERE a.candidate_id = ?
        GROUP BY j.job_type
        ORDER BY count DESC
        LIMIT 5";
    
    $stmt = $pdo->prepare($sqlJobTypes);
    $stmt->execute([$user['id']]);
    $topJobTypes = $stmt->fetchAll();
    
    // Get profile completeness
    $sqlProfile = "SELECT profile_completeness FROM candidates WHERE user_id = ?";
    $stmt = $pdo->prepare($sqlProfile);
    $stmt->execute([$user['id']]);
    $profileData = $stmt->fetch();
    
    sendSuccess('Analytics data retrieved', [
        'applications' => [
            'total' => (int)$appStats['total_applications'],
            'applied' => (int)$appStats['applied'],
            'viewed' => (int)$appStats['viewed'],
            'shortlisted' => (int)$appStats['shortlisted'],
            'rejected' => (int)$appStats['rejected'],
            'hired' => (int)$appStats['hired'],
            'response_rate' => $responseRate,
            'success_rate' => $successRate
        ],
        'monthly_trend' => $monthlyTrend,
        'profile_views' => [
            'total' => (int)$viewStats['total_views'],
            'unique_companies' => (int)$viewStats['unique_companies'],
            'days_viewed' => (int)$viewStats['days_viewed']
        ],
        'top_job_types' => $topJobTypes,
        'profile_completeness' => (int)($profileData['profile_completeness'] ?? 0)
    ]);
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
