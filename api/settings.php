<?php
/**
 * Settings API Endpoint
 * Handles fetching and updating CMS settings.
 */

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve all settings
        try {
            $stmt = $pdo->query("SELECT setting_key, setting_value FROM settings");
            $settings = $stmt->fetchAll(PDO::FETCH_KEY_PAIR); // Returns associative array [key => value]
            
            // If the database is completely empty (not seeded yet), return some defaults
            if (empty($settings)) {
                $settings = [
                    'heroTitle' => 'A Sanctuary by the Shore',
                    'heroSubtitle' => 'Experience unparalleled tranquility where the ocean meets luxury at Ganesh Residency.',
                    'contactAddress' => "123 Coastal Highway, Beach Road\\nPondicherry 605001\\nIndia",
                    'contactPhone' => '+91 98765 43210',
                    'contactEmail' => 'reservations@ganeshresidency.com',
                    'aboutText' => 'Perfectly situated to offer tranquility while keeping the vibrant culture of Pondicherry within easy reach.'
                ];
            }
            
            echo json_encode($settings);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to retrieve settings', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Update a specific setting
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['key']) || !isset($data['value'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing key or value in request body']);
            exit;
        }

        $key = $data['key'];
        $value = $data['value'];

        try {
            // Using REPLACE INTO or INSERT ... ON DUPLICATE KEY UPDATE
            $stmt = $pdo->prepare("INSERT INTO settings (setting_key, setting_value) VALUES (:key, :value) AS new ON DUPLICATE KEY UPDATE setting_value = new.setting_value");
            $stmt->execute(['key' => $key, 'value' => $value]);
            
            echo json_encode(['success' => true, 'message' => 'Setting updated successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update setting', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
