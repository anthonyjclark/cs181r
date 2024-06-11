// This code assumes you are using the Xiao Expansion board

#include <Arduino.h>
#include <U8x8lib.h>
#include <Wire.h>

// Display setup
U8X8_SSD1306_128X64_NONAME_HW_I2C display(SCL, SDA, U8X8_PIN_NONE);

// Speaker setup

#define SPEAKER_PIN A3
#define SONG_LENGTH sizeof(beats)

char notes[] = "GGAGcB GGAGdc GGxecBA yyecdc";
int beats[] = {2, 2, 8, 8, 8, 16, 1, 2, 2, 8, 8, 8, 16, 1, 2, 2, 8, 8, 8, 8, 16, 1, 2, 2, 8, 8, 8, 16};
int tempo = 150;

void playTone(int tone, int duration)
{
  for (long i = 0; i < duration * 1000L; i += tone * 2)
  {
    digitalWrite(SPEAKER_PIN, HIGH);
    delayMicroseconds(tone);
    digitalWrite(SPEAKER_PIN, LOW);
    delayMicroseconds(tone);
  }
}

void playNote(char note, int duration)
{
  char names[] = {'C', 'D', 'E', 'F', 'G', 'A', 'B', 'c', 'd', 'e', 'f', 'g', 'a', 'b', 'x', 'y'};
  int tones[] = {1915, 1700, 1519, 1432, 1275, 1136, 1014, 956, 834, 765, 593, 468, 346, 224, 655, 715};
  int SPEE = 5;

  // play the tone corresponding to the note name
  for (int i = 0; i < 16; i++)
  {
    if (names[i] == note)
    {
      int newDuration = duration / SPEE;
      playTone(tones[i], newDuration);
    }
  }
}

void setup(void)
{
  display.begin();
  display.setFlipMode(1); // Display orientation
  pinMode(SPEAKER_PIN, OUTPUT);
}

void loop(void)
{
  display.setFont(u8x8_font_chroma48medium8_r);
  display.setCursor(0, 0);
  display.print("Hello!");
  delay(1000);
  display.clear();
  display.print("Happy Birthday!");
  delay(1000);

  for (int i = 0; i < SONG_LENGTH; i++)
  {
    if (notes[i] == ' ')
    {
      delay(beats[i] * tempo);
    }
    else
    {
      playNote(notes[i], beats[i] * tempo);
    }
    delay(tempo);
  }
}
