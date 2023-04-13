

// pins for the LEDs:
const int greenPin = 9;
const int pent = A0;

void setup() {
  // initialize serial:
  Serial.begin(9600);
  // make the pins outputs:
  pinMode(greenPin, OUTPUT);
  pinMode(pent, INPUT);

}

void loop() {

  int pentVal = analogRead(pent);
  Serial.println(pentVal);
  // if there's any serial available, read it:
  while (Serial.available() > 0) {

    // look for the next valid integer in the incoming serial stream:
    int green = Serial.parseInt();

    // look for the newline. That's the end of your sentence:
    if (Serial.read() == '\n') {
      // constrain the values to 0 - 255 and invert
      // if you're using a common-cathode LED, just use "constrain(color, 0, 255);"
      green = 255-constrain(green, 0, 255);

      // fade the red, green, and blue legs of the LED:
      analogWrite(greenPin, green);
    }
  }
}
