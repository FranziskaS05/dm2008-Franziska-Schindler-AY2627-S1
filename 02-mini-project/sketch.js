// DM2008 — Mini Project
// FLAPPY BIRD (Starter Scaffold)
//
// Complete this scaffold into a playable game.
// Your game should have player control, collision detection,
// score tracking, and at least two game states.
//
// Not sure where to start? Try this order:
// 1. Get the bird flapping — add control in keyPressed()
// 2. Get pipes spawning — uncomment the spawn logic in draw()
// 3. Add collision detection between the bird and pipes
// 4. Add scoring when the bird passes a pipe
// 5. Add game states — at minimum a playing state and a game over state
//
// Stretch: add a start screen, a high score, or a difficulty curve.

/* ----------------- Globals ----------------- */
let bird;
let pipes = [];
let score = 0;
let spawnCounter = 0;
let button;
let buttonStart;
let font;
let bgImg, bImg;
let music;

const SPAWN_RATE = 90;
const PIPE_SPEED = 2;
const PIPE_GAP = 120;
const PIPE_W = 60;


let gameState = "start";

/* ----------------- Setup & Draw ----------------- */
async function setup() {
  createCanvas(windowWidth,  windowHeight);
  noStroke();
  bgImg= await loadImage("sunPlanet.jpeg");
  font = await loadFont("BingBoss.otf");
  bImg= await loadImage("taubeklein-1.png");
  music= await loadSound("musicgame.mp3");
  textFont(font);
  textAlign(CENTER, CENTER);
  textSize(36);
  imageMode(CENTER);
  bird = new Bird(120, height / 2);
  pipes.push(new Pipe(width+40));
  button = createButton("Retry");
  buttonStart=createButton("Start");
  button.position(width / 2, height/2+100);
  buttonStart.position(width/2,height/2+40);
  button.style("display","none");
  buttonStart.style("display","none");
  button.mouseClicked(function () {
      gameState = "start";
      button.style("display","none");
    
    });
   buttonStart.mouseClicked(function () {
      gameState = "playing";
      buttonStart.style("display","none");
     music.play();
    music.loop();
    });
}

function draw() {
  background(180, 22, 28);
  if (gameState==="start"){
    fill(255);
    
    text("Start Game",width/2,height/2);
    buttonStart.style("display","block");
    score=0;
  }

  if (gameState === "playing") {
   image(bgImg, width / 2, height / 2, width, height);
    
    bird.update();

    // Spawn a new pipe every SPAWN_RATE frames, then reset the counter
    spawnCounter++;
    if (spawnCounter >= SPAWN_RATE) {
      pipes.push(new Pipe(width + 40));
      spawnCounter = 0;
    }

    for (let i = pipes.length - 1; i >= 0; i--) {
      pipes[i].update();
      pipes[i].show();

      // When the bird hits a pipe, trigger game over
      if (pipes[i].hits(bird)) {
        console.log("hit");
        gameState = "gameover";
      }

      

      if (!pipes[i].passed && pipes[i].x + pipes[i].w < bird.pos.x) {
        score++;
        pipes[i].passed = true;
      }

      if (pipes[i].offscreen()) {
        pipes.splice(i, 1);
      }
    }

    bird.show();

    fill(255);
    
    text("Score:" + score, 80, 30);
    
  }

  if (gameState === "gameover") {
    fill(255);
    text("GAME OVER", width / 2, height / 2);
    text("Your Score: "+score, width/2,height/2+70);
    pipes = [];
    bird.pos=createVector(120, height / 2);
     music.stop();
    button.style("display","block");
  
  }
}

/* ----------------- Input ----------------- */
function keyPressed() {
  if (key == " ") {
    bird.flap();
  }
}

/* ----------------- Classes ----------------- */
class Bird {
  constructor(x, y) {
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.acc = createVector(0, 0);
    this.r = 20;
    this.gravity = 0.45;
    this.flapStrength = -6.0;
  }

  applyForce(fy) {
    this.acc.y += fy;
  }

  flap() {
    // A negative y velocity moves the bird upward
    this.vel.y = this.flapStrength;
  }

  update() {
    this.applyForce(this.gravity);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    // Keep the bird within the canvas vertically
    if (this.pos.y < this.r) {
      this.pos.y = this.r;
      this.vel.y = 0;
    }

    // Touching the ground is game over — same as hitting a pipe
    if (this.pos.y > height - this.r) {
      this.pos.y = height - this.r;
      this.vel.y = 0;
      gameState="gameover";
    }
  }

  show() {
    fill(255, 205, 80);
   
 
  image(bImg,this.pos.x, this.pos.y, this.r *2 ,this.r*2);
 
}
  
}

class Pipe {
  constructor(x) {
    this.x = x;
    this.w = PIPE_W;
    this.speed = PIPE_SPEED;

    const margin = 40;
    const gapY = random(margin, height - margin - PIPE_GAP);
    this.top = gapY;
    this.bottom = gapY + PIPE_GAP;

    this.passed = false;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(120, 20, 16);
    rect(this.x, 0, this.w, this.top);
    rect(this.x, this.bottom, this.w, height - this.bottom);
  }

  offscreen() {
    // 'return' sends a value back to wherever this method was called
   
    return this.x + this.w < 0;
  }

  // Checks if the bird overlaps with either pipe rectangle
  // 1) Is the bird within the pipe's x range?
  // 2) If yes, is it outside the gap — above the top or below the bottom?
  hits(bird) {
    const withinX =
      bird.pos.x + bird.r > this.x && bird.pos.x - bird.r < this.x + this.w;
    const aboveGap = bird.pos.y - bird.r < this.top;
    const belowGap = bird.pos.y + bird.r > this.bottom;
    return withinX && (aboveGap || belowGap);
  }
}
