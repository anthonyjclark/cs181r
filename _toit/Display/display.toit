import font show *
import gpio
import i2c
import pixel-display show *
import pixel-display.two-color show *
import ssd1306 show *

current-date:
  now := Time.now.local
  return "$now.year-$(%02d now.month)-$(%02d now.day)"

current-time:
  now := Time.now.local
  return "$(%02d now.h):$(%02d now.m):$(%02d now.s)"

main:
  sda := gpio.Pin 5
  scl := gpio.Pin 6
  frequency := 400_000

  bus := i2c.Bus --sda=sda --scl=scl --frequency=frequency

  devices := bus.scan
  if not devices.contains Ssd1306.I2C-ADDRESS:
    throw "No SSD1306 display found"

  device := bus.device Ssd1306.I2C-ADDRESS
  driver := Ssd1306.i2c device
  display := PixelDisplay.two-color driver
  display.background = BLACK

  sans := Font.get "sans10"
  [
    Label --x=30 --y=20 --text="Toit",
    Label --x=30 --y=40 --id="date",
    Label --x=30 --y=60 --id="time",
  ].do: display.add it

  STYLE ::= Style
      --type-map={
          "label": Style --font=sans --color=WHITE,
      }
  display.set-styles [STYLE]

  date/Label := display.get-element-by-id "date"
  time/Label := display.get-element-by-id "time"
  while true:
    date.text = current-date
    time.text = current-time
    display.draw
    sleep --ms=250
