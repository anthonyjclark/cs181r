import gpio

main:

  led-pin := gpio.Pin 21 --output

  while true:

    led-pin.set 0
    sleep --ms=1000

    led-pin.set 1
    sleep --ms=250
