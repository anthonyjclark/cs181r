import .motors

main:
  time-to-run := 3_000
  time-to-stop := 1_000
  half-speed := 0.5

  motors := Motors

  while true:

    print "Running forward..."
    motors.set-speed half-speed
    sleep --ms=time-to-run

    print "Stopping..."
    motors.stop
    sleep --ms=time-to-stop

    print "Running reverse..."
    motors.set-speed -half-speed
    sleep --ms=time-to-run

    print "Stopping..."
    motors.stop
    sleep --ms=time-to-stop

  motors.close
