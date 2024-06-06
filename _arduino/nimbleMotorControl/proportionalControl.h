#ifndef PROPORTIONAL_CONTROL_H
#define PROPORTIONAL_CONTROL_H

#include <ESP32Encoder.h>

enum Direction
{
  FORWARD,
  REVERSE
};

class MotorController
{
public:
  int forwardLevel_; // set this to either LOW or HIGH
  int directionPin_;
  int pwmPin_;
  int maxSpeedMMS_;
  int maxPWMDelta_;
  float Kp_;

  MotorController(int forwardLevel, int directionPin, int pwmPin, int maxSpeedMMS, int maxPWMDelta, float Kp)
  {
    forwardLevel_ = forwardLevel;
    directionPin_ = directionPin;
    pwmPin_ = pwmPin;
    maxSpeedMMS_ = maxSpeedMMS;
    maxPWMDelta_ = maxPWMDelta;
    Kp_ = Kp;
    pinMode(pwmPin, OUTPUT);
    analogWrite(pwmPin, 0);
    pinMode(directionPin, OUTPUT);
    digitalWrite(directionPin, LOW);
  }

  void set(Direction direction, int pwm)
  {
    int directionValue = direction == FORWARD ? forwardLevel_ : !forwardLevel_;

    digitalWrite(directionPin_, directionValue);
    analogWrite(pwmPin_, pwm);
  }
  void stop()
  {
    digitalWrite(directionPin_, 0);
    analogWrite(pwmPin_, 0);
  }

  // takes in desired speed from 0 to 100 and actual speed in mm/s
  float proportionalControl(int motorSpeedPercent, float measuredSpeed)
  {
    int userSetSpeed = map(motorSpeedPercent, -100, 100, -maxSpeedMMS_, maxSpeedMMS_);
    float error = userSetSpeed - measuredSpeed;
    Serial.print("error");
    Serial.println(error);
    // compute uDelta
    float uDelt = constrain(Kp_ * error, -maxPWMDelta_, maxPWMDelta_);
    Serial.print("uDelt");

        Serial.println(uDelt);

    return uDelt;
  }
};

#endif // PROPORTIONAL_CONTROL_H