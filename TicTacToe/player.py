class Player:
    """Player's move"""

    def __init__(self, name, symbol):
        self.name = name
        self.symbol = symbol

    def get_move(self):
        while True:
            move = input(
                f"{self.name} ({self.symbol}), choose a cell (1 - 9): ")
            if move.isdigit() and 1 <= int(move) <= 9:
                return int(move)
            print("Invalid input. Try again")
