#include <Arduino.h>
#include <ArduinoJson.h>

#include <ESP8266WiFi.h>
#include <ESP8266WiFiMulti.h>

#include <WebSocketsClient.h>

#include <Hash.h>

ESP8266WiFiMulti WiFiMulti;
WebSocketsClient webSocket;

#define UD 
#define LD 
#define SDS
#define OD
#define CD



bool conn = false;
String data = "";

#define USE_SERIAL Serial

void webSocketEvent(WStype_t type, uint8_t * payload, size_t length) {

  switch(type) {
    case WStype_DISCONNECTED:
      USE_SERIAL.printf("[WSc] Disconnected!\n");
      conn = false;
      break;
    case WStype_CONNECTED: 
      USE_SERIAL.printf("[WSc] Connected to url: %s\n", payload);
      conn = true;

      // send message to server when Connected
      webSocket.sendTXT("Connected");
    
      break;
    case WStype_TEXT:{
      DynamicJsonDocument doc(200);
      DeserializationError error = deserializeJson(doc, payload);

      if (error) {
        Serial.print(F("deserializeJson() failed: "));
        Serial.println(error.f_str());
        return;
      }

      String UUID = doc["UUID"];

      if(UUID == "0578d33e-0f83-411d-91e8-a6eb3add4432")
      {
        digitalWrite(LED_BUILTIN, LOW);
        Serial.println("Led on");
      }

      if(UUID == "c2d4e359-1171-44c0-b1c7-4ab44b9de44a")
      {
        digitalWrite(LED_BUILTIN, HIGH);
        Serial.println("Led off");
      }

      if(UUID == "98e6e883-6b15-46e5-9fc8-9aef8116e47c")
      {
        SDS
      }

      
      USE_SERIAL.printf("[WSc] get text: %s\n", payload);

      // send message to server
      // webSocket.sendTXT("message here");
      break;}
    case WStype_BIN:
      USE_SERIAL.printf("[WSc] get binary length: %u\n", length);
      hexdump(payload, length);

      // send data to server
      // webSocket.sendBIN(payload, length);
      break;
     case WStype_PING:
         // pong will be send automatically
         USE_SERIAL.printf("[WSc] get ping\n");
         break;
     case WStype_PONG:
         // answer to a ping we send
         USE_SERIAL.printf("[WSc] get pong\n");
         break;
    }

}

void setup() {
  // USE_SERIAL.begin(921600);
  USE_SERIAL.begin(115200);

  //Serial.setDebugOutput(true);
  USE_SERIAL.setDebugOutput(true);

  USE_SERIAL.println();
  USE_SERIAL.println();
  USE_SERIAL.println();

  for(uint8_t t = 4; t > 0; t--) {
    USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
    USE_SERIAL.flush();
    delay(1000);
  }

  
  pinMode(LED_BUILTIN , OUTPUT);

  WiFiMulti.addAP("DESKTOP-RJ3V64G", "12345678");

  //WiFi.disconnect();
  while(WiFiMulti.run() != WL_CONNECTED) {
    delay(100);
  }

  // server address, port and URL
  webSocket.begin("192.168.0.19", 4999, "/");

  // event handler
  webSocket.onEvent(webSocketEvent);

  // use HTTP Basic Authorization this is optional remove if not needed
  //webSocket.setAuthorization("user", "Password");

  // try ever 5000 again if connection has failed
  webSocket.setReconnectInterval(5000);
  
  // start heartbeat (optional)
  // ping server every 15000 ms
  // expect pong from server within 3000 ms
  // consider connection disconnected if pong is not received 2 times
  webSocket.enableHeartbeat(15000, 3000, 2);

}

void loop() {
    webSocket.loop();
    //if (digitalRead(btnPin)){
    //  webSocket.sendTXT("{}");
    //}
    if (conn && Serial.available() > 0){
      data = Serial.readString();
      webSocket.sendTXT(data);
         
    }
}
