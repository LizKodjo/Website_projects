import unittest
from game import Game
from player import Player


class TestGame(unittest.TestCase):
    def setUp(self):
        self.player1 = Player("Alice", "X")
        self.player2 = Player("Bob", "O")
        self.game = Game(self.player1, self.player2)

    def test_initial_player(self):
        self.assertEqual(self.game.get_current_player().name, "Alice")

    def test_switch_player(self):
        self.game.switch_player()
        self.assertEqual(self.game.get_current_player().name, "Bob")

    def test_make_valid_move(self):
        result = self.game.make_move(1)
        self.assertTrue(result)
        self.assertEqual(self.game.board.cells[0][0], "X")

    def test_make_invalid_move(self):
        self.game.make_move(1)
        result = self.game.make_move(1)
        self.assertFalse(result)

    def test_check_game_over_win(self):
        self.game.board.cells[0] = ["X", "X", "X"]
        result = self.game.check_game_over()
        self.assertEqual(result, "Alice wins!")

    def test_check_game_over_draw(self):
        self.game.board.cells = [["X", "O", "X"],
                                 ["O", "X", "O"], ["O", "X", "O"]]
        result = self.game.check_game_over()
        self.assertEqual(result, "It's a draw!")

    def test_check_game_over_continue(self):
        result = self.game.check_game_over()
        self.assertIsNone(result)


if __name__ == '__main__':
    unittest.main()
