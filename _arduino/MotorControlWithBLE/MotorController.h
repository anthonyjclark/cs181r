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
    pinMode(pwmPin, OUTPUT);
    analogWrite(pwmPin, 0);
    pinMode(directionPin, OUTPUT);
    digitalWrite(directionPin, LOW);
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
    this.set(0, 0);
  }

  void setProportional(int motorSpeedPercent, float measuredSpeed)
  {
    // Convert from percent to mm/s
    int motorSpeed = map(motorSpeedPercent, -100, 100, -maxSpeedMMS_, maxSpeedMMS_);

    float error = motorSpeed - measuredSpeed;

    float pwm = constrain(controlGain_ * error, -maxPWMDelta_, maxPWMDelta_);

    int direction = motorSpeed > 0 ? FORWARD : REVERSE;

    this.set(direction, pwm);
  }
};

#endif // PROPORTIONAL_CONTROL_H
