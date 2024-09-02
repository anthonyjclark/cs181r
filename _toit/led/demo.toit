import .led

main:

  led := Led

  while true:

    led.on
    sleep --ms=1000

    led.off
    sleep --ms=250
