import gpio show Pin

import ..pinout

class Led:
  pin/Pin
  constructor: pin = Pin.out BUILTIN-LED-PIN
  on: pin.set 0
  off: pin.set 1
