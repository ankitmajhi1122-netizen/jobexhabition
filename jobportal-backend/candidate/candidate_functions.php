<?php
// Function to calculate profile completeness percentage
function updateProfileCompleteness($pdo, $userId) {
    $stmt = $pdo->prepare("SELECT * FROM candidates WHERE user_id = ?");
    $stmt->execute([$userId]);
    $profile = $stmt->fetch();
    
    if (!$profile) return;
    
    $completeness = 0;
    $fields = [
        'full_name' => 10,
        'phone' => 5,
        'city' => 5,
        'current_role' => 10,
        'bio' => 10,
        'skills' => 10,
        'experience_years' => 5,
        'education' => 10,
        'portfolio_url' => 5,
        'linkedin_url' => 5,
        'resume_url' => 15,
        'photo_url' => 10
    ];
    
    foreach ($fields as $field => $weight) {
        if (!empty($profile[$field]) && $profile[$field] !== '0') {
            $completeness += $weight;
        }
    }
    
    // Bonus points for having work experience, education records, skills
    $stmtWork = $pdo->prepare("SELECT COUNT(*) as count FROM work_experience WHERE candidate_id = ?");
    $stmtWork->execute([$userId]);
    if ($stmtWork->fetch()['count'] > 0) {
        $completeness = min(100, $completeness + 5);
    }
    
    $stmtEdu = $pdo->prepare("SELECT COUNT(*) as count FROM education WHERE candidate_id = ?");
    $stmtEdu->execute([$userId]);
    if ($stmtEdu->fetch()['count'] > 0) {
        $completeness = min(100, $completeness + 5);
    }
    
    $stmtSkills = $pdo->prepare("SELECT COUNT(*) as count FROM candidate_skills WHERE candidate_id = ?");
    $stmtSkills->execute([$userId]);
    if ($stmtSkills->fetch()['count'] > 0) {
        $completeness = min(100, $completeness + 5);
    }
    
    // Update completeness
    $stmt = $pdo->prepare("UPDATE candidates SET profile_completeness = ? WHERE user_id = ?");
    $stmt->execute([$completeness, $userId]);
}
?>
