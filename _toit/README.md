Software

Tips when following the instructions below

TODO:

- change getting mac just using jag
- do we need to get the port number first? looks automatic

- Discovering your device's serial port
  - Run `jag port` before connecting your device.
  - Plug in your device.
  - Rerun `jag port` and look for the new device.
  - Something like `/dev/cu.usbmodem12345678` should appear.
- Find your device's MAC address
  - Plug in your device.
  - Go to [ESP Tool](https://espressif.github.io/esptool-js/).
  - Press "Connect" and select the serial port.
  - Copy the "MAC" address.
- Flash the device with `jag flash --chip esp32s3-spiram-octo`
- Flash the device with `jag flash --chip esp32s3`
- Find the device with `jag scan IP:PORT`


```bash
jag container list --device 172.28.81.122
jag run hello.toit --device 172.28.81.122
```

Follow the [Toit documentation to get started](https://docs.toit.io/getstarted/device).
Then follow [Setting up Visual Studio Code](https://docs.toit.io/tutorials/setup/ide).

[arduino-esp32/variants/XIAO_ESP32S3/pins_arduino.h at master · espressif/arduino-esp32](https://github.com/espressif/arduino-esp32/blob/master/variants/XIAO_ESP32S3/pins_arduino.h)
https://files.seeedstudio.com/wiki/SeeedStudio-XIAO-ESP32S3/res/XIAO_ESP32S3_SCH_v1.2.pdf
[1306](https://wiki.seeedstudio.com/Seeeduino-XIAO-Expansion-Board/)
[XIAO_ESP32S3](https://wiki.seeedstudio.com/xiao_esp32s3_getting_started/#software-preparation)
