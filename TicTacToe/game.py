from board import Board
from player import Player


class Game:
    """Records players moves"""

    def __init__(self):
        self.board = Board()
        self.players = [Player("Player 1", "X"), Player("Player 2", "O")]
        self.current_player_index = 0

    def switch_player(self):
        self.current_player_index = 1 - self.current_player_index

    def play(self):
        while True:
            self.board.display()
            player = self.players[self.current_player_index]
            move = player.get_move()

            if not self.board.update_cell(move, player.symbol):
                print("Cell already taken. Try again.")
                continue

            if self.board.check_winner(player.symbol):
                self.board.display()
                print(f"{player.name} wins!")
                break

            if self.board.is_full():
                self.board.display()
                print("It's a draw!")
                break

            self.switch_player()
