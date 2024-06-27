#include <SPI.h>
#include <TFT_eSPI.h>
#include <qrcode_espi.h>

#include <Wire.h>
#include "MAX30105.h"
#include "heartRate.h"
#include "spo2_algorithm.h"

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// tft initialization
TFT_eSPI tft = TFT_eSPI();
QRcode_eSPI qrcode(&tft);
const String mac = WiFi.macAddress();

// wifi initialization
const char *ssid = "zt";
const char *password = "zihoistudy";
const char *worldTime = "http://worldtimeapi.org/api/timezone/Asia/Shanghai";
const char *host = "http://172.20.10.3:890/healthInfo/esp32Data";

// sensor initialization
MAX30105 particleSensor;
long lastBeat = 0;

void setup() {
  Serial.begin(115200);

  // tft configuration
  tftSetup();

  // Wifi Connection
  wifiSetup();

  // sensor configuration
  sensorSetup();
}

void tftSetup() {
  tft.init();
  qrcode.init();

  // create qrcode for mac address
  qrcode.create(mac);
}

void wifiSetup() {
  Serial.println();
  Serial.println("******************************************************");
  Serial.print("Connecting to ");
  Serial.println(ssid);

  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("");
  Serial.println("WiFi connected");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
}

void sensorSetup() {
  // sensor configuration
  if (particleSensor.begin(Wire, I2C_SPEED_FAST) == false) {
    Serial.println("MAX30105 was not found. Please check wiring/power.");
    while (1)
      ;
  }

  byte ledBrightness = 60;  //Options: 0=Off to 255=50mA
  byte sampleAverage = 4;   //Options: 1, 2, 4, 8, 16, 32
  byte ledMode = 2;         //Options: 1 = Red only, 2 = Red + IR, 3 = Red + IR + Green
  byte sampleRate = 100;    //Options: 50, 100, 200, 400, 800, 1000, 1600, 3200
  int pulseWidth = 411;     //Options: 69, 118, 215, 411
  int adcRange = 4096;      //Options: 2048, 4096, 8192, 16384

  particleSensor.setup(ledBrightness, sampleAverage, ledMode, sampleRate, pulseWidth, adcRange);  //Configure sensor with these settings
  particleSensor.enableDIETEMPRDY();
}

String getTime() {
  // start connection
  HTTPClient http;
  http.begin(worldTime);

  // Send HTTP GET request
  int httpResponseCode = http.GET();

  if (httpResponseCode > 0) {
    String payload = http.getString();

    // Free resources
    http.end();

    // deserialize JSON data
    DynamicJsonDocument doc(1024);
    deserializeJson(doc, payload);
    return doc["datetime"].as<String>();

  } else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
    return "-1";
  }
}

void sendRequest(String jsonString) {
  //Check WiFi connection status
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    WiFiClient client;
    http.begin(client, host);
    http.addHeader("Content-Type", "application/json");

    // Send HTTP POST request
    int httpResponseCode = http.POST(jsonString);
    Serial.print("Request sent. HTTP Response code: ");
    Serial.println(httpResponseCode);

    // Free resources
    http.end();
  } else {
    Serial.println("WiFi Disconnected");
  }
}

String getString() {
  // start sensing
  Serial.println("Start Sensing...");

  // get sensing data and check validity
  float temp = getTempearture();
  //while (temp == -1)
  //  temp = getTempearture();
  Serial.println("Temperature sensed.");

  float bpm = getHeartRate();
  //while (bpm == -1)
  //  bpm = getHeartRate();
  Serial.println("Heart rate sensed.");

  int spo2 = getOxygen();
  //while (spo2 == -1)
  //  spo2 = getOxygen();
  Serial.println("Blood oxygen sensed.");

  String time = getTime();

  // output the result
  Serial.print(time);
  Serial.print(" bpm: ");
  Serial.print(bpm);
  Serial.print(", temp: ");
  Serial.print(temp);
  Serial.print(", spo2: ");
  Serial.println(spo2);

  // create a JSON object
  DynamicJsonDocument jsonDoc(1024);

  jsonDoc["deviceID"] = mac;
  jsonDoc["heartRate"] = bpm;
  jsonDoc["temperature"] = temp;
  jsonDoc["oxygen"] = spo2;
  jsonDoc["timestamp"] = time;

  // serialize JSON object
  String jsonString;
  serializeJson(jsonDoc, jsonString);
  return jsonString;
}

float getTempearture() {
  float temp = particleSensor.readTemperature();
  if (temp < 30 || temp > 43) // invalid sensed data
    return -1;
  return temp;
}

float getHeartRate() {
  float BPM;
  long delta;
  long irValue = particleSensor.getIR();

  while (!checkForBeat(irValue)) {  // sense a beat
    irValue = particleSensor.getIR();
  }

  delta = millis() - lastBeat;
  lastBeat = millis();
  BPM = 60 / (delta / 1000.0);

  if (BPM < 60 || BPM > 160) // invalid sensed data
    return -1;

  return BPM;
}

int getOxygen() {
  int32_t bufferLength;   //data length
  int32_t spo2;           //SPO2 value
  int8_t validSPO2;       //indicator to show if the SPO2 calculation is valid
  int32_t heartRate;      //heart rate value
  int8_t validHeartRate;  //indicator to show if the heart rate calculation is valid

  bufferLength = 50;        //buffer length of 100 stores 4 seconds of samples running at 25sps
  uint32_t irBuffer[100];   //infrared LED sensor data
  uint32_t redBuffer[100];  //red LED sensor data

  //read the first 100 samples, and determine the signal range
  for (byte i = 0; i < bufferLength; i++) {
    while (particleSensor.available() == false)  //do we have new data?
      particleSensor.check();                    //Check the sensor for new data

    redBuffer[i] = particleSensor.getRed();
    irBuffer[i] = particleSensor.getIR();
    particleSensor.nextSample();  //We're finished with this sample so move to next sample
  }

  //calculate heart rate and SpO2 after first 100 samples (first 4 seconds of samples)
  maxim_heart_rate_and_oxygen_saturation(irBuffer, bufferLength, redBuffer, &spo2, &validSPO2, &heartRate, &validHeartRate);

  if (validSPO2 == 0) // invalid sensed data
    return -1;
  return spo2;
}

void loop() {
  Serial.println();
  String jsonString = getString();
  sendRequest(jsonString);
  delay(1000);
}
