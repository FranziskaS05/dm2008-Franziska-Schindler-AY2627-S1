
let geoData;

let button;
let btnPractice;
let radius = 20;
let countryInfoDiv;
let cBg, cDot, cReveal;
let font;

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

let selectedCountry = null;

let state = "start";
let quizData=[];
let score=0;
let time=15;
let timeLeft=15;

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
    font= await loadFont('Organo.ttf');
    btnPractice = createButton('Practice Mode');
    btnPractice.position(windowWidth/2, windowHeight - 200);
    btnPractice.mousePressed(() => {
        state = "practice";
    });
    btnPractice.style('display', 'none');
    
    button = createButton('Start Quiz');
    button.position(windowWidth/2, windowHeight - 240);
    button.mousePressed(startQuiz);
    button.style('display', 'none');

    createCanvas(windowWidth, windowHeight-25);
    
    countryInfoDiv = createDiv('');
    countryInfoDiv.id("info");
    countryInfoDiv.hide();
    cBg     = color('#0F2A22');
    cDot    = color(200, 16, 46, 120);  
    cReveal = color('#2F5D4E');

for (let f of features){
    correct[f.properties.iso]=0;
    incorrect[f.properties.iso]=0;
}



}
function startQuiz() {
    quizData = [];
    for (let f of features){
        quizData.push(f.properties);
    }
    quizData=shuffle(quizData); // random doesnt work, cause its a array 
    currentCountry=0;
    score =0;
    time=15;
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
function practiceMode() {
    state = "practice";

}

function draw(){
background(cBg); 
interactiveBg();

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
function interactiveBg(){
    if (state==="practice"){
noStroke();

for(let i=0;i<windowWidth-radius;i+=radius*2){
    for(let j=0;j<windowHeight-radius;j+=radius*2){
        let d=dist(mouseX,mouseY,i,j);
        let size=map(d,0,50,radius,0);
        fill("#682121", 100);
        circle(i,j,size);
        }
    }
}
}

    

function drawShape(){

for(let i=0; i<features.length; i++){
    geometry=features[i].geometry;
    properties=features[i].properties;
    iso=properties.iso;
    language=properties.languages;

    polygons =geometry.coordinates;
    coordinates=polygons[0];

    push();
if (state==="practice"){
    stroke(255,120);
    strokeWeight(10);
    let weight=50;
    if (selectedCountry && selectedCountry.iso === iso) {
        drawFlag(coordinates, iso);
    }else if (mouseInCountry(coordinates)) {
        weight=150;
    }
    fill(240,240,240,weight);
    }else{
         stroke(255,120);
    strokeWeight(10);
        let c = color("#D57A20");
if (state === "play" && mouseInCountry(coordinates)) {
  c = color(255, 180, 100);
}
c = lerpColor(c, color(0, 200, 0), correct[iso]);   
c = lerpColor(c, color(255, 0, 0), incorrect[iso]);    
fill(c);}


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
    textFont(font);
    if (state==="start"){
        fill(0,200);
        rect(0, 0, width, height);
        fill(255);
        textAlign(CENTER, CENTER);
        textSize(50);
        text("Country Quiz", width/2, height/2 - 50);
        textSize(30);
        button.style('display', 'block');
        btnPractice.style('display', 'block');
        btnPractice.position(windowWidth/2+30, windowHeight - 300);
        btnPractice.mousePressed(() => {
            state = "practice";
        });
        button.html('Start Quiz');
        button.position(windowWidth/2-150, windowHeight - 300);
        button.mousePressed(startQuiz);
        countryInfoDiv.hide();

    }
    if (state==="practice"){
        button.style('display', 'block');
        button.html('Back to Start');
        button.mousePressed(() => {
            state = "start";
        });
        button.position(50, 50);
        btnPractice.style('display', 'none');
    }
  

    
      if (state === "play") {
        fill(255);
    textSize(20);
    textAlign(LEFT, TOP);
        button.style('display', 'none');
        btnPractice.style('display', 'block');
        btnPractice.position(50, 50); 
        textSize(30); 
        text("Time Left: ", 50, 130);
        fill("#682121");
        text(ceil(timeLeft), 230, 130)
      fill(" #F3EAD7")  ;
    text("Score: " + score, 50, 90);
    textSize(30);
    text("Select: " + countryName(quizData[currentCountry]), 50, 170);
    countryInfoDiv.hide();
  }
    function countryName(country) {
  return country.name;
}
    if (state==="end") {
        btnPractice.style('display', 'none');
        button.style('display', 'none');
        countryInfoDiv.hide();
        fill(0,200);
        rect(0, 0, width, height);
        fill(255, 0, 0);
        textAlign(CENTER, CENTER);
        fill("#F3EAD7");
        textSize(50);
        text("Game End", width/2, height/2);
        textSize(30);
        fill("#F3EAD7");
        text("Final Score: " + score, width/2, height/2 + 50);
        fill("#F3EAD7");
        textSize(20);
        text("Click mouse to restart", width/2, height/2 + 100);
    }



}
function showInfo(info){
    let html = "<h2>" + info.name + "</h2>";
    html += "<p>ISO Code: " + info.iso + "</p>";
    html += "<p>Languages: " + info.languages.join(", ") + "</p>";
    html += "<p>Population: " + info.population + "</p>";
    html +="<p>GDP: "+ info.gdp_usd_billion + " billion USD</p>";
    html +="<p>Fun Fact: " + info.fun_fact + "</p>";
    countryInfoDiv.html(html);
    countryInfoDiv.show();
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
function mousePressed(event) {
    if (event.target.tagName === 'BUTTON') { // so that clicking a button -> doesnt count cause button is above italy
        return;
    }
    if (state === "end") {
        button.style('display', 'block');
        btnPractice.style('display', 'block');
        state = "start";
        return;
    }
    for (let i = 0; i < features.length; i++) {
    let iso = features[i].properties.iso;
    let coordinates = features[i].geometry.coordinates[0];
   
    if (mouseInCountry(coordinates)) {
        if(state==="play"){
        if (iso === quizData[currentCountry].iso) {
            score++;
            correct[iso] =1;
            for (let j = 0; j < 30; j++) {
                animation.push(new Particle(mouseX, mouseY));
            }
            nextQuestion();
            
        } else {
            score--;
            incorrect[iso] = 1;
        }
        return;
    }else if (state === "practice") {
        
       for(let f of features){
        if (f.properties.iso === iso) {
            selectedCountry = f.properties;
            showInfo(selectedCountry);
            return;
        }
    }
}
}
}
}
function keyPressed() {
    
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
        noStroke();
        fill(this.r,this.g,this.b,this.lifespan);
        ellipse(this.x,this.y,this.size);
    }
    isDead(){
        return this.lifespan<=0;
    }
}