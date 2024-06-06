#include <NimBLEDevice.h>
#include <Chrono.h>
#include <ESP32Encoder.h>
#include <Arduino.h>
#include <U8x8lib.h>
#include <Wire.h>

#define CONTROL_UPDATE_PERIOD_MS 50 // miliseconds 
#define OLED_UPDATE_PERIOD_MS 500 // miliseconds
#define CONTROL_UPDATE_PERIOD_S (float(CONTROL_UPDATE_PERIOD_MS) / 1000.0) // seconds 

// OLEDs without Reset of the Display
U8X8_SSD1306_128X64_NONAME_HW_I2C u8x8(SCL, SDA, U8X8_PIN_NONE);  
#define speakerPin D6

// ----------------------------------------------------------------
// ▗▄▄▄▖                  ▗▖               
// ▐▛▀▀▘                  ▐▌               
// ▐▌   ▐▙██▖ ▟██▖ ▟█▙  ▟█▟▌ ▟█▙  █▟█▌▗▟██▖
// ▐███ ▐▛ ▐▌▐▛  ▘▐▛ ▜▌▐▛ ▜▌▐▙▄▟▌ █▘  ▐▙▄▖▘
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

// ----------------------------------------------------------------
// ▗▄ ▄▖                         
// ▐█ █▌      ▐▌                 
// ▐███▌ ▟█▙ ▐███  ▟█▙  █▟█▌▗▟██▖
// ▐▌█▐▌▐▛ ▜▌ ▐▌  ▐▛ ▜▌ █▘  ▐▙▄▖▘
// ▐▌▀▐▌▐▌ ▐▌ ▐▌  ▐▌ ▐▌ █    ▀▀█▖
// ▐▌ ▐▌▝█▄█▘ ▐▙▄ ▝█▄█▘ █   ▐▄▄▟▌
// ▝▘ ▝▘ ▝▀▘   ▀▀  ▝▀▘  ▀    ▀▀▀
// ----------------------------------------------------------------

// Motor globals
#define WHEEL_CIRCUMFERENCE_MM 251.32
#define PULSES_PER_ROTATION 360
#define SPEED_THRESH_PERCENT 5  // in terms of absolute value of u, which goes from 0 to 100

#define MOTOR_RIGHT_PWM D8  // yellow
#define MOTOR_RIGHT_DIR D7  // white

#define MOTOR_LEFT_PWM D10  // yellow
#define MOTOR_LEFT_DIR D9   // white

int MIN_PWM_VALUE = 0; 

int motorRightPWMValue = 0; 
int motorLeftPWMValue = 0;

int motorWebSpeedPercentRight;
int motorWebSpeedPercentLeft;

int controlSignalLeft;
int controlSignalRight;

MotorController motorRightController(HIGH, MOTOR_RIGHT_DIR, MOTOR_RIGHT_PWM);
MotorController motorLeftController(LOW, MOTOR_LEFT_DIR, MOTOR_LEFT_PWM);

Chrono motorControlChrono;
Chrono OLEDChrono;

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

// Bluetooth globals

static NimBLEServer* pServer;

NimBLECharacteristic* pMeasuredSpeedCharacteristicRight = NULL;
NimBLECharacteristic* pMeasuredSpeedCharacteristicLeft = NULL;

NimBLECharacteristic* pWebSpeedCharacteristicRight = NULL;
NimBLECharacteristic* pWebSpeedCharacteristicLeft = NULL;

bool deviceConnected = false;
bool oldDeviceConnected = false;

class SpeedCharacteristicCallbacks : public NimBLECharacteristicCallbacks {
  void onWrite(NimBLECharacteristic* pSpeedCharacteristic) {
    float speed = (pSpeedCharacteristic->getValue())[0];  // Get the value of the speed characteristic as a float
      if (speed > 155) {
        speed = speed - 256;
      }
      if (isRightMotorCallback_) {
        motorWebSpeedPercentRight = speed;
      } else {
        motorWebSpeedPercentLeft = speed;
      }  
  }
public:
  bool isRightMotorCallback_;
  SpeedCharacteristicCallbacks(bool right)
    : isRightMotorCallback_(right), NimBLECharacteristicCallbacks() {}
};

