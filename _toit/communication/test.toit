import .communication
import ..led

class LedBlinker implements Communicator:

  led := Led
  state := Communicator.DISABLED

  on-open: enable
  on-close: disable
  on-message message:
    print "Received message: $message"
    enable

  is-enabled:
    return state == Communicator.ENABLED

  enable:
    print "Enabling"
    state = Communicator.ENABLED
    led.on

  disable:
    print "Disabling"
    state = Communicator.DISABLED
    led.off

main:
  led-blinker := LedBlinker
  comm := WsCommunication led-blinker --heartbeat-ms=1000
