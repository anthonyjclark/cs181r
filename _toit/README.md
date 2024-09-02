# Toit-Based Robot

## Getting Started

```bash
git clone https://github.com/anthonyjclark/MobileRoboticsCode.git

cd MobileRoboticsCode/communication
jag pkg install

cd ../display
jag pkg install
```

## Tips

Workflow

- Plug board into computer/laptop USB.
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

## Development

### TODO

- Motors turn-on when programming the robot. Look into: [suggested reset code](https://github.com/toitlang/toit/blob/f9dc258d690782be551a8ff35fe8f8ae37ad85bc/src/resources/gpio_esp32.cc#L192)

## Examples

- [x] hello world
- [x] led blink
- [x] communication and heartbeat
- [ ] display IP address
- [ ] speaker
- [x] motors (open-loop)
- [x] encoders
- [ ] motors (closed-loop)
- [ ] compass
- [ ] ranger
- [ ] IMU
- [ ] camera

## Compass and IMU Drivers

We should write these in `Toit`. They shouldn't be too hard. Both the IMU (MPU6050) and compass (QMC5883L) use the I2C bus.

Here are some resources:

- [How to write an I2C Toit driver](https://docs.toit.io/peripherals/drivers/sparkfun_joystick)
- [MPU6886 toit driver](https://github.com/imliubo/mpu6886-toit)
- [Basic MPU-6050 Arduino sketch](https://github.com/kriswiner/MPU6050/tree/master)
- [QMC5883L Compass Arduino Library](https://github.com/mprograms/QMC5883LCompass)

## VL54L7CX Ranger Driver

This is significantly more complicated. Some options:

- Write the driver in `Toit`.
- Write the driver in `C` and compiling into the native firmware.

Resources:

- [Toit Communicating with C code](https://docs.toit.io/tutorials/misc/c-service)
- [Ultra lite driver (ULD) API for the VL53L7CX](https://www.st.com/en/embedded-software/stsw-img036.html)
- [Official guide](https://www.st.com/resource/en/user_manual/um3038-a-guide-to-using-the-vl53l7cx-timeofflight-multizone-ranging-sensor-with-90-fov-stmicroelectronics.pdf)
- [Arduino library to support the VL53L7CX](https://github.com/stm32duino/VL53L7CX)
- [SparkFun VL53L5CX Arduino Library](https://github.com/sparkfun/SparkFun_VL53L5CX_Arduino_Library)
- [VL53L7CX MultiZone TOF Sensor - Simple Demo - YouTube](https://www.youtube.com/watch?v=_qOaqZwT73s)
