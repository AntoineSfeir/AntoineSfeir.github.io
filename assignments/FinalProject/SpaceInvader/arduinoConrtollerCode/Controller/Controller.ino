#include <Arduino_JSON.h>

const int numReadings = 10;

//Xsmoothing
int xReadings[numReadings];
int readXIndex = 0;
int xTotal = 0;
int xAverage = 0;

//Ysmoothing
int yReadings[numReadings];
int readYIndex = 0;
int yTotal = 0;
int yAverage = 0;

//Joystick
const int SW_pin = 2;
const int X_pin = A0;
const int Y_pin = A1;

//RGB
const int redPin = 9;
const int greenPin = 10;
const int bluePin = 11;

//LED
const int ledPin = 8;
int ledState = LOW;

//JoystickPotentiometers
int XValue = 0;
int YValue = 0;

//Joystick Pots Out
int XOut = 0;
int YOut = 0;

//setup no delay
unsigned long previousMillis = 0;
const long interval = 20;

//create JSON of our serial output
JSONVar serialOutput;

void setup() {
  // initialize serial:
  Serial.begin(9600);

  //Joystick switch
  pinMode(SW_pin, INPUT);
  digitalWrite(SW_pin, HIGH);

  //RGB
  pinMode(redPin, OUTPUT);
  pinMode(greenPin, OUTPUT);
  pinMode(bluePin, OUTPUT);

  //LED
  pinMode(ledPin, OUTPUT);

  //initialize all the X readings to 0:
  for (int thisXReading = 0; thisXReading < numReadings; thisXReading++) {
    xReadings[thisXReading] = 0;
  }

  //initialize all the Y readings to 0:
  for (int thisYReading = 0; thisYReading < numReadings; thisYReading++) {
    yReadings[thisYReading] = 0;
  }
}

void loop() {
  //create millis() object
  unsigned long currentMillis = millis();

  //Read joystick potentiometer pins
  //  XValue = analogRead(X_pin);
  //  YValue = analogRead(Y_pin);

  //map pot pins from 0 to 255
  XOut = map(xAverage, 0, 1023, 0, 255);
  YOut = map(yAverage, 0, 1023, 0, 255);

  //check Millis
  if (currentMillis - previousMillis >= interval) {
    previousMillis = currentMillis;

    //subtract last X reading
    xTotal = xTotal - xReadings[readXIndex];
    //read from the sensor:
    xReadings[readXIndex] = analogRead(X_pin);
    //add the reading to the total:
    xTotal = xTotal + xReadings[readXIndex];
    //advance to next position in array:
    readXIndex = readXIndex + 1;

    //if at end of array
    if (readXIndex >= numReadings) {
      //... wrap to beginning
      readXIndex = 0;
    }

    xAverage = xTotal / numReadings;

    //subtract last Y reading
    yTotal = yTotal - yReadings[readYIndex];
    //read from the sensor:
    yReadings[readYIndex] = analogRead(Y_pin);
    //add the reading to the total:
    yTotal = yTotal + yReadings[readYIndex];
    //advance to next position in array:
    readYIndex = readYIndex + 1;

    //if at end of array
    if (readYIndex >= numReadings) {
      //... wrap to beginning
      readYIndex = 0;
    }

    yAverage = yTotal / numReadings;

    //create JSON definitions
    serialOutput["Switch"] = digitalRead(SW_pin);
    serialOutput["Xaxis"] = XOut;
    serialOutput["Yaxis"] = YOut;

    //Output JSON values
    Serial.println(serialOutput);
  }

  while (Serial.available() > 0) {
    // Read the incoming serial data into a string
    String inputString = Serial.readStringUntil('\n');
    // Split the string into separate values using the comma delimiter
    String values[3];
    int i = 0;
    int commaIndex = 0;
    while (i < 2) {
      commaIndex = inputString.indexOf(',');
      if (commaIndex == -1) {
        break;
      }
      values[i] = inputString.substring(0, commaIndex);
      inputString = inputString.substring(commaIndex + 1);
      i++;
    }
    if (commaIndex != -1) {
      values[i] = inputString;
    }

    // Extract the color values from the values array
    int red = values[0].toInt();
    int green = values[1].toInt();
    int blue = values[2].toInt();

    // Constrain the color values to the range 0-255
    red = constrain(red, 0, 255);
    green = constrain(green, 0, 255);
    blue = constrain(blue, 0, 255);

    // Set the LED color based on the received color values
    analogWrite(redPin, red);
    analogWrite(greenPin, green);
    analogWrite(bluePin, blue);
  }
}

