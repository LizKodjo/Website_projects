from board import Board
from player import Player


class Game:
    """Initialise the board and players"""

    def __init__(self, player1=None, player2=None):
        self.board = Board()
        self.players = [
            player1 if player1 else Player("Player 1", "X"),
            player2 if player2 else Player("Player 2", "O")
        ]
        self.current_player_index = 0

    def play(self):
        while True:
            self.board.display()
            player = self.get_current_player()

            while True:
                move = player.get_move()
                if 1 <= move <= 9 and self.make_move(move):
                    break
                print("Invalid move. Try again.")

            result = self.check_game_over()
            if result:
                self.board.display()
                print(result)
                break

            self.switch_player()

    def switch_player(self):
        self.current_player_index = 1 - self.current_player_index

    def get_current_player(self):
        return self.players[self.current_player_index]

    def make_move(self, move):
        player = self.get_current_player()
        if not self.board.update_cell(move, player.symbol):
            return False
        return True

    def check_game_over(self):
        player = self.get_current_player()
        if self.board.check_winner(player.symbol):
            return f"{player.name} wins!"
        if self.board.is_full():
            return "It's a draw!"
        return None
