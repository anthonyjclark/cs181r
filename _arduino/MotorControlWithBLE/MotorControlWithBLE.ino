#include <Arduino.h>
#include <Wire.h>

#include <Chrono.h>
#include <ESP32Encoder.h>
#include <U8x8lib.h>

#include "MotorController.h"
#include "BluetoothManager.h"

// ----------------------------------------------------------------
// ▗▄▄    █                       ▗▄▖       ▗▄▖      ▗▖
// ▐▛▀█   ▀                       █▀▜      ▗▛▀▜      ▐▌
// ▐▌ ▐▌ ██  ▗▟██▖▐▙█▙            ▜▖       ▐▙   ▐▙█▙ ▐▌▟▛  █▟█▌
// ▐▌ ▐▌  █  ▐▙▄▖▘▐▛ ▜▌           ██▖▄      ▜█▙ ▐▛ ▜▌▐▙█   █▘
// ▐▌ ▐▌  █   ▀▀█▖▐▌ ▐▌          ▐▌▝▙█        ▜▌▐▌ ▐▌▐▛█▖  █
// ▐▙▄█ ▗▄█▄▖▐▄▄▟▌▐█▄█▘  █       ▝█▄█▌     ▐▄▄▟▘▐█▄█▘▐▌▝▙  █     █
// ▝▀▀  ▝▀▀▀▘ ▀▀▀ ▐▌▀▘   ▀        ▝▀▀▀      ▀▀▘ ▐▌▀▘ ▝▘ ▀▘ ▀     ▀
//                ▐▌                            ▐▌
// ----------------------------------------------------------------

#define SPEAKER_PIN D6
#define DISPLAY_UPDATE_PERIOD_MS 500

U8X8_SSD1306_128X64_NONAME_HW_I2C display(SCL, SDA, U8X8_PIN_NONE);

Chrono displayChrono;

// ----------------------------------------------------------------
// ▗▄▄▄▖                  ▗▖
// ▐▛▀▀▘                  ▐▌
// ▐▌   ▐▙██▖ ▟██▖ ▟█▙  ▟█▟▌ ▟█▙  █▟█▌▗▟██▖
// ▐███ ▐▛ ▐▌▐▛  ▘▐▛ ▜▌▐▛ ▜▌▐▙▄▟▌ █▘  ▐▙▄▖▘å
// ▐▌   ▐▌ ▐▌▐▌   ▐▌ ▐▌▐▌ ▐▌▐▛▀▀▘ █    ▀▀█▖
// ▐▙▄▄▖▐▌ ▐▌▝█▄▄▌▝█▄█▘▝█▄█▌▝█▄▄▌ █   ▐▄▄▟▌
// ▝▀▀▀▘▝▘ ▝▘ ▝▀▀  ▝▀▘  ▝▀▝▘ ▝▀▀  ▀    ▀▀▀
// ----------------------------------------------------------------

#define MOTOR_RIGHT_CLK D0
#define MOTOR_RIGHT_DAT D1

#define MOTOR_LEFT_CLK D2
#define MOTOR_LEFT_DAT D3

ESP32Encoder encoderRight;
ESP32Encoder encoderLeft;

// float measuredSpeedRight = 0;
// float measuredSpeedLeft = 0;

// ----------------------------------------------------------------
// ▗▄ ▄▖
// ▐█ █▌      ▐▌
// ▐███▌ ▟█▙ ▐███  ▟█▙  █▟█▌▗▟██▖
// ▐▌█▐▌▐▛ ▜▌ ▐▌  ▐▛ ▜▌ █▘  ▐▙▄▖▘
// ▐▌▀▐▌▐▌ ▐▌ ▐▌  ▐▌ ▐▌ █    ▀▀█▖
// ▐▌ ▐▌▝█▄█▘ ▐▙▄ ▝█▄█▘ █   ▐▄▄▟▌
// ▝▘ ▝▘ ▝▀▘   ▀▀  ▝▀▘  ▀    ▀▀▀
// ----------------------------------------------------------------

#define CONTROL_UPDATE_PERIOD_MS 50
#define CONTROL_UPDATE_PERIOD_S (float(CONTROL_UPDATE_PERIOD_MS) / 1000.0)

