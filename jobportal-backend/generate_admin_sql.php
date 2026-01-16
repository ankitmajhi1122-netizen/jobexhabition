<?php
// Upload this file to your server to generate the SQL query with the correct password hash.
$password = 'Admin@2003';
$hash = password_hash($password, PASSWORD_BCRYPT);

echo "<h3>SQL Query to Create Admin</h3>";
echo "<p>Copy and run this in your Database SQL tab:</p>";

echo "<textarea rows='5' cols='100'>";
echo "INSERT INTO users (email, password_hash, role, is_verified, status, created_at) ";
echo "VALUES ('admin@gmail.com', '$hash', 'admin', 1, 'active', NOW());";
echo "</textarea>";
?>
