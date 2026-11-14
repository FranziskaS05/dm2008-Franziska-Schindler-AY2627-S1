# Mini Project — Flappy pigeon



---

### The Project

I did a version of flappy bird with my own design.

---

### Output


[Watch Online](videos/gameplay_dead.mp4)
[Watch Online](videos/gameplay.mp4)


---

### ✍️ Reflection
Report MiniGame
• What game did you choose and why?
Flappybird: I new this game more than I did the other, I have do admit I first had no clue what pong was. But Flappy bird is overall a fun and addicting game, so that’s another reason why.
• What logic did you implement or modify?
I added different states like game Over and Start to switch the easiest between them and separate the different logic. In the start start the score is set to 0, and the Start button will appear with the display logic. Same in the game over state, the retry button will be visible that starts the game again (going back to start state).
• How does your scoring system work?
I have my variable score, that starts at 0 and every time the pigeon (my bird) passes the pipes the score increases 1. In the game over state your final score is displayed there. In the start state the score is set (back) to 0.
• What aesthetic choices did you make and how do they affect gameplay?
I added another font because I personally think it immediately gives the game some character and then also the background image to set the scene. I overall wanted to have a red-ish theme with the same start and game over menu. I used the CSS file to style the button element, like hover style or general form.
• What challenges did you encounter?
The sound always gives me trouble, I now only implemented background music because with a previous game I had trouble with different sound playing at the same time, so I kept it simple. In general, it didn’t load at first, and I didn’t know why even though I implemented the sound right, just to find out after multiple debugging sessions that I need to implement another script. The background Image also gave me some trouble, to format it the right way (I actually wanted it to move but what ever I did, it never looked how I wanted it, so I left it as it is )



