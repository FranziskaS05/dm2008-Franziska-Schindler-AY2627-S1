
let geoData;
let slider;


async function setup(){
    geoData = await loadJSON('data/geoData.geojson');
createCanvas(windowWidth, windowHeight);
background(220);




slider=createSlider(0,100,10);
slider.position(20,20);
slider.size(80);

}

function draw(){
   
drawShape();
}

function drawShape(){
let polygons;
let coordinates;
let features= geoData.features;
let geometry;
let g= slider.value(); 
fill(g);
for(let i=0; i<features.length; i++){
    geometry=features[i].geometry;
    polygons =geometry.coordinates;
    coordinates=polygons[0];
    beginShape();
    for(let j=0; j<coordinates.length; j++){
        let longitude= coordinates[j][0];
        let latitude= coordinates[j][1];
        let x= map(longitude, -15, 40, 0, width);
        let y= map(latitude,57, 36,0, height);
        vertex(x,y);
    }
    endShape(CLOSE);
}
}