#define WHEEL_CIRCUMFERENCE_MM 251.32
#define PULSES_PER_ROTATION 360
#define SPEED_THRESH_PERCENT 5
#define MAX_SPEED_MM_PER_S 800
#define CONTROL_GAIN .05

#define PWM_MAX_DELTA_PER_UPDATE 20
#define PWM_CUTOFF_LOW = 50;

#define MOTOR_RIGHT_PWM D8 // yellow
#define MOTOR_RIGHT_DIR D7 // white
#define MOTOR_LEFT_PWM D10 // yellow
#define MOTOR_LEFT_DIR D9  // white

MotorController motorRightController(HIGH, MOTOR_RIGHT_DIR, MOTOR_RIGHT_PWM, MAX_SPEED_MM_PER_S, PWM_MAX_DELTA_PER_UPDATE, CONTROL_GAIN);
MotorController motorLeftController(HIGH, MOTOR_LEFT_DIR, MOTOR_LEFT_PWM, MAX_SPEED_MM_PER_S, PWM_MAX_DELTA_PER_UPDATE, CONTROL_GAIN);

Chrono motorControlChrono;

int motorLeftPWMValue;
int motorRightPWMValue;

// ----------------------------------------------------------------
// ▗▄▄▖ ▗▄▖                                ▗▖
// ▐▛▀▜▌▝▜▌             ▐▌             ▐▌  ▐▌
// ▐▌ ▐▌ ▐▌  ▐▌ ▐▌ ▟█▙ ▐███  ▟█▙  ▟█▙ ▐███ ▐▙██▖
// ▐███  ▐▌  ▐▌ ▐▌▐▙▄▟▌ ▐▌  ▐▛ ▜▌▐▛ ▜▌ ▐▌  ▐▛ ▐▌
// ▐▌ ▐▌ ▐▌  ▐▌ ▐▌▐▛▀▀▘ ▐▌  ▐▌ ▐▌▐▌ ▐▌ ▐▌  ▐▌ ▐▌
// ▐▙▄▟▌ ▐▙▄ ▐▙▄█▌▝█▄▄▌ ▐▙▄ ▝█▄█▘▝█▄█▘ ▐▙▄ ▐▌ ▐▌
// ▝▀▀▀   ▀▀  ▀▀▝▘ ▝▀▀   ▀▀  ▝▀▘  ▝▀▘   ▀▀ ▝▘ ▝▘
// ----------------------------------------------------------------

#define SERVICE_UUID "19b10000-e8f2-537e-4f6c-d104768a1214"
#define MEASURED_SPEED_CHARACTERISTIC_RIGHT_UUID "19b10001-e8f2-537e-4f6c-d104768a1214"
#define MEASURED_SPEED_CHARACTERISTIC_LEFT_UUID "19b10002-e8f2-537e-4f6c-d104768a1214"
#define SPEED_CHARACTERISTIC_RIGHT_UUID "19b10003-e8f2-537e-4f6c-d104768a1214"
#define SPEED_CHARACTERISTIC_LEFT_UUID "19b10004-e8f2-537e-4f6c-d104768a1214"

static NimBLEServer *pServer;

NimBLECharacteristic *pMeasuredSpeedCharacteristicRight = NULL;
NimBLECharacteristic *pMeasuredSpeedCharacteristicLeft = NULL;

// TODO: move to setup?
NimBLECharacteristic *pWebSpeedCharacteristicRight = NULL;
NimBLECharacteristic *pWebSpeedCharacteristicLeft = NULL;

// ----------------------------------------------------------------
//  ▗▄▖
// ▗▛▀▜       ▐▌
// ▐▙    ▟█▙ ▐███ ▐▌ ▐▌▐▙█▙
//  ▜█▙ ▐▙▄▟▌ ▐▌  ▐▌ ▐▌▐▛ ▜▌
//    ▜▌▐▛▀▀▘ ▐▌  ▐▌ ▐▌▐▌ ▐▌
// ▐▄▄▟▘▝█▄▄▌ ▐▙▄ ▐▙▄█▌▐█▄█▘
//  ▀▀▘  ▝▀▀   ▀▀  ▀▀▝▘▐▌▀▘
//                     ▐▌
// ----------------------------------------------------------------

