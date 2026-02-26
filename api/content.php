<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve content blocks
        $section = $_GET['section'] ?? null;
        $key = $_GET['key'] ?? null;
        
        try {
            if ($section && $key) {
                // Get a specific block
                $stmt = $pdo->prepare("SELECT * FROM page_content WHERE section = :section AND block_key = :key");
                $stmt->execute(['section' => $section, 'key' => $key]);
                $content = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($content) {
                    echo json_encode($content);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Content not found']);
                }
            } else if ($section) {
                // Get all blocks for a section
                $stmt = $pdo->prepare("SELECT * FROM page_content WHERE section = :section ORDER BY order_index ASC");
                $stmt->execute(['section' => $section]);
                $content = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($content);
            } else {
                // Get all content
                $stmt = $pdo->query("SELECT * FROM page_content ORDER BY section ASC, order_index ASC");
                $content = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($content);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
    case 'PUT':
        // Create or update a content block
        $data = json_decode(file_get_contents("php://input"), true);
        
        $section = $data['section'] ?? '';
        $block_key = $data['block_key'] ?? '';
        
        if (!$section || !$block_key) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (section, block_key)']);
            exit;
        }

        $content_text = $data['content_text'] ?? null;
        $image_url = $data['image_url'] ?? null;
        $is_active = $data['is_active'] ?? true;
        $order_index = $data['order_index'] ?? 0;

        try {
            // Use INSERT ... ON DUPLICATE KEY UPDATE to handle both creation and updates
            $sql = "INSERT INTO page_content (section, block_key, content_text, image_url, is_active, order_index) 
                    VALUES (:section, :block_key, :content_text, :image_url, :is_active, :order_index)
                    ON DUPLICATE KEY UPDATE 
                    content_text = VALUES(content_text),
                    image_url = VALUES(image_url),
                    is_active = VALUES(is_active),
                    order_index = VALUES(order_index)";
                    
            $stmt = $pdo->prepare($sql);
            $stmt->execute([
                'section' => $section,
                'block_key' => $block_key,
                'content_text' => $content_text,
                'image_url' => $image_url,
                'is_active' => $is_active ? 1 : 0,
                'order_index' => $order_index
            ]);
            
            echo json_encode([
                'success' => true, 
                'message' => 'Content saved successfully'
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to save content', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete a content block
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing content ID']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM page_content WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Content deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Content not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete content', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
