#include <NimBLEDevice.h>

/*
extern specifies that the variable or function is defined in another translation unit.
The extern must be applied in all files except the one where the variable is defined.
*/

static NimBLEServer* pServer;

static bool connected = false;
static bool previouslyConnected = false;

static bool receivedValueFromClient = false;
static int receivedValue;

static bool wroteValueToClient = false;


class ServerCallbacks : public NimBLEServerCallbacks {
  void onConnect(NimBLEServer* pServer) {
    connected = true;
  };
  void onDisconnect(NimBLEServer* pServer) {
    connected = false;
    NimBLEDevice::startAdvertising();
  };

  /********************* Security handled here **********************
****** Note: these are the same return values as defaults ********/
  uint32_t onPassKeyRequest() {
    Serial.println("Server Passkey Request");
    /** This should return a random 6 digit number for security
         *  or make your own static passkey as done here.
         */
    return 123456;
  };

  bool onConfirmPIN(uint32_t pass_key) {
    Serial.print("The passkey YES/NO number: ");
    Serial.println(pass_key);
    /** Return false if passkeys don't match. */
    return true;
  };
};

/** Handler class for characteristic actions */
class CharacteristicCallbacks : public NimBLECharacteristicCallbacks {
  void onRead(NimBLECharacteristic* pCharacteristic) {
    wroteValueToClient = true;
  };

  void onWrite(NimBLECharacteristic* pCharacteristic) {
    receivedValueFromClient = true;
    receivedValue = pCharacteristic->getValue<int>();
  };
  void onNotify(NimBLECharacteristic* pCharacteristic) {
    Serial.println("Sending notification to clients");
  };
};


static CharacteristicCallbacks chrCallbacks;


void setup() {
  Serial.begin(57600);
  Serial.println("Starting NimBLE Server");

  NimBLEDevice::init("SageBot");
  NimBLEDevice::setPower(ESP_PWR_LVL_P9); /** +9db */

  /** Set the IO capabilities of the device, each option will trigger a different pairing method.
     *  BLE_HS_IO_DISPLAY_ONLY    - Passkey pairing
     *  BLE_HS_IO_DISPLAY_YESNO   - Numeric comparison pairing
     *  BLE_HS_IO_NO_INPUT_OUTPUT - DEFAULT setting - just works pairing
     */
  //NimBLEDevice::setSecurityIOCap(BLE_HS_IO_DISPLAY_ONLY); // use passkey
  //NimBLEDevice::setSecurityIOCap(BLE_HS_IO_DISPLAY_YESNO); //use numeric comparison

  /** 2 different ways to set security - both calls achieve the same result.
     *  no bonding, no man in the middle protection, secure connections.
     *
     *  These are the default values, only shown here for demonstration.
     */
  //NimBLEDevice::setSecurityAuth(false, false, true);
  NimBLEDevice::setSecurityAuth(/*BLE_SM_PAIR_AUTHREQ_BOND | BLE_SM_PAIR_AUTHREQ_MITM |*/ BLE_SM_PAIR_AUTHREQ_SC);

  pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());

// https://www.uuidgenerator.net/
#define SERVICE_UUID "8c258f43-f727-4566-98ee-7839e7528f42"
#define WRITE_UUID "d3689185-62fe-4313-8c3b-8bcb44efb884"
#define READ_UUID "a3cb3ca8-5166-445c-a09d-a072d6a96719"

  NimBLEService* pService = pServer->createService(SERVICE_UUID);

  NimBLECharacteristic* pWriteCharacteristic = pService->createCharacteristic(WRITE_UUID, NIMBLE_PROPERTY::WRITE);
  pWriteCharacteristic->setCallbacks(&chrCallbacks);

  NimBLECharacteristic* pReadCharacteristic = pService->createCharacteristic(READ_UUID, NIMBLE_PROPERTY::READ);
  pReadCharacteristic->setCallbacks(&chrCallbacks);
  pReadCharacteristic->setValue<float>(3.14);

  pService->start();

  NimBLEAdvertising* pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(pService->getUUID());

  /** If your device is battery powered you may consider setting scan response
     *  to false as it will extend battery life at the expense of less data sent.
     */
  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Serial.println("Advertising Started");
}


void loop() {
  if (pServer->getConnectedCount()) {
    if (wroteValueToClient) {
      wroteValueToClient = false;
      Serial.println("Wrote value to client.");
    }

    if (receivedValueFromClient) {
      receivedValueFromClient = false;
      Serial.print(receivedValue);
      Serial.println(" was received from the client.");
    }
  }

  delay(2000);
}
