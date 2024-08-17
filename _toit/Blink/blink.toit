import gpio

main:

  pin := gpio.Pin 21 --output

  while true:
    pin.set 0
    sleep --ms=1000
    pin.set 1
    sleep --ms=250
