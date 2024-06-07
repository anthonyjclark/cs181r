#ifndef NIMBLE_BLUETOOTH_H
#define NIMBLE_BLUETOOTH_H

#include <NimBLEDevice.h>

bool deviceConnected = false;
bool oldDeviceConnected = false;
int motorWebSpeedPercentRight;
int motorWebSpeedPercentLeft;

class SpeedCharacteristicCallbacks : public NimBLECharacteristicCallbacks
{

    void onWrite(NimBLECharacteristic *pSpeedCharacteristic)
    {
        float speed = (pSpeedCharacteristic->getValue())[0]; // Get the value of the speed characteristic as a float
        if (speed > 155)
        {
            speed = speed - 256;
        }
        if (isRightMotorCallback_)
        {
            motorWebSpeedPercentRight = speed;
        }
        else
        {
            motorWebSpeedPercentLeft = speed;
        }
    }

public:
    bool isRightMotorCallback_;
    SpeedCharacteristicCallbacks(bool right)
        : isRightMotorCallback_(right), NimBLECharacteristicCallbacks() {}
};

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

void playTone(int tone, int duration, uint8_t pin)
{
    for (long i = 0; i < duration * 1000L; i += tone * 2)
    {
        digitalWrite(pin, HIGH);
        delayMicroseconds(tone);
        digitalWrite(pin, LOW);
        delayMicroseconds(tone);
    }
}

void playNote(char note, int duration, uint8_t pin)
{
    char names[] = {'C', 'D', 'E', 'F', 'G', 'A', 'B',
                    'c', 'd', 'e', 'f', 'g', 'a', 'b',
                    'x', 'y'};
    int tones[] = {1915, 1700, 1519, 1432, 1275, 1136, 1014,
                   956, 834, 765, 593, 468, 346, 224,
                   655, 715};

    // play the tone corresponding to the note name
    for (int i = 0; i < 16; i++)
    {
        if (names[i] == note)
        {
            int newduration = duration;
            playTone(tones[i], newduration, pin);
        }
    }
}

#endif // NIMBLE_BLUETOOTH_H