import .display

main:
  display := Display
  display.add-text "Hello, Toit!"
  display.draw
  sleep --ms=5000
