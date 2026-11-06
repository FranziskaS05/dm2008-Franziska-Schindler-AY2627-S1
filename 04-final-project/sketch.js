
var geoData;



async function setup(){
    geoData = await loadJSON('data/geoData.geojson');
createCanvas(windowWidth, windowHeight);
background(220);
drawShape();

}

function draw(){
    

}

function drawShape(){
    var polygons;
var coordinates;
var features= geoData.features;
var geometry;

fill('#81b214');
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