class ServerCallbacks: public NimBLEServerCallbacks {
    void onConnect(NimBLEServer* pServer) {
        deviceConnected = true;
    };
    void onDisconnect(NimBLEServer* pServer) {
        deviceConnected = false;
        NimBLEDevice::startAdvertising();
    };
};

void playTone(int tone, int duration) {
  for (long i = 0; i < duration * 1000L; i += tone * 2) {
    digitalWrite(speakerPin, HIGH);
    delayMicroseconds(tone);
    digitalWrite(speakerPin, LOW);
    delayMicroseconds(tone);
  }
}

void playNote(char note, int duration) {
  char names[] = {'C', 'D', 'E', 'F', 'G', 'A', 'B',
                  'c', 'd', 'e', 'f', 'g', 'a', 'b',
                  'x', 'y'
                 };
  int tones[] = { 1915, 1700, 1519, 1432, 1275, 1136, 1014,
                  956,  834,  765,  593,  468,  346,  224,
                  655 , 715
                };

  // play the tone corresponding to the note name
  for (int i = 0; i < 16; i++) {
    if (names[i] == note) {
      int newduration = duration;
      playTone(tones[i], newduration);
    }
  }
}

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

void setup() {
    Serial.begin(115200);

    Serial.println("Starting NimBLE Server");
    NimBLEDevice::init("Bot1");

    encoderRight.attachHalfQuad(MOTOR_RIGHT_DAT, MOTOR_RIGHT_CLK);
    encoderRight.setCount(0);

    encoderLeft.attachHalfQuad(MOTOR_LEFT_DAT, MOTOR_LEFT_CLK);
    encoderLeft.setCount(0);

    motorControlChrono.add(CONTROL_UPDATE_PERIOD_MS);
    OLEDChrono.add(OLED_UPDATE_PERIOD_MS);
    pServer = NimBLEDevice::createServer();
    pServer->setCallbacks(new ServerCallbacks());

    NimBLEService* pService = pServer->createService(SERVICE_UUID);

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

    NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
    /** Add the services to the advertisment data **/
    pAdvertising->addServiceUUID(pService->getUUID());
    /** If your device is battery powered you may consider setting scan response
     *  to false as it will extend battery life at the expense of less data sent.
     */

    pAdvertising->setScanResponse(true);
    pAdvertising->start();

    Serial.println("Advertising Started");

    u8x8.begin();
    u8x8.setFlipMode(1);   // set number from 1 to 3, the screen word will rotary 180
    pinMode(speakerPin, OUTPUT);

    u8x8.setFont(u8x8_font_chroma48medium8_r);
    u8x8.setCursor(0, 0);
    u8x8.print("Advertising\n");
    u8x8.print("started.");

    playNote('C', 2000);
}


