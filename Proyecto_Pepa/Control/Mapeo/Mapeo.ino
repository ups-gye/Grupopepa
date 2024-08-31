#define joyx A0
#define joyy A1
#define button_a 2
#define button_b 3
#define button_c 4
#define button_d 5
#define button_e 6
#define button_f 7
#define joy_button 8

int time_ = 150;
int threshold = 100; 
void setup() 
{
  pinMode(button_a, INPUT);
  pinMode(button_b, INPUT);
  pinMode(button_c, INPUT);
  pinMode(button_d, INPUT);
  pinMode(button_e, INPUT);
  pinMode(button_f, INPUT);
  pinMode(joy_button, INPUT);
  Serial.begin(9600);
}

void loop() 
{
  int xValue = analogRead(joyx);
  int yValue = analogRead(joyy);

  // Joystick movements
  if (xValue > (1023 - threshold)) {
    Serial.println("Right");
    delay(time_);
  } else if (xValue < threshold) {
    Serial.println("Left");
    delay(time_);
  }

  if (yValue > (1023 - threshold)) {
    Serial.println("Forward");
    delay(time_);
  } else if (yValue < threshold) {
    Serial.println("Back");
    delay(time_);
  }

  // Button presses
  if (digitalRead(button_a) == LOW) {
    Serial.println("Up");
    delay(time_);
  }

  if (digitalRead(button_b) == LOW) {
    Serial.println("Turn Right");
    delay(time_);
  }

  if (digitalRead(button_c) == LOW) {
    Serial.println("Down");
    delay(time_);
  }

  if (digitalRead(button_d) == LOW) {
    Serial.println("Turn Left");
    delay(time_);
  }

  if (digitalRead(button_e) == LOW) {
    Serial.println("Land");
    delay(time_);
  }

  if (digitalRead(button_f) == LOW) {
    Serial.println("Fly");
    delay(time_);
  }

  if (digitalRead(joy_button) == LOW) {
    Serial.println("Flip");
    delay(time_);
  }
}
