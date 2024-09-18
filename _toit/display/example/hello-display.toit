import ..src.display

import ...pinout

main:
  display := Display SDA-PIN SCL-PIN
  display.add-text "Hello, CS 181R!"
  display.draw
