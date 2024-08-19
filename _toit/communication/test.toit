import .communication
import ..blink

class LedTester implements Communicator:

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
    led-on

  disable:
    print "Disabling"
    state = Communicator.DISABLED
    led-off

main:
  led-tester := LedTester
  comm := WsCommunication led-tester
