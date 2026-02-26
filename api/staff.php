<?php
/**
 * Staff API Endpoint
 * Handles fetching, adding, and deleting staff members.
 */

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve all staff members
        try {
            $stmt = $pdo->query("SELECT * FROM staff ORDER BY created_at DESC");
            $staff = $stmt->fetchAll();
            echo json_encode($staff);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to retrieve staff', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Add a new staff member
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['name']) || !isset($data['role']) || !isset($data['email'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required staff fields']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO staff (id, name, role, status, email, phone) VALUES (:id, :name, :role, :status, :email, :phone)");
            
            $stmt->execute([
                'id' => $data['id'], // Using ID from frontend to maintain consistency with existing mock logic
                'name' => $data['name'],
                'role' => $data['role'],
                'status' => $data['status'] ?? 'ACTIVE',
                'email' => $data['email'],
                'phone' => $data['phone'] ?? ''
            ]);
            
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Staff member added successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add staff member', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update an existing staff member
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing staff ID for update']);
            exit;
        }

        try {
            // Build dynamic update query based on provided fields
            $updateFields = [];
            $params = ['id' => $data['id']];
            
            $allowedFields = ['name', 'role', 'status', 'email', 'phone'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    $updateFields[] = "$field = :$field";
                    $params[$field] = $data[$field];
                }
            }
            
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields provided to update']);
                exit;
            }

            $query = "UPDATE staff SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Staff member updated successfully']);
            } else {
                // It might not be found, or the data was identical
                echo json_encode(['success' => true, 'message' => 'No changes made or staff member not found', 'rowCount' => 0]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update staff member', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete a staff member
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing staff ID for deletion']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM staff WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Staff member deleted']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Staff member not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete staff member', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
