<?php

class TicTacToeValidator
{
    const POSITIVE = 'Yes';
    const NEGATIVE = 'No';
    const CHAR_X = 'X';
    const CHAR_O = 'O';
    const CHAR_DOT = '.';
    public function validateGrids($grids): array
    {
        $results = [];

        foreach ($grids as $grid) {
            $results[] = $this->isValidTicTacToe($grid);
        }

        return $results;
    }

    private function isValidTicTacToe($grid): string
    {
        // Validate input characters
        if (!$this->validateGridCharacters($grid)) {
            return self::NEGATIVE;
        }

        $xCount = $oCount = 0;

        // Count X and O occurrences
        foreach ($grid as $row) {
            $xCount += array_count_values($row)[self::CHAR_X] ?? 0;
            $oCount += array_count_values($row)[self::CHAR_O] ?? 0;
        }

        // Check for invalid counts
        if ($oCount > $xCount || ($xCount - $oCount) > 1) {
            return self::NEGATIVE;
        }

        // Check for winners
        $winnerX = $this->checkRows($grid, self::CHAR_X) || $this->checkCols($grid, self::CHAR_X) || $this->checkDiagonals($grid, self::CHAR_X);
        $winnerO = $this->checkRows($grid, self::CHAR_O) || $this->checkCols($grid, self::CHAR_O) || $this->checkDiagonals($grid, self::CHAR_O);

        // Check for multiple winners
        if ($winnerX && $winnerO) {
            return self::NEGATIVE;
        }

        // Check for valid X count in case of X winner
        if ($winnerX && ($xCount - $oCount) != 1) {
            return self::NEGATIVE;
        }

        // Check for valid O count in case of O winner
        if ($winnerO && ($xCount - $oCount) != 0) {
            return self::NEGATIVE;
        }

        return self::POSITIVE;
    }

    /**
     * @param $grid
     * @param $winner
     * @return bool
     */
    private function checkRows($grid, $winner): bool
    {
        foreach ($grid as $row) {
            if (count(array_keys($row, $winner)) === 3) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param $grid
     * @param $winner
     * @return bool
     */
    private function checkCols($grid, $winner): bool
    {
        for ($i = 0; $i < 3; $i++) {
            $column = [$grid[0][$i], $grid[1][$i], $grid[2][$i]];
            if (count(array_keys($column, $winner)) === 3) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param $grid
     * @param $winner
     * @return bool
     */
    private function checkDiagonals($grid, $winner): bool
    {
        $leftToRightDiagonal = [$grid[0][0], $grid[1][1], $grid[2][2]];
        $rightToLeftDiagonal = [$grid[0][2], $grid[1][1], $grid[2][0]];

        return count(array_keys($leftToRightDiagonal, $winner)) === 3
            || count(array_keys($rightToLeftDiagonal, $winner)) === 3;
    }

    /**
     * @param $grid
     * @return bool
     */
    private function validateGridCharacters($grid): bool
    {
        foreach ($grid as $row) {
            foreach ($row as $char) {
                if (!in_array($char, [self::CHAR_X, self::CHAR_O, self::CHAR_DOT])) {
                    return false;
                }
            }
        }
        return true;
    }

}
