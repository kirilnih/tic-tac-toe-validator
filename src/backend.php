<?php

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $requestData = json_decode(file_get_contents('php://input'), true);
    switch ($requestData['route']) {
        case 'validate':
            include 'TicTacToeController.php';
            include 'TicTacToeValidator.php';

            $validator = new TicTacToeValidator();
            $controller = new TicTacToeController($validator);
            echo $controller->handleRequest($requestData['grids']);
            break;
        default:
            echo json_encode(["success" => false, "data" => [], "error_message" => "Invalid route"]);
            break;
    }
} else {
    echo json_encode(["success" => false, "data" => [], "error_message" => "Invalid request method"]);
}