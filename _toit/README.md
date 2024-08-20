# Toit-Based Robot

## Development Path

1. Start with the [blink](./blink) example.
2. Setup wireless communication. Shutdown on disconnect and missed heartbeats.
3. Setup display so that it can show the MCU's address.
4. Incorporate speaker.
5. Move motors with open-loop control.
6. Move motors with closed-loop control.
7. Incorporate compass.
8. Incorporate ranger.
9. Incorporate IMU.
10. Incorporate camera.

- [x] blink
- [x] communication
- [x] display
- [ ] speaker
- [x] motors
- [x] encoders
- [ ] compass
- [ ] ranger
- [ ] IMU
- [ ] camera

## Development Tips

Workflow

- Plug board into USB port.
- On first connection only:
  - Run `jag flash --chip esp32s3` (or `jag flash --chip esp32s3-spiram-octo`)
  - Note the MAC address
- Run `jag port` to get the serial port.
- Run `jag monitor` to see serial output. Note the IP address and port.
- Develop Toit code and run with: `jag run FILE --device IP:PORT`

Tutorials

- Follow the [Toit documentation to get started](https://docs.toit.io/getstarted/device).
- Then follow [Setting up Visual Studio Code](https://docs.toit.io/tutorials/setup/ide).

Pins

- [Xiao ESP32S3 Pin Labels](https://github.com/espressif/arduino-esp32/blob/master/variants/XIAO_ESP32S3/pins_arduino.h)
- [Xiao ESP32S3 Schematic (PDF)](https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/res/XIAO_ESP32S3_SCH_v1.2.pdf)
- [Xiao ESP32S3 Wiki](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/)
- [Xiao Expansion Board Wiki](https://wiki.seeedstudio.com/Seeeduino-XIAO-Expansion-Board/)
