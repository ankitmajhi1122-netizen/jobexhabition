<?php

// Database Connection
function getPDO(): PDO {
    $host = 'localhost';
    $db   = 'u529002218_hibition';
    $user = 'u529002218_hibition';
    $pass = 'Rakesh@29032003';
    $charset = 'utf8mb4';

    $dsn = "mysql:host=$host;dbname=$db;charset=$charset";
    $options = [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ];
    return new PDO($dsn, $user, $pass, $options);
}
?>