void setup()
{
  Serial.begin(115200);

  Serial.println("Starting NimBLE Server");
  NimBLEDevice::init("Bot1");

  encoderRight.attachHalfQuad(MOTOR_RIGHT_DAT, MOTOR_RIGHT_CLK);
  encoderRight.setCount(0);

  encoderLeft.attachHalfQuad(MOTOR_LEFT_DAT, MOTOR_LEFT_CLK);
  encoderLeft.setCount(0);

  motorControlChrono.add(CONTROL_UPDATE_PERIOD_MS);
  displayChrono.add(DISPLAY_UPDATE_PERIOD_MS);
  pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

  NimBLEService *pService = pServer->createService(SERVICE_UUID);

  pMeasuredSpeedCharacteristicRight = pService->createCharacteristic(MEASURED_SPEED_CHARACTERISTIC_RIGHT_UUID, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::NOTIFY);
  pMeasuredSpeedCharacteristicLeft = pService->createCharacteristic(MEASURED_SPEED_CHARACTERISTIC_LEFT_UUID, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::NOTIFY);

  pWebSpeedCharacteristicRight = pService->createCharacteristic(SPEED_CHARACTERISTIC_RIGHT_UUID, NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::NOTIFY);
  pWebSpeedCharacteristicLeft = pService->createCharacteristic(SPEED_CHARACTERISTIC_LEFT_UUID, NIMBLE_PROPERTY::WRITE | NIMBLE_PROPERTY::NOTIFY);

  pMeasuredSpeedCharacteristicRight->setValue<float>(0.0);
  pMeasuredSpeedCharacteristicRight->notify(true);

  pMeasuredSpeedCharacteristicLeft->setValue<float>(0.0);
  pMeasuredSpeedCharacteristicLeft->notify(true);

  pWebSpeedCharacteristicRight->setCallbacks(new SpeedCharacteristicCallbacks(true));
  pWebSpeedCharacteristicRight->notify(true);

  pWebSpeedCharacteristicLeft->setCallbacks(new SpeedCharacteristicCallbacks(false));
  pWebSpeedCharacteristicLeft->notify(true);

  /** Start the services when finished creating all Characteristics and Descriptors */
  pService->start();

  NimBLEAdvertising *pAdvertising = NimBLEDevice::getAdvertising();
  /** Add the services to the advertisment data **/
  pAdvertising->addServiceUUID(pService->getUUID());
  /** If your device is battery powered you may consider setting scan response
   *  to false as it will extend battery life at the expense of less data sent.
   */

  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Serial.println("Advertising Started");

  display.begin();
  display.setFlipMode(1); // set number from 1 to 3, the screen word will rotary 180
  pinMode(SPEAKER_PIN, OUTPUT);

  display.setFont(u8x8_font_chroma48medium8_r);
  display.setCursor(0, 0);
  display.print("Advertising\n");
  display.print("started.");

  playNote('C', 2000, SPEAKER_PIN);
}

void shutdownAndAdvertise()
{
  // Halt motors
  motorRightController.stop();
  motorLeftController.stop();

  // Play a note and reset the display
  playNote('B', 1000, SPEAKER_PIN);
  display.clear();
  display.print("Device\n");
  display.print("disconnected.");

  // Restart advertising after a brief delay
  delay(500);
  pServer->startAdvertising();
  Serial.println("Start advertising");
  oldDeviceConnected = deviceConnected;
}

