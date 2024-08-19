import font show Font
import gpio show Pin
import i2c show Bus
import pixel-display show Label PixelDisplay Style
import pixel-display.two-color show BLACK WHITE
import ssd1306 show Ssd1306

SANS ::= Font.get "sans10"
STYLE ::= Style --color=WHITE --font=SANS

class Display:
  static SDA ::= Pin 5
  static SCL ::= Pin 6
  static FREQUENCY ::= 400_000

  display/PixelDisplay

  constructor:
    bus := Bus --sda=SDA --scl=SCL --frequency=FREQUENCY

    devices := bus.scan
    if not devices.contains Ssd1306.I2C-ADDRESS:
      throw "No SSD1306 display found"

    device := bus.device Ssd1306.I2C-ADDRESS
    driver := Ssd1306.i2c device

    display = PixelDisplay.two-color driver
    display.background = BLACK

  add-text text --x=5 --y=10:
    display.add (Label --x=x --y=y --style=STYLE --text=text)

  draw:
    display.draw
