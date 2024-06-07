// this is a basic script for controlling one motor. it runs the motor for two seconds, pauses, and then runs it in the opposite direction for two seconds

// pins associated to the motor
#define MOTORA_ENABLE_PWM = D10
#define MOTORA_PHASE_DIR = D9 


void setup() {

  pinMode(MOTORA_ENABLE_PWM, OUTPUT);
  pinMode(MOTORA_PHASE_DIR, OUTPUT);

  analogWrite(MOTORA_ENABLE_PWM, 0);
  digitalWrite(MOTORA_PHASE_DIR, LOW);

}

void loop() {
  
  // send commands to motor controller
  setMotorSpeed(50); // setMotorSpeed takes a speed from 0 to 100
  setMotorDirection(true); // going forward
  
  delay(2000); // motor speed is set to 50 for two seconds 

  setMotorSpeed(0);
  delay(500);

  // send commands to motor controller
  setMotorSpeed(50);
  setMotorDirection(false); // going backwards 
  
  delay(2000);
  
  setMotorSpeed(0);
  delay(500);
}

// function to set motor speed
void setMotorSpeed(int speed) {
  PWM = map(speed, 0, 100, 0, 255);
  analogWrite(MOTORA_ENABLE_PWM, PWM);
}

// function to set motor direction, true means forward
void setMotorDirection(bool forward) {
  // set direction pin based on forward flag
  digitalWrite(MOTORA_PHASE_DIR, forward ? HIGH : LOW);
}
