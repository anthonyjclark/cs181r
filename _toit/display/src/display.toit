import font show Font
import gpio show Pin
import i2c show Bus
import pixel-display show Label PixelDisplay Style
import pixel-display.two-color show BLACK WHITE
import ssd1306 show Ssd1306

// import ...pinout

SANS ::= Font.get "sans10"
STYLE ::= Style --color=WHITE --font=SANS

class Display:
  static FREQUENCY ::= 400_000

  display/PixelDisplay

  constructor sda-pin/int scl-pin/int --inverted=false:
    sda ::= Pin sda-pin
    scl ::= Pin scl-pin

    bus := Bus --sda=sda --scl=scl --frequency=FREQUENCY

    devices := bus.scan
    if not devices.contains Ssd1306.I2C-ADDRESS:
      throw "No SSD1306 display found"

    device := bus.device Ssd1306.I2C-ADDRESS
    driver := Ssd1306.i2c device

    display = PixelDisplay.two-color driver --inverted=inverted
    display.background = BLACK

  add-text text --x=8 --y=16:
    display.add (Label --x=x --y=y --style=STYLE --text=text)

  draw:
    display.draw
