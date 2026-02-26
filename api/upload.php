<?php
// Secure image upload handler
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Only POST is allowed for uploads.']);
    exit;
}

// Define upload directory relative to this script
$uploadDir = __DIR__ . '/../public/uploads/';

// Ensure directory exists
if (!is_dir($uploadDir)) {
    if (!mkdir($uploadDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create upload directory.']);
        exit;
    }
}

// Check if a file was uploaded
if (!isset($_FILES['image']) || $_FILES['image']['error'] !== UPLOAD_ERR_OK) {
    http_response_code(400);
    echo json_encode(['error' => 'No image uploaded or upload error occurred.']);
    exit;
}

$file = $_FILES['image'];

// Validate file type
$allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$mimeType = finfo_file($finfo, $file['tmp_name']);
finfo_close($finfo);

if (!in_array($mimeType, $allowedTypes)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid file type. Only JPG, PNG, WEBP, and GIF are allowed.']);
    exit;
}

// Validate file size (e.g., max 5MB)
$maxSize = 5 * 1024 * 1024; // 5 MB
if ($file['size'] > $maxSize) {
    http_response_code(400);
    echo json_encode(['error' => 'File is too large. Maximum size is 5MB.']);
    exit;
}

// Generate unique filename to prevent overwriting
$extension = pathinfo($file['name'], PATHINFO_EXTENSION);
if (!$extension) {
    // Fallback based on mime type if extension is missing
    $mimeToExt = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp',
        'image/gif'  => 'gif'
    ];
    $extension = $mimeToExt[$mimeType] ?? 'img';
}

$uniqueName = uniqid() . '_' . time() . '.' . $extension;
$destination = $uploadDir . $uniqueName;

// Move uploaded file
if (move_uploaded_file($file['tmp_name'], $destination)) {
    // Return relative URL for storage in DB
    $relativeUrl = '/public/uploads/' . $uniqueName;
    
    echo json_encode([
        'success' => true,
        'message' => 'Image uploaded successfully.',
        'url' => $relativeUrl
    ]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to move uploaded file.']);
}
?>
