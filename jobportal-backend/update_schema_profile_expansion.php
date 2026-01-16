<?php
require_once __DIR__ . '/config/database.php';

try {
    $pdo = getPDO();
    echo "Connected to database.\n";

    $columns = [
        "ADD COLUMN current_role VARCHAR(255) AFTER full_name",
        "ADD COLUMN bio TEXT AFTER current_role",
        "ADD COLUMN portfolio_url VARCHAR(255) AFTER resume_url",
        "ADD COLUMN linkedin_url VARCHAR(255) AFTER portfolio_url",
        "ADD COLUMN expected_salary VARCHAR(100) AFTER linkedin_url"
    ];

    foreach ($columns as $col) {
        try {
            $sql = "ALTER TABLE candidates $col";
            $pdo->exec($sql);
            echo "Executed: $sql\n";
        } catch (PDOException $e) {
            // Ignore if column likely exists (error code 42S21 mostly, but generic catch here is fine for this utility)
            echo "Skipped (maybe exists): $col - " . $e->getMessage() . "\n";
        }
    }

    echo "Schema update completed.\n";

} catch (Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
?>
