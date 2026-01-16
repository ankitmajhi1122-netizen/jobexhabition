<?php
// Health Check Script for Job Exhibition Backend

require_once __DIR__ . '/config/database.php';

header('Content-Type: application/json');

$response = [
    'timestamp' => date('Y-m-d H:i:s'),
    'php_version' => phpversion(),
    'database' => 'Checking...',
    'status' => 'Unknown'
];

try {
    $pdo = getPDO();
    $stmt = $pdo->query("SELECT 1");
    if ($stmt) {
        $response['database'] = 'Connected Successfully';
        $response['status'] = 'OK';
    } else {
        $response['database'] = 'Connection Failed (Query Error)';
        $response['status'] = 'Error';
    }
} catch (Exception $e) {
    $response['database'] = 'Connection Failed: ' . $e->getMessage();
    $response['status'] = 'Error';
}

echo json_encode($response, JSON_PRETTY_PRINT);
?>
