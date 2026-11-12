
let geoData;

let button;

let flagImg;
let flagShow = false;
let languageShow = false;
let features;
let flaggen ={};
let geometry;
let properties;
let iso;
let language;
let polygons;
let coordinates;
let currentCountry =0;
let correct={};
let incorrect={};
let animation=[];


let state = "play";
let quizData=[];
let score=0;
let time=10;
let timeLeft=10;

async function setup(){
    geoData = await loadJSON('data/countries.geojson');
    features = geoData.features;
    flaggen['AT']=await loadImage('flags/at.png');
    flaggen['CZ']=await loadImage('flags/cz.png');
    flaggen['SK']=await loadImage('flags/sk.png');
    flaggen['HU']=await loadImage('flags/hu.png');
    flaggen['DE']=await loadImage('flags/de.png');
    flaggen['FR']=await loadImage('flags/fr.png');
    flaggen['CH']=await loadImage('flags/ch.png');
    flaggen['IT']=await loadImage('flags/it.png');
    flaggen['SI']=await loadImage('flags/si.png');
    flaggen['HR']=await loadImage('flags/hr.png');
    flaggen['BE']=await loadImage('flags/be.png');
    flaggen['NL']=await loadImage('flags/nl.png');
    flaggen['PL']=await loadImage('flags/pl.png');

    createCanvas(windowWidth, windowHeight);
for (let f of features){
    correct[f.properties.iso]=0;
    incorrect[f.properties.iso]=0;
}
startQuiz();


}
function startQuiz() {
    quizData = [];
    for (let f of features){
        quizData.push(f.properties);
    }
    quizData=shuffle(quizData); // random doesnt work, cause its a array 
    currentCountry=0;
    score =0;
    time=10;
    timeLeft=time;
    state = "play";
}
function nextQuestion() {
    currentCountry++;
    if (currentCountry >= quizData.length) {
        state = "end";
        return;
    }
    time=max(3,time-1);
    timeLeft=time;
}

function draw(){
background(0); 

for (let iso in incorrect){
    incorrect[iso]*=0.95;
    correct[iso]*=0.97;
}
drawShape();
for (let i= animation.length-1; i>=0; i--){
    animation[i].fallAnimation();
    animation[i].display();
    if(animation[i].isDead()) animation.splice(i,1);
}
if (state === "play") {
  timeLeft -= deltaTime / 1000;

  if (timeLeft <= 0) {
    state = "end";
  }
}
drawUI();
}

function drawShape(){

//let g= slider.value(); 

for(let i=0; i<features.length; i++){
    geometry=features[i].geometry;
    properties=features[i].properties;
    iso=properties.iso;
    language=properties.languages;

    polygons =geometry.coordinates;
    coordinates=polygons[0];

    push();
    
let c = color(213, 122, 32);
if (state === "play" && mouseInCountry(coordinates)) {
  c = color(255, 180, 100);
}
c = lerpColor(c, color(0, 200, 0), correct[iso]);   
c = lerpColor(c, color(255, 0, 0), incorrect[iso]);    
fill(c);

 beginShape();


   
    for(let j=0; j<coordinates.length; j++){
        let longitude= coordinates[j][0];
        let latitude= coordinates[j][1];
        let x= map(longitude, -15, 40, 0, width);
        let y= map(latitude,57, 36,0, height);
        vertex(x,y);
    }
    endShape(CLOSE);
   if(correct[iso]> 0.1 && flaggen[iso]){
    drawFlag(coordinates, iso);
}

        pop();
    }
}


function drawFlag(coordinates, iso) {
    drawingContext.save();
            drawingContext.beginPath();

            let minX = width;
            let minY = height;
            let maxX = 0;
            let maxY = 0;

            for(let j = 0; j < coordinates.length; j++){
                let longitude = coordinates[j][0];
                let latitude = coordinates[j][1];
                let x = map(longitude, -15, 40, 0, width);
                let y = map(latitude, 57, 36, 0, height);
                
                if (x < minX) minX = x;
                if (y < minY) minY = y;
                if (x > maxX) maxX = x;
                if (y > maxY) maxY = y;
                if (j === 0) {
                    drawingContext.moveTo(x, y);
                } else {
                    drawingContext.lineTo(x, y);
                }
            }
            drawingContext.closePath();
            drawingContext.clip();
            
            
            let landWidth = maxX - minX;
            let landHeight = maxY - minY;

            
            image(flaggen[iso], minX, minY, landWidth, landHeight);
            drawingContext.restore();
}
function drawUI() {
    if (state==="play"){


    }

    fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
      if (state === "play") {
        text("Time Left: " + ceil(timeLeft), 20, 80);
    text("Score: " + score, 20, 20);
    text("Select: " + countryName(quizData[currentCountry]), 20, 50);
  }
    function countryName(country) {
  return country.name;
}
    if (state==="end") {
        fill(0,200);
        rect(0, 0, width, height);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        textSize(50);
        text("Game Over", width/2, height/2);
        textSize(30);
        text("Final Score: " + score, width/2, height/2 + 50);
        textSize(20);
        text("Click to restart", width/2, height/2 + 100);
    }

}
function countryName(country){
    return country.properties.name;
}
function mouseInCountry(coordinates) {
  drawingContext.beginPath();
  for (let p of coordinates) {
    let x = map(p[0], -15, 40, 0, width);
    let y = map(p[1], 57, 36, 0, height);
    drawingContext.lineTo(x, y);
  }
  return drawingContext.isPointInPath(mouseX * pixelDensity(), mouseY * pixelDensity());
}
function mousePressed() {
    if (state === "end") {
        startQuiz();
        return;
    }
    for (let i = 0; i < features.length; i++) {
    let iso = features[i].properties.iso;
    let coordinates = features[i].geometry.coordinates[0];
   
    if (mouseInCountry(coordinates)) {
        if (iso === quizData[currentCountry].iso) {
            score++;
            correct[iso] =1;
            for (let j = 0; j < 10; j++) {
                animation.push(new Particle(mouseX, mouseY));
            }
            nextQuestion();
            
        } else {
            score--;
            incorrect[iso] = 1;
        }
        return;
    }
    
}
}

class Particle{
    constructor(x,y){
        this.x=x;
        this.y=y;
        this.vx=random(-5,5);
        this.vy=random(-5,5);
        this.size=random(5,10);
        this.lifespan=255;
        this.r=random(100,255);
        this.g=random(100,255);
        this.b=random(100,255);
    }
    fallAnimation(){
        this.vy+=0.25;
        this.x+=this.vx;
        this.y+=this.vy;
        this.lifespan-=6;
    }
    display(){
        
        fill(this.r,this.g,this.b,this.lifespan);
        ellipse(this.x,this.y,this.size);
    }
    isDead(){
        return this.lifespan<=0;
    }
}