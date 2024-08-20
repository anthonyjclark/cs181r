import gpio show Pin
import gpio.pwm show Pwm PwmChannel

import ..pinout

class Motor:
  static FORWARD ::= 0
  static REVERSE ::= 1

  static FREQUENCY ::= 10_000

  dir-pin/Pin
  pwm-pin/Pin
  pwm-generator := Pwm --frequency=FREQUENCY
  pwm-channel/PwmChannel

  constructor dir/int pwm/int:
    dir-pin = Pin.out dir
    pwm-pin = Pin pwm
    pwm-channel = pwm-generator.start pwm-pin

  set-speed speed/float:
    // Slamp speed to [-1.0, 1.0]
    speed = speed > 1.0 ? 1.0 : (speed < -1.0 ? -1.0 : speed)
    direction := speed > 0.0 ? FORWARD : REVERSE
    dir-pin.set direction
    pwm-channel.set-duty-factor speed.abs

  stop:
    set-speed 0.0

  close:
    pwm-channel.close
    pwm-generator.close
    dir-pin.close
    pwm-pin.close

class Encoder:


class Motors:
  left := Motor LEFT-MOTOR-DIR-PIN LEFT-MOTOR-PWM-PIN
  right := Motor RIGHT-MOTOR-DIR-PIN RIGHT-MOTOR-PWM-PIN

  set-speed speed/float:
    left.set-speed speed
    right.set-speed speed

  stop:
    left.stop
    right.stop

  close:
    left.close
    right.close
