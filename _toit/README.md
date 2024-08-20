# Toit-Based Robot

TODO:
- flip right motor direction
- compute speed from encoder values
- list of all pins

## Development Path

1. Start with the [blink](./blink) example.
2. Setup wireless communication. Shutdown on disconnect and missed heartbeats.
3. Setup display so that it can show the MCU's address.
4. Move motors with open-loop control.

- [✓] blink
- [✓] communication
- [✓] display
- [ ] speaker
- [✓] motors
- [ ] encoders
- [ ] compass
- [ ] ranger
- [ ] IMU
- [ ] camera

## Development Tips

- Plug board into USB port.
- On first connection only:
  - Run `jag flash --chip esp32s3` (or `jag flash --chip esp32s3-spiram-octo`)
  - Note the MAC address
- Run `jag port` to get the serial port.
- Run `jag monitor` to see serial output. Note the IP address and port.
- Develop Toit code and run with: `jag run FILE --device IP:PORT`

Follow the [Toit documentation to get started](https://docs.toit.io/getstarted/device).
Then follow [Setting up Visual Studio Code](https://docs.toit.io/tutorials/setup/ide).

[arduino-esp32/variants/XIAO_ESP32S3/pins_arduino.h at master · espressif/arduino-esp32](https://github.com/espressif/arduino-esp32/blob/master/variants/XIAO_ESP32S3/pins_arduino.h)
https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/res/XIAO_ESP32S3_SCH_v1.2.pdf
[1306](https://wiki.seeedstudio.com/Seeeduino-XIAO-Expansion-Board/)
[XIAO_ESP32S3](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/#software-preparation)
