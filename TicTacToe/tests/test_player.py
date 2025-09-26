import unittest
from player import Player


class TestPlayer(unittest.TestCase):
    def test_player_initialization(self):
        player = Player("Alice", "X")
        self.assertEqual(player.name, "Alice")
        self.assertEqual(player.symbol, "X")
