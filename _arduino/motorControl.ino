// contains a class that can be used to control the motors with proportional control 
// #define PWM_MAX_DELTA_PER_UPDATE 20 // pwm 
// #define MAX_SPEED_MM_PER_S 800

enum Direction {
  FORWARD,
  REVERSE
};

class MotorController {
public:
  int forwardLevel_;  // set this to either LOW or HIGH
  int directionPin_;
  int pwmPin_;

  MotorController(int forwardLevel, int directionPin, int pwmPin) {
    forwardLevel_ = forwardLevel;
    directionPin_ = directionPin;
    pwmPin_ = pwmPin;

    pinMode(pwmPin, OUTPUT);
    analogWrite(pwmPin, 0);
    pinMode(directionPin, OUTPUT);
    digitalWrite(directionPin, LOW);
  }

  void set(Direction direction, int pwm) {
    int directionValue = direction == FORWARD ? forwardLevel_ : !forwardLevel_;
    if (pwm < 0) {
      digitalWrite(directionPin_, !directionValue);
      analogWrite(pwmPin_, abs(pwm));
    }
    else {
      digitalWrite(directionPin_, directionValue);
      analogWrite(pwmPin_, pwm);
    }
  }

  
// takes in desired speed from 0 to 100 and actual speed in mm/s
  float proportionalControl(int motorSpeedPercent, float measuredSpeed){
      
    int userSetSpeed = map(motorSpeedPercent, -100, 100, -MAX_SPEED_MM_PER_S, MAX_SPEED_MM_PER_S);
    float error = userSetSpeed - measuredSpeed;
    // compute uDelta 
    return constrain(K_P * error, -PWM_MAX_DELTA_PER_UPDATE, PWM_MAX_DELTA_PER_UPDATE);

  }

};