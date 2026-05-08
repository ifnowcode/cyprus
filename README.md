# ⚫⚪ Cyprus

[https://ifnowcode.github.io/cyprus](https://ifnowcode.github.io/cyprus)

**Cyprus** is a classic two-player strategy game played on an 8×8 board.
Players take turns placing discs to capture and flip their opponent’s pieces.
The goal is simple: **finish the game with more discs of your color on the board**.

This implementation focuses on clarity, fast interaction, and a clean game engine suitable for experimentation, AI play, or casual matches.

---

## 🎮 Features

  * Interactive 8×8 Cyprus board

  * Legal move highlighting

  * Automatic flipping of captured discs

  * Player vs Player or Player vs AI

  * Undo and restart support

  * Clean, deterministic rules engine

  * Optional move hints or debug overlays

---

## 🧠 How It Works

  * Players alternate placing discs on valid squares

  * A move is valid only if it captures at least one opponent disc

  * Captures occur in any straight line:

      * Horizontal

      * Vertical

      * Diagonal

  * All captured discs flip to the current player’s color

  * The game ends when:

      * Neither player has a legal move

      * The board is full

---

## 🤖 AI

  * Simple heuristic AI included

  * Evaluates legal moves and chooses the strongest available option

  * Modular design allows plugging in stronger AIs later (minimax, mobility heuristics, corner weighting)

---

## 🛠️ Technical Notes

  * Board state stored in a clean 2D array

  * Move validation and flipping use directional scanning

  * Rendering uses HTML5 canvas for smooth updates

  * Input and game logic are fully separated

  * Deterministic turn flow with optional AI scheduling

---

## 🚀 Future Enhancements

  * Stronger AI (minimax with pruning)

  * Move animations

  * Highlighting stable discs

  * Online multiplayer

  * Alternate board sizes