void loop() {

  if (deviceConnected && motorControlChrono.hasPassed(CONTROL_UPDATE_PERIOD_MS)) {
    motorControlChrono.restart();

    long newRightPosition = encoderRight.getCount() / 2;
    long newLeftPosition = encoderLeft.getCount() / 2;

    encoderRight.setCount(0);
    encoderLeft.setCount(0);

    float rightRotations = newRightPosition / (float)PULSES_PER_ROTATION;
    float leftRotations = newLeftPosition / (float)PULSES_PER_ROTATION;

    float rightDistance = rightRotations * WHEEL_CIRCUMFERENCE_MM;
    float leftDistance = leftRotations * WHEEL_CIRCUMFERENCE_MM;

    // TODO: shouldn't need to multiply by -1 here
    float measuredSpeedRight = rightDistance / CONTROL_UPDATE_PERIOD_S;  
    float measuredSpeedLeft = leftDistance / CONTROL_UPDATE_PERIOD_S;

    // Set and notify the characteristic with the byte buffer
    pMeasuredSpeedCharacteristicRight->setValue<float>(measuredSpeedRight);
    // TODO: do we need to call notify?
    pMeasuredSpeedCharacteristicRight->notify();

    pMeasuredSpeedCharacteristicLeft->setValue<float>(measuredSpeedLeft);
    pMeasuredSpeedCharacteristicLeft->notify();

    if(OLEDChrono.hasPassed(OLED_UPDATE_PERIOD_MS)) {
    OLEDChrono.restart();
    u8x8.clear();
    u8x8.print("left encoder speed: ");
    u8x8.print(measuredSpeedLeft);
    u8x8.print("\n");
    u8x8.print("right encoder speed: ");
    u8x8.print(measuredSpeedRight);
    u8x8.print("\n");
    }

    //   compute uDelta = constrain(kp*e, -PWM_MAX_DELTA_PER_UPDATE, PWM_MAX_DELTA_PER_UPDATE) 
    float uDeltaLeft = motorLeftController.proportionalControl(motorWebSpeedPercentLeft, measuredSpeedLeft);
    //   compute u = constrain(u + uDelta, -100, 100)
    controlSignalLeft = constrain(controlSignalLeft + uDeltaLeft, -100, 100);
    //   set dir = u > 0 ? FORWARD : REVERSE
    Direction directionValueLeft = controlSignalLeft > 0 ? FORWARD : REVERSE;
    //   if (abs(u) < SPEED_THRESH_PERCENT) then pwm = 0
    if(abs(controlSignalLeft) < SPEED_THRESH_PERCENT){
      motorLeftPWMValue = 0;
    }
    //   else
    //       set pwm = map(abs(u), 0, 100, MIN_VALUE, 255)
      else{
      motorLeftPWMValue = map(abs(controlSignalLeft), 0, 100, MIN_PWM_VALUE, 255);
    }

    //   set pwm = constrain(pwm, 0, 255)
    motorLeftPWMValue = constrain(motorLeftPWMValue, 0, 255);
    // send the values to the motor
    motorLeftController.set(directionValueLeft, motorLeftPWMValue);

    float uDeltaRight = motorRightController.proportionalControl(motorWebSpeedPercentRight, measuredSpeedRight);
    //   compute u = constrain(u + uDelta, -100, 100)
    controlSignalRight = constrain(controlSignalRight + uDeltaRight, -100, 100);
    //   set dir = u > 0 ? FORWARD : REVERSE
    Direction directionValueRight = controlSignalRight > 0 ? FORWARD : REVERSE;
    //   if (abs(u) < SPEED_THRESH_PERCENT) then pwm = 0
    if(abs(controlSignalRight) < SPEED_THRESH_PERCENT){
      motorRightPWMValue = 0;
    }
    //   else
    //       set pwm = map(abs(u), 0, 100, MIN_VALUE, 255)
      else{
      motorRightPWMValue = map(abs(controlSignalRight), 0, 100, MIN_PWM_VALUE, 255);
    }
    //   set pwm = constrain(pwm, 0, 255)
    motorRightPWMValue = constrain(motorRightPWMValue, 0, 255);
    // send the values to the motor
    motorRightController.set(directionValueRight, motorRightPWMValue);

  }

  
  if (!deviceConnected && oldDeviceConnected) {  // device was connected but no longer true
    Serial.println("Device disconnected.");
    // turns both motors off immediately if it is disconnected (REVERSE is a placeholder, as the motor is set to 0 anyway)
    motorRightController.set(REVERSE, 0);
    motorLeftController.set(REVERSE, 0);
    Serial.println("Both motors turned off.");
    delay(500);                   // give the bluetooth stack the chance to get things ready
    pServer->startAdvertising();  // restart advertising
    Serial.println("Start advertising");
    oldDeviceConnected = deviceConnected;  // updates oldDeviceConnected
    playNote('B', 1000);
    u8x8.clear();
    u8x8.print("Device\n");
    u8x8.print("disconnected.");
  }
  // connecting
  if (deviceConnected && !oldDeviceConnected) {  // connecting the device
    oldDeviceConnected = deviceConnected;
    Serial.println("Device Connected");
    u8x8.setCursor(0, 0);
    u8x8.clear();
    u8x8.print("Device\n");
    u8x8.print("connected.");
    playNote('A', 1000);
  }
}
