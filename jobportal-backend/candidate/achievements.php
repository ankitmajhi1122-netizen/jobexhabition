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
    // Fetch all achievements with earned status
    $sql = "SELECT 
                a.id, a.name, a.description, a.icon, a.category, a.points,
                ca.earned_at,
                CASE WHEN ca.id IS NOT NULL THEN 1 ELSE 0 END as is_earned
            FROM achievements a
            LEFT JOIN candidate_achievements ca ON a.id = ca.achievement_id AND ca.candidate_id = ?
            WHERE a.is_active = 1
            ORDER BY ca.earned_at DESC, a.category, a.points ASC";
    
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$user['id']]);
    $achievements = $stmt->fetchAll();
    
    // Calculate total points
    $totalPoints = 0;
    $earnedCount = 0;
    $totalCount = count($achievements);
    
    foreach ($achievements as $achievement) {
        if ($achievement['is_earned']) {
            $totalPoints += $achievement['points'];
            $earnedCount++;
        }
    }
    
    // Get recent achievements
    $recentSql = "SELECT a.*, ca.earned_at
                  FROM candidate_achievements ca
                  JOIN achievements a ON ca.achievement_id = a.id
                  WHERE ca.candidate_id = ?
                  ORDER BY ca.earned_at DESC
                  LIMIT 5";
    
    $stmtRecent = $pdo->prepare($recentSql);
    $stmtRecent->execute([$user['id']]);
    $recentAchievements = $stmtRecent->fetchAll();
    
    sendSuccess('Achievements retrieved', [
        'achievements' => $achievements,
        'recent_achievements' => $recentAchievements,
        'stats' => [
            'total_points' => $totalPoints,
            'earned_count' => $earnedCount,
            'total_count' => $totalCount,
            'completion_percentage' => $totalCount > 0 ? round(($earnedCount / $totalCount) * 100) : 0
        ]
    ]);
    
} catch (Exception $e) {
    sendError('Error: ' . $e->getMessage(), 500);
}
?>
