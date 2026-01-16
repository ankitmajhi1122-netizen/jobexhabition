USE u529002218_hibition;

INSERT INTO users (email, password_hash, role, is_verified, status, created_at) 
VALUES ('admin@gmail.com', '$2y$10$K6IdQumBV7ur0rxEJFiRH.S3.ZvLh5lwn3gTtQIfxBMgJN8j74hn.', 'admin', 1, 'active', NOW());
