
let geoData;
let slider;
let button;
let gbtn, hbtn, fbtn,cbtn,ibtn,czbtn,sbtn,nlbtn, plbtn;
let flagImg;
let flagShow = false;
let languageShow = false;
let flaggen ={};

async function setup(){
    geoData = await loadJSON('data/countries.geojson');

    flaggen['AT'] = await loadImage('flags/at.png');
    flaggen['CZ'] = await loadImage('flags/cz.png');
    flaggen['SK'] = await loadImage('flags/sk.png');
    flaggen['HU'] = await loadImage('flags/hu.png');
    flaggen['DE'] = await loadImage('flags/de.png');
    flaggen['FR']=await loadImage('flags/fr.png');
    flaggen['CH']=await loadImage('flags/ch.png');
    flaggen['IT']=await loadImage('flags/it.png');
    flaggen['SI']=await loadImage('flags/si.png');
    flaggen['HR']=await loadImage('flags/hr.png');
    flaggen['BE']=await loadImage('flags/be.png');
    flaggen['NL']=await loadImage('flags/nl.png');
    flaggen['PL']=await loadImage('flags/pl.png');

    createCanvas(windowWidth, windowHeight);

slider=createSlider(0,100,10);
slider.position(20,20);
slider.size(80);

gbtn=createButton('Germany');
gbtn.position(20,60);
gbtn.size(80);
gbtn.mousePressed(displayFlag);

hbtn=createButton('Hungary');
hbtn.position(20,100);
hbtn.size(80);
hbtn.mousePressed(displayFlag);

fbtn=createButton('France');
fbtn.position(20,140);
fbtn.size(80);
fbtn.mousePressed(displayFlag);

cbtn=createButton('Czechia');
cbtn.position(20,180);
cbtn.size(80);
cbtn.mousePressed(displayFlag);

ibtn=createButton('italian');
ibtn.position(20,220);
ibtn.size(80);
ibtn.mousePressed(displayFlag);

czbtn=createButton('Czechia');
czbtn.position(20,260);
czbtn.size(80);
czbtn.mousePressed(displayFlag);

sbtn=createButton('Slovakia');
sbtn.position(20,300);
sbtn.size(80);
sbtn.mousePressed(displayFlag);

nlbtn=createButton('Netherlands');
nlbtn.position(20,340);
nlbtn.size(80);
nlbtn.mousePressed(displayFlag);

plbtn=createButton('Poland');
plbtn.position(20,380);
plbtn.size(80);
plbtn.mousePressed(displayFlag);
}

function draw(){
background(220); 
drawShape();
}

function drawShape(){
let polygons;
let coordinates;
let features= geoData.features;
let geometry;
let properties;
let iso;
let language;
//let g= slider.value(); 

for(let i=0; i<features.length; i++){
    geometry=features[i].geometry;
    properties=features[i].properties;
    iso=properties.iso;
    language=properties.languages;

    polygons =geometry.coordinates;
    coordinates=polygons[0];

    push();
    fill(200,145,100);
   
    beginShape();
    for(let j=0; j<coordinates.length; j++){
        let longitude= coordinates[j][0];
        let latitude= coordinates[j][1];
        let x= map(longitude, -15, 40, 0, width);
        let y= map(latitude,57, 36,0, height);
        vertex(x,y);
    }
    endShape(CLOSE);
    if (flagShow) {
           shape(); 
        }
        
        pop();
}
function shape(){
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
}
function displayFlag(){
flagShow = !flagShow;

}
function languageShow(){
    languageShow = !languageShow;
}