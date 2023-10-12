<?php

class TicTacToeController
{
    private TicTacToeValidator $validator;

    public function __construct(TicTacToeValidator $validator)
    {
        $this->validator = $validator;
    }

    public function handleRequest($requestData): false|string
    {
        $data = ["success" => true, "data" => [], "error_message" => ""];
        try {
            if ($requestData === null) {
                throw new \InvalidArgumentException('Grid data is missing.');
            }
            $data['data'] = $this->validator->validateGrids($requestData);
        } catch (\Exception $e) {
            error_log($e->getMessage());
            $data['success'] = false;
            $data['error_message'] = $e->getMessage();
        }
        return json_encode($data);
    }
}
