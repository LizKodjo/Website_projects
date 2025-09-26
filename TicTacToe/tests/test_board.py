import unittest
from board import Board


class TestBoard(unittest.TestCase):
    def setUp(self):
        self.board = Board()

    def test_initial_board_state(self):
        expected = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]
        self.assertEqual(self.board.cells, expected)

    def test_update_cells_valid(self):
        result = self.board.update_cell(1, 'X')
        self.assertTrue(result)
        self.assertEqual(self.board.cells[0][0], 'X')

    def test_update_cell_invalid(self):
        self.board.update_cell(1, 'X')
        result = self.board.update_cell(1, 'O')
        self.assertFalse(result)
        self.assertEqual(self.board.cells[0][0], 'X')

    def test_check_winner_row(self):
        self.board.cells[0] = ['X', 'X', 'X']
        self.assertTrue(self.board.check_winner('X'))

    def test_check_winner_column(self):
        for i in range(3):
            self.board.cells[i][0] = 'O'
        self.assertTrue(self.board.check_winner('O'))

    def test_check_winner_diagonal(self):
        for i in range(3):
            self.board.cells[i][i] = 'X'
        self.assertTrue(self.board.check_winner('X'))

    def test_check_winner_anti_diagonal(self):
        for i in range(3):
            self.board.cells[i][2 - i] = 'O'
        self.assertTrue(self.board.check_winner('O'))

    def test_is_full_true(self):
        self.board.cells = [['X', 'O', 'X'], ['O', 'X', 'O'], ['O', 'X', 'O']]
        self.assertTrue(self.board.is_full())

    def test_is_full_false(self):
        self.board.cells = [['X', 'O', '3'], ['O', 'X', 'O'], ['O', 'X', 'O']]
        self.assertFalse(self.board.is_full())


if __name__ == "__main__":
    unittest.main()
