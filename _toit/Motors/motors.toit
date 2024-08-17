// jag run motors.toit --device 172.28.85.219
import gpio
import gpio.pwm

main:
  time-to-run := 3_000
  half-speed := 0.5
  dir-forward := 1
  dir-reverse := 0

  left-dir := gpio.Pin 8 --output

  left-pwm := gpio.Pin 9
  left-gen := pwm.Pwm --frequency=10_000 // Minimum around 3K?
  left-chn := left-gen.start left-pwm

  print "Running forward..."
  left-dir.set dir-forward
  left-chn.set-duty-factor half-speed
  sleep --ms=time-to-run

  left-chn.set-duty-factor 0.0
  sleep --ms=1_000
  print "Running reverse..."

  left-dir.set dir-reverse
  left-chn.set-duty-factor half-speed
  sleep --ms=time-to-run

  left-chn.set-duty-factor 0.0
  while true:
    sleep --ms=1_000

  left-chn.close
  left-gen.close
  left-pwm.close
