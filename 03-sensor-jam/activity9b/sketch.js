let port; // Serial Communication port
let connectBtn;
let wasOpened = false; // tracks port state to update the button label

let sensorVal;
let circleSize = 50;
let targetSize = 50; // used for Option 2
let speed = 0.01;
let x=0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  port = createSerial(); // creates the Serial Port

  // Connection helpers
  connectBtn = createButton("Connect to Arduino");
  connectBtn.position(20, 20);
  connectBtn.mousePressed(connectBtnClick);
  rectMode(CENTER);
}

function draw() {
  background(0,0,0, 20);
  let angle = frameCount * speed;
  translate(windowWidth/2, windowHeight/2);
  rotate(angle);
  stroke(123,231,56);
  fill(0);
  rect(x,0, circleSize);
  

  updateConnectBtn();

  // Receive data from Arduino
  if (port.opened()) {
    sensorVal = port.readUntil("\n");
    // Only log data that has information, not empty signals
    if (sensorVal[0]) {
      // Once you verify data is coming in,
      // disable logging to improve performance
      console.log(sensorVal);

      // use float() to convert the data from string to number
      // (Arduino must send ONE number per line, e.g. Serial.println(distVal))
      let val = float(sensorVal);

      // Ignore anything that isn't a number (e.g. stray text or a partial line)
      if (!isNaN(val)) {
        // OPTION 1:
        // Update circle's size with sensor's data directly
        // Reduce delay() value in Arduino to get smoother changes
        // circleSize = val;

        // OPTION 2:
        // Update circle's size using lerp() to smoothly change values
        // This method even works with longer delay() values in Arduino


        // map distance (5-50cm) to circle size: closer = bigger
        targetSpeed = map(val, 5, 50, 0.05, 0.1);
        targetSize = map(val, 5, 50, 200, 50);
        targetX=map(val, 5, 50, 20, windowWidth-20);

        // last value in lerp() controls speed of change
        speed = lerp(speed, targetSpeed, 0.1);
        circleSize=lerp(circleSize, targetSize, 0.1);
        x=lerp(x, targetX, 0.1);
      }
    }
  }
}

// DO NOT REMOVE THIS FUNCTION
function connectBtnClick() {
  // If port is not already open, open on click,
  // otherwise close the port
  // (the button label is updated in updateConnectBtn())
  if (!port.opened()) {
    port.open(9600); // opens port with Baud Rate of 9600
  } else {
    port.close();
  }
}

// Keeps the button in sync with the real port state, since opening is
// asynchronous and can fail (picker cancelled, port busy, board unplugged)
function updateConnectBtn() {
  let isOpened = port.opened();
  if (isOpened === wasOpened) return;
  wasOpened = isOpened;

  connectBtn.html(isOpened ? "Disconnect Arduino" : "Connect to Arduino");
  if (isOpened) {
    connectBtn.addClass("connected");
  } else {
    connectBtn.removeClass("connected");
  }
}
