<?php
// Generate a secure random nonce
$nonce = base64_encode(random_bytes(16));
$nonce = preg_replace('/[^A-Za-z0-9\-_]/', '', $nonce);

// Output the nonce for SSI
echo htmlspecialchars($nonce, ENT_QUOTES, 'UTF-8');

// Store the nonce for .htaccess
$_SERVER['CSP_NONCE'] = $nonce;
?>