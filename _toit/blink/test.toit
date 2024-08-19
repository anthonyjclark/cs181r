import gpio

import .blink

main:

  while true:

    led-on
    sleep --ms=1000

    led-off
    sleep --ms=250
