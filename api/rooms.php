<?php
require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Get all rooms or a specific room
        $id = $_GET['id'] ?? null;
        
        try {
            if ($id) {
                $stmt = $pdo->prepare("SELECT * FROM rooms WHERE id = :id");
                $stmt->execute(['id' => $id]);
                $room = $stmt->fetch(PDO::FETCH_ASSOC);
                
                if ($room) {
                    echo json_encode($room);
                } else {
                    http_response_code(404);
                    echo json_encode(['error' => 'Room not found']);
                }
            } else {
                $stmt = $pdo->query("SELECT * FROM rooms ORDER BY created_at DESC");
                $rooms = $stmt->fetchAll(PDO::FETCH_ASSOC);
                echo json_encode($rooms);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Database error', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Create a new room
        $data = json_decode(file_get_contents("php://input"), true);
        
        $name = $data['name'] ?? '';
        $type = $data['type'] ?? '';
        $description = $data['description'] ?? '';
        $price = $data['price_per_night'] ?? 0;
        $max_occupancy = $data['max_occupancy'] ?? 2;
        $amenities = isset($data['amenities']) ? json_encode($data['amenities']) : null;
        $images = isset($data['images']) ? json_encode($data['images']) : null;
        $is_available = $data['is_available'] ?? true;

        if (!$name || !$type || !$price) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required fields (name, type, price)']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO rooms (name, type, description, price_per_night, max_occupancy, amenities, images, is_available) VALUES (:name, :type, :description, :price, :max_occupancy, :amenities, :images, :is_available)");
            $stmt->execute([
                'name' => $name,
                'type' => $type,
                'description' => $description,
                'price' => $price,
                'max_occupancy' => $max_occupancy,
                'amenities' => $amenities,
                'images' => $images,
                'is_available' => $is_available ? 1 : 0
            ]);
            
            echo json_encode([
                'success' => true, 
                'message' => 'Room created successfully',
                'id' => $pdo->lastInsertId()
            ]);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to create room', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update an existing room
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing room ID for update']);
            exit;
        }

        try {
            $updateFields = [];
            $params = ['id' => $data['id']];
            
            $allowedFields = ['name', 'type', 'description', 'price_per_night', 'max_occupancy', 'is_available'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "$field = :$field";
                    $params[$field] = $data[$field];
                }
            }

            // Handle JSON fields specially
            if (isset($data['amenities'])) {
                $updateFields[] = "amenities = :amenities";
                $params['amenities'] = json_encode($data['amenities']);
            }
            if (isset($data['images'])) {
                $updateFields[] = "images = :images";
                $params['images'] = json_encode($data['images']);
            }
            
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields provided to update']);
                exit;
            }

            $query = "UPDATE rooms SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Room updated successfully']);
            } else {
                echo json_encode(['success' => true, 'message' => 'No changes made or room not found', 'rowCount' => 0]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update room', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete a room
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing room ID']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM rooms WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Room deleted successfully']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Room not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete room', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
