<?php
/**
 * Reservations API Endpoint
 * Handles fetching, adding, and deleting reservations.
 */

require_once 'db.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Retrieve all reservations
        try {
            $stmt = $pdo->query("SELECT * FROM reservations ORDER BY checkIn ASC");
            $reservations = $stmt->fetchAll();
            echo json_encode($reservations);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to retrieve reservations', 'message' => $e->getMessage()]);
        }
        break;

    case 'POST':
        // Add a new reservation
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id']) || !isset($data['guest']) || !isset($data['room']) || !isset($data['checkIn']) || !isset($data['checkOut'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing required reservation fields']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("INSERT INTO reservations (id, guestName, roomType, checkIn, checkOut, status, paymentStatus, amount, source) VALUES (:id, :guestName, :roomType, :checkIn, :checkOut, :status, :paymentStatus, :amount, :source)");
            
            $stmt->execute([
                'id' => $data['id'],
                'guestName' => $data['guest'],
                'roomType' => $data['room'],
                'checkIn' => $data['checkIn'],
                'checkOut' => $data['checkOut'],
                'status' => $data['status'] ?? 'PENDING',
                'paymentStatus' => $data['payment'] ?? 'PENDING',
                'amount' => $data['amount'] ?? 0,
                'source' => $data['source'] ?? 'DIRECT'
            ]);
            
            http_response_code(201);
            echo json_encode(['success' => true, 'message' => 'Reservation added successfully']);
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to add reservation', 'message' => $e->getMessage()]);
        }
        break;

    case 'PUT':
        // Update an existing reservation
        $data = json_decode(file_get_contents("php://input"), true);
        
        if (!isset($data['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing reservation ID for update']);
            exit;
        }

        try {
            // Build dynamic update query based on provided fields
            $updateFields = [];
            $params = ['id' => $data['id']];
            
            $allowedFields = ['guest', 'room', 'checkIn', 'checkOut', 'status', 'payment', 'amount', 'source'];
            foreach ($allowedFields as $field) {
                if (isset($data[$field])) {
                    // Map frontend fields to DB columns
                    $dbField = $field;
                    if ($field === 'guest') $dbField = 'guestName';
                    if ($field === 'room') $dbField = 'roomType';
                    if ($field === 'payment') $dbField = 'paymentStatus';
                    
                    $updateFields[] = "$dbField = :$field";
                    $params[$field] = $data[$field];
                }
            }
            
            if (empty($updateFields)) {
                http_response_code(400);
                echo json_encode(['error' => 'No fields provided to update']);
                exit;
            }

            $query = "UPDATE reservations SET " . implode(', ', $updateFields) . " WHERE id = :id";
            $stmt = $pdo->prepare($query);
            $stmt->execute($params);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Reservation updated successfully']);
            } else {
                echo json_encode(['success' => true, 'message' => 'No changes made or reservation not found', 'rowCount' => 0]);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to update reservation', 'message' => $e->getMessage()]);
        }
        break;

    case 'DELETE':
        // Delete a reservation
        $id = $_GET['id'] ?? null;
        
        if (!$id) {
            http_response_code(400);
            echo json_encode(['error' => 'Missing reservation ID for deletion']);
            exit;
        }

        try {
            $stmt = $pdo->prepare("DELETE FROM reservations WHERE id = :id");
            $stmt->execute(['id' => $id]);
            
            if ($stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Reservation deleted']);
            } else {
                http_response_code(404);
                echo json_encode(['error' => 'Reservation not found']);
            }
        } catch (PDOException $e) {
            http_response_code(500);
            echo json_encode(['error' => 'Failed to delete reservation', 'message' => $e->getMessage()]);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method not allowed']);
        break;
}
?>
