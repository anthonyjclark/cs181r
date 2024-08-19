import gpio

LED-PIN := gpio.Pin.out 21
// led-pin := gpio.Pin 21 --output

led-on: LED-PIN.set 0
led-off: LED-PIN.set 1
