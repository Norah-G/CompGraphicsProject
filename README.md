# **Pac-Man Reimagined** 🎮🍒

Dive into the **nostalgia-filled labyrinth** with a thrilling twist! In this game, you'll guide Pac-Man through a maze of challenges, dodge crafty ghosts, and gobble up pellets like your life depends on it (because it does). 🎩

## **Overview**

Welcome to **Pac-Man Reimagined**, a fun and interactive web-based game where you navigate Pac-Man through a dynamic maze, avoiding the relentless ghosts that only live for the thrill of catching you. The game combines nostalgia with modern programming, offering players hours of fun and intense gameplay across various difficulty levels.

- **Simple Controls:** Navigate with your arrow keys and outsmart those cheeky ghosts.
- **Dynamic Gameplay:** Choose between Easy, Medium, and Hard difficulty levels for a more challenging experience.
- **Background Music:** Let the nostalgic tunes take you back to the golden era of arcade gaming.

## **Features**

### 🟡 **Classic Pac-Man Vibes**
- Navigate the maze, collect pellets, and avoid the infamous ghosts.
- A visually pleasing game board with retro-inspired colors and animations.

### 👻 **Challenging Ghosts**
- Each difficulty level increases the number and speed of ghosts.
- Ghosts adapt their paths to chase you with cunning strategies.

### 🎵 **Background Music**
- A groovy, adrenaline-pumping background score (thanks to the smooth loops from `Music.js`) that enhances your gaming vibe. Don’t like the ghosts? Dance your fears away.

### 🎮 **Levels of Difficulty**
- **Easy:** 1 ghost, perfect for beginners (or your grandma).
- **Medium:** 2 ghosts, a solid challenge.
- **Hard:** 3 speedy ghosts that will haunt your dreams.

### 🎯 **Responsive UI**
- Smooth gameplay on any modern browser.
- Intuitive controls and dynamic visuals to keep you engaged.

---

## **Game Preview**

### Gameplay Screenshots
#### Main Gameplay:
![Game in action](![Screenshot 2024-12-06 130943](https://github.com/user-attachments/assets/53792b7d-bbd7-4c64-98bc-75281597a08a)
)

#### Game Over (Oops!):
![Game Over](![Screenshot 2024-12-06 131225](https://github.com/user-attachments/assets/437784cb-0341-41e9-a6dd-80fac5b54131)
)

#### Difficulty Selector:
![Difficulty Selection](![Screenshot 2024-12-06 131243](https://github.com/user-attachments/assets/c0e44c57-6870-48e9-9675-564bc7d7e4f5)
)

---

## **How to Play**

1. **Start the Game:**
   - Select your difficulty level from the dropdown.
   - Hit the **Start Game** button.
   - Move Pac-Man using the **arrow keys**.
   
2. **Objective:**
   - Collect all pellets while avoiding ghosts.
   - Each pellet boosts your score. 🎯

3. **Ghost Encounter:**
   - A ghost touches you = instant *Game Over*!
   - Click **Try Again** to redeem your dignity. 😎

4. **Victory:**
   - Clear all pellets on the board for a glorious win. 

---

## **Installation**

Follow these steps to set up the game locally:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Norah-G/CompGraphicsProject.git
   cd CompGraphicsProject
   ```

2. **Serve the Game**
   Open the `index.html` file in your browser. That’s it! No complex setups. 🍀

---

## **Controls**

- **Arrow Keys:** Move Pac-Man:
  - ⬆️: Up
  - ⬇️: Down
  - ➡️: Right
  - ⬅️: Left

- **Mouse:**
  - Start or Restart the game by clicking the buttons.
  - Adjust difficulty using the dropdown.

---

## **How It Works**

### Game Elements
1. **Maze:**
   - Built on a grid using a 2D array (`MAZE`).
   - Walls are marked as `1`, paths as `0`.

2. **Pellets:**
   - Auto-generated at the start of the game.
   - Disappear when Pac-Man eats them.

3. **Pac-Man:**
   - Moves in the selected direction until hitting a wall.
   - Controlled using keyboard events (`keydown`, `keyup`).

4. **Ghosts:**
   - Follow Pac-Man using a heuristic algorithm.
   - Adjust their behavior based on proximity.

### Technical Details
- **Canvas API:** Renders the maze, characters, and animations.
- **JavaScript Classes:** Simplifies the logic for entities like ghosts.
- **Audio API:** Manages background music and sound effects.

---

## **Tips and Tricks**

1. **Stay Sharp:**
   Always plan your moves ahead. Ghosts don’t forgive mistakes! 🧠
   
2. **Use Corners:**
   Tricky ghosts sometimes get confused at corners—use this to your advantage.

3. **Difficulty Scaling:**
   Start with **Easy** to master movement before trying harder levels.

---

## **Contributing**

Want to add power-ups, bonus levels, or funky ghosts? Fork the repo and let your imagination run wild! Here’s how:
1. Fork the repository.
2. Create a feature branch:
   ```bash
   git checkout -b new-feature
   ```
3. Commit and push:
   ```bash
   git commit -m "Add your message"
   git push origin new-feature
   ```
4. Open a pull request.

---

## **Acknowledgments**

- **Original Pac-Man Creators:** For inspiring this modern-day homage.
- **You:** For being curious enough to read this far. Go play already!
- **Music.js Devs:** For keeping the vibe alive.

---

### 🚀 **Get Ready for the Maze Mayhem!**
*"Warning: Side effects include ghost paranoia and an unexplained love for yellow circles."* 🟡
