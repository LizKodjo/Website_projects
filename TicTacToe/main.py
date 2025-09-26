from game import Game


def main():
    """Loop to allow replaying the game."""
    while True:
        game = Game()
        game.play()

        replay = input("Would you like to play again? (y/n): ").strip().lower()
        if replay != 'y':
            print("Thanks for playing Tic Tac Toe!")
            break


if __name__ == "__main__":
    main()
