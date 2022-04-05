#include <EEPROM.h>
String serialData = "";
char charBuf[80];
String memoryData = "";

uint addr = 0;
  
struct {
  uint val = 0;
  char str[80] = "";
} data;

void setup()
{
  Serial.begin(9600);
  EEPROM.begin(512);

  // load EEPROM data into RAM, see it
  //EEPROM.get(addr,data);
  //Serial.println("Found: "+String(data.val)+","+String(data.str));  

  // change data in RAM 
  //data.val += 5;
  //strncpy(data.str,"hello",20);

  // replace values in EEPROM
  //EEPROM.put(addr,data);
  //EEPROM.commit();

  // clear data in RAM
  //data.val = 0; 
  //strncpy(data.str,"",20);

  // reload data for EEPROM, see the change
  //EEPROM.get(addr,data);
  //Serial.println("New values are: "+String(data.val)+","+String(data.str));
}

void loop()
{
  if(Serial.available())
    {
        //Читаю с порта
        serialData = Serial.readString();
        Serial.flush();
        //Гружу строку в char 
        serialData.toCharArray(charBuf, 80);
        //Форматирую строку
        //serialData = serialData.substring(0, serialData.length()-1);
        //Работаю с оперативной памятью перед загрузкой
        data.val += 1;
        strncpy(data.str,charBuf,80);
        //Заливаю данные в EEPROM
        EEPROM.put(addr,data);
        EEPROM.commit();
        //Очищаю оперативную память
        data.val = 0;
        strncpy(data.str,"",80);
        //Выключаю на минуту
        Serial.end();
        //delay(3);
        ESP.deepSleep(5e6);
        Serial.begin(9600);
        //Достаю из памяти
        EEPROM.get(addr,data);
        Serial.print("{" + String(data.str).substring(0, serialData.length()-1) + "}");
        
    }
}
