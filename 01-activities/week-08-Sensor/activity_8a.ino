// DM2008 — Activity 8a
// Type 3: Fade Control (10 min)

int ledPin = 9;
int ledGreen = 2;
int ledYellow = 13; 
     // must be a PWM pin (~)
int brightness = 0; // current brightness level (0–255)
int fadeAmount = 25; // how much brightness changes each step

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(ledGreen, OUTPUT);
  pinMode(ledYellow, OUTPUT);
}

void loop() {
  analogWrite(ledPin, brightness);

  brightness += fadeAmount;

  // When brightness hits 0 or 255, reverse the direction
  if (brightness <= 0 || brightness >= 255) {
    fadeAmount = -fadeAmount;
  }

  delay(30);

  digitalWrite(ledYellow, HIGH); // LED on
  delay(500);
  digitalWrite(ledYellow, LOW);  // LED off
  delay(500);


   digitalWrite(ledGreen, HIGH); // LED on
}
