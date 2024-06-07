// motor A = left one 
// motor B = right one 

// motor A pins
#define MOTORA_ENABLE_PWM = D10
#define MOTORA_PHASE_DIR = D9 

// motor B pins
#define MOTORB_ENABLE_PWM = D8   
#define MOTORB_PHASE_DIR = D7

void setup() {

  // motor A enable pin set up 
  pinMode(MOTORA_ENABLE_PWM, OUTPUT);
  analogWrite(MOTORA_ENABLE_PWM, 0);

  // motor A phase pin set up 
  pinMode(MOTORA_PHASE_DIR, OUTPUT);
  digitalWrite(MOTORA_PHASE_DIR, LOW);


  // motor b enable pins set up 
  pinMode(MOTORB_ENABLE_PWM, OUTPUT);
  analogWrite(MOTORB_ENABLE_PWM, 0);
  
  // motor b phase pins set up 
  pinMode(MOTORB_PHASE_DIR, OUTPUT);
  digitalWrite(MOTORB_PHASE_DIR, LOW);

}

void loop() {
  int abs_speed = 50;  // set to half speed 

  // drive forward
  setMotor(abs_speed);
  delay(2000); // for two seconds 

  // full brake
  setMotor(0);
  delay(500); // wait for half a second 

  // drive backwards, setting motors to -50
  setMotor(-abs_speed);
  delay(2000); // for two seconds  

  // full brake 
  setMotor(0);
  delay(500);
}

// the setMotor speed takes in speed from -100 to 100 and sets direction accordingly
void setMotor(int raw_speed) {
  
  // if speed is positive, then direction of the wheels is forward
  if (raw_speed >= 0) {
    digitalWrite(MOTORA_PHASE_DIR, HIGH);
    digitalWrite(MOTORB_PHASE_DIR, LOW); // they are opposites due to the mirroring of the motors 
  }
  // if speed is negative, then direction of wheels are flipped 
  else {
    digitalWrite(MOTORA_PHASE_DIR, LOW);
    digitalWrite(MOTORB_PHASE_DIR, HIGH);
  }

  int speed = abs(raw_speed);  

  // caps the max speed at 100 
  if (speed > 100) {
    speed = 100;
  }

  int PWM = map(speed, 0, 100, 0, 255);  // maps speed (0 to 100) values to PWM (0 to 255) values 

  // set PWM value to motor controller
  analogWrite(MOTORA_ENABLE_PWM, PWM);
  analogWrite(MOTORB_ENABLE_PWM, PWM);

}
