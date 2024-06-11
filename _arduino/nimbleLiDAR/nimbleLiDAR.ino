#include <Wire.h>
#include <NimBLEDevice.h>
#include <SparkFun_VL53L5CX_Library.h> //http://librarymanager/All#SparkFun_VL53L5CX

#define SERVICE_UUID "19b10000-e8f2-537e-4f6c-d104768a1214"
#define LIDAR_CHARACTERISTIC_UUID "19b10001-e8f2-537e-4f6c-d104768a1214"

static NimBLEServer *pServer;

SparkFun_VL53L5CX myImager;
VL53L5CX_ResultsData measurementData; // Result data class structure, 1356 byes of RAM

int imageResolution = 0; // Used to pretty print output
int imageWidth = 0;      // Used to pretty print output

bool deviceConnected = false;

long measurements = 0;         // Used to calculate actual output rate
long measurementStartTime = 0; // Used to calculate actual output rate

int depthValue[64]; // Array to hold LiDAR data

NimBLECharacteristic *pDepthValueCharacteristic = NULL;

class ServerCallbacks : public NimBLEServerCallbacks
{
  void onConnect(NimBLEServer *pServer)
  {
    deviceConnected = true;
  };
  void onDisconnect(NimBLEServer *pServer)
  {
    deviceConnected = false;
    NimBLEDevice::startAdvertising();
  };
};

void setup()
{
  Serial.begin(115200);

  NimBLEDevice::init("LiDAR");

  pServer = NimBLEDevice::createServer();
  pServer->setCallbacks(new ServerCallbacks());
  NimBLEService *pService = pServer->createService(SERVICE_UUID);
  pDepthValueCharacteristic = pService->createCharacteristic(LIDAR_CHARACTERISTIC_UUID, NIMBLE_PROPERTY::READ | NIMBLE_PROPERTY::NOTIFY);
  pDepthValueCharacteristic->notify(true);
  pService->start();

  NimBLEAdvertising *pAdvertising = NimBLEDevice::getAdvertising();
  pAdvertising->addServiceUUID(pService->getUUID());
  pAdvertising->setScanResponse(true);
  pAdvertising->start();

  Wire.begin();

  Serial.println("Initializing sensor board. This can take up to 10s. Please wait.");
  if (myImager.begin() == false)
  {
    Serial.println(F("Sensor not found - check your wiring. Freezing"));
    while (1)
      ;
  }

  myImager.setResolution(8 * 8); // Enable all 64 pads

  imageResolution = myImager.getResolution(); // Query sensor for current resolution - either 4x4 or 8x8
  imageWidth = sqrt(imageResolution);         // Calculate printing width

  myImager.setRangingFrequency(15); // Set Hz refresh frequency
  myImager.startRanging();
  measurementStartTime = millis();
}

void loop()
{
  // Poll sensor for new data
  if (myImager.isDataReady() == true)
  {
    if (myImager.getRangingData(&measurementData)) // Read distance data into array
    {

      int arrIndex = 0;
      // The ST library returns the data transposed from zone mapping shown in datasheet
      // Pretty-print data with increasing y, decreasing x to reflect reality
      for (int y = 0; y <= imageWidth * (imageWidth - 1); y += imageWidth)
      {
        for (int x = imageWidth - 1; x >= 0; x--)
        {
          depthValue[arrIndex] = measurementData.distance_mm[x + y];
          arrIndex++;
        }
      }
      Serial.println("Depth Values:");
      for (int i = 0; i < 64; i++)
      {
        Serial.print(depthValue[i]);
        Serial.print("\t");
        if ((i + 1) % 8 == 0)
        { // Print newline after every 8 values
          Serial.println();
        }
      }
      Serial.println();
      pDepthValueCharacteristic->setValue<int[64]>(depthValue);
      pDepthValueCharacteristic->notify(true);

      measurements++;
      float measurementTime = (millis() - measurementStartTime) / 1000.0;
      Serial.print("rate: ");
      Serial.print(measurements / measurementTime, 3);
      Serial.println("Hz");
    }
  }
  delay(5); // Small delay between polling
}
