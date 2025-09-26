class Board:
    """Initialise the board with numbered cells for user reference"""

    def __init__(self):
        self.cells = [['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9']]

    def display(self):
        print("\n")
        for row in self.cells:
            print(" | ".join(row))
            print("-" * 9)
        print("\n")

    def update_cell(self, move, symbol):
        row, col = divmod(move - 1, 3)
        if self.cells[row][col] in ['X', 'O']:
            return False
        self.cells[row][col] = symbol
        return True

    def is_full(self):
        return all(cell in ['X', 'O'] for row in self.cells for cell in row)

    def check_winner(self, symbol):
        for i in range(3):
            if all(self.cells[i][j] == symbol for j in range(3)):
                return True
            if all(self.cells[j][i] == symbol for j in range(3)):
                return True
        if all(self.cells[i][i] == symbol for i in range(3)):
            return True
        if all(self.cells[i][2 - i] == symbol for i in range(3)):
            return True
        return False
