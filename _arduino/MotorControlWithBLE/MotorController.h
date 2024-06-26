#ifndef PROPORTIONAL_CONTROL_H
#define PROPORTIONAL_CONTROL_H


enum Direction
{
  FORWARD,
  REVERSE
};

class MotorController
{
public:
  int forwardLogicLevel_;
  int directionPin_;
  int pwmPin_;
  int maxSpeedMMS_;
  int maxPWMDelta_;
  float controlGain_;

  MotorController(int forwardLogicLevel, int directionPin, int pwmPin, int maxSpeedMMS, int maxPWMDelta, float controlGain)
  {
    forwardLogicLevel_ = forwardLogicLevel;
    directionPin_ = directionPin;
    pwmPin_ = pwmPin;
    maxSpeedMMS_ = maxSpeedMMS;
    maxPWMDelta_ = maxPWMDelta;
    controlGain_ = controlGain;
  }

  void initialize() {
    pinMode(pwmPin_, OUTPUT);
    analogWrite(pwmPin_, 0);
    pinMode(directionPin_, OUTPUT);
    digitalWrite(directionPin_, LOW);
  }

  void set(Direction direction, int pwm)
  {
    // TODO: require and check for initialization?

    int directionValue = direction == FORWARD ? forwardLogicLevel_ : !forwardLogicLevel_;

    digitalWrite(directionPin_, directionValue);
    analogWrite(pwmPin_, pwm);
  }

  void stop()
  {
    set(FORWARD, 0);
  }

  void setProportional(int motorSpeedPercent, float measuredSpeed)
  {
    // Convert from percent to mm/s
    int motorSpeed = map(motorSpeedPercent, -100, 100, -maxSpeedMMS_, maxSpeedMMS_);

    float error = motorSpeed - measuredSpeed;

    float pwm = constrain(controlGain_ * error, -maxPWMDelta_, maxPWMDelta_);

    Direction direction = motorSpeed > 0 ? FORWARD : REVERSE;

    set(direction, pwm);
  }
};

#endif // PROPORTIONAL_CONTROL_H
