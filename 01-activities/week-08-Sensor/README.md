## Force Sensor
We used a analogPin A0 to connect the force sensor to the board. When pressure is applied, the values are diplayed in the serial monitor.

## Light Sensor
We used a analogPin to connect the Sensor, the values of loght are displayed on the serial montior. 

## Ultrasonic Sensor
We conencted the sensor to the board, using any of the pins, 5V and ground. If there is an object infront of the the distance wil be shown in the serial montior.

## Activity_8a
there are 3 different LEDS, all of them need a resistor, so that not all of the 5V hits the LED. 1 is directly coneccted to the 5V and is always on (or with a random pin, if initialized in the code).
the second one blinks, by using delay(), which stops the code for a specific amoutn of time
and the third led uses a function to fade, specifically on a pwm pin ~