void loop()
{

  if (deviceConnected && motorControlChrono.hasPassed(CONTROL_UPDATE_PERIOD_MS))
  {
    motorControlChrono.restart();

    // TODO: create function to convert encoder counts to speed

    long newRightPosition = encoderRight.getCount() / 2;
    long newLeftPosition = encoderLeft.getCount() / 2;

    encoderRight.setCount(0);
    encoderLeft.setCount(0);

    float rightRotations = newRightPosition / (float)PULSES_PER_ROTATION;
    float leftRotations = newLeftPosition / (float)PULSES_PER_ROTATION;

    float rightDistance = rightRotations * WHEEL_CIRCUMFERENCE_MM;
    float leftDistance = leftRotations * WHEEL_CIRCUMFERENCE_MM;

    float measuredSpeedRight = rightDistance / CONTROL_UPDATE_PERIOD_S;
    float measuredSpeedLeft = leftDistance / CONTROL_UPDATE_PERIOD_S;

    // Set and notify the characteristic with the byte buffer
    pMeasuredSpeedCharacteristicRight->setValue<float>(measuredSpeedRight);
    pMeasuredSpeedCharacteristicRight->notify();

    pMeasuredSpeedCharacteristicLeft->setValue<float>(measuredSpeedLeft);
    pMeasuredSpeedCharacteristicLeft->notify();

    //   compute uDelta = constrain(kp*e, -PWM_MAX_DELTA_PER_UPDATE, PWM_MAX_DELTA_PER_UPDATE)
    // float uDeltaLeft = motorLeftController.proportionalControl(motorWebSpeedPercentLeft, measuredSpeedLeft);

    // //   compute u = constrain(u + uDelta, -100, 100)
    // controlSignalLeft = constrain(controlSignalLeft + uDeltaLeft, -100, 100);
    // //   set dir = u > 0 ? FORWARD : REVERSE
    // Direction directionValueLeft = controlSignalLeft > 0 ? FORWARD : REVERSE;
    // //   if (abs(u) < SPEED_THRESH_PERCENT) then pwm = 0
    // if (abs(controlSignalLeft) < SPEED_THRESH_PERCENT)
    // {
    //   motorLeftPWMValue = 0;
    // }
    // //   else
    // //       set pwm = map(abs(u), 0, 100, MIN_VALUE, 255)
    // else
    // {
    //   motorLeftPWMValue = map(abs(controlSignalLeft), 0, 100, MIN_PWM_VALUE, 255);
    // }

    // //   set pwm = constrain(pwm, 0, 255)
    // motorLeftPWMValue = constrain(motorLeftPWMValue, 0, 255);
    // // send the values to the motor

    // motorLeftController.set(directionValueLeft, motorLeftPWMValue);

    // float uDeltaRight = motorRightController.proportionalControl(motorWebSpeedPercentRight, measuredSpeedRight);
    // //   compute u = constrain(u + uDelta, -100, 100)
    // controlSignalRight = constrain(controlSignalRight + uDeltaRight, -100, 100);
    // //   set dir = u > 0 ? FORWARD : REVERSE
    // Direction directionValueRight = controlSignalRight > 0 ? FORWARD : REVERSE;
    // //   if (abs(u) < SPEED_THRESH_PERCENT) then pwm = 0
    // if (abs(controlSignalRight) < SPEED_THRESH_PERCENT)
    // {
    //   motorRightPWMValue = 0;
    // }
    // //   else
    // //       set pwm = map(abs(u), 0, 100, MIN_VALUE, 255)
    // else
    // {
    //   motorRightPWMValue = map(abs(controlSignalRight), 0, 100, MIN_PWM_VALUE, 255);
    // }
    // //   set pwm = constrain(pwm, 0, 255)
    // motorRightPWMValue = constrain(motorRightPWMValue, 0, 255);
    // // send the values to the motor

    // motorRightController.set(directionValueRight, motorRightPWMValue);

    motorRightPWMValue = pWebSpeedCharacteristicRight->getValue<int>();
    motorLeftPWMValue = pWebSpeedCharacteristicLeft->getValue<int>();

    motorRightController.setProportional(motorRightPWMValue, measuredSpeedRight);
    motorLeftController.setProportional(motorLeftPWMValue, measuredSpeedLeft);
  }

  if (displayChrono.hasPassed(DISPLAY_UPDATE_PERIOD_MS))
  {
    displayChrono.restart();

    // display.clear();
    // display.print("left encoder speed: ");
    // display.println(measuredSpeedLeft);
    // display.print("right encoder speed: ");
    // display.println(measuredSpeedRight);
  }

  if (!deviceConnected && oldDeviceConnected)
  {
    shutdownAndAdvertise();
  }

  if (deviceConnected && !oldDeviceConnected)
  {
    oldDeviceConnected = deviceConnected;
    Serial.println("Device Connected");
    display.setCursor(0, 0);
    display.clear();
    display.println("Device connected");
    playNote('A', 1000, SPEAKER_PIN);
  }
}
