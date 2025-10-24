#include <WiFi.h>
#include <HTTPClient.h>
#include <ESPSupabase.h>

const char* ssid = "A";
const char* password = "12345678";

String supabase_url = "https://hbamjfskfcatsnboenmr.supabase.co";
String anon_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiYW1qZnNrZmNhdHNuYm9lbm1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg3MTY3NTEsImV4cCI6MjA3NDI5Mjc1MX0.TtMGDbhQVBvq9UsilKPefYbaatEaPF7s2ciimDf-bP8";  
String table_name = "parkingg";

Supabase db;

// --- Pin ultrasonic ---
#define TRIG1 16
#define ECHO1 17

#define TRIG2 19
#define ECHO2 21

#define TRIG3 22
#define ECHO3 23

#define TRIG4 25
#define ECHO4 26

#define TRIG5 32
#define ECHO5 35

// Fungsi hitung jarak ultrasonic
long readUltrasonic(int trigPin, int echoPin) {
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
long dur = pulseIn(echoPin, HIGH, 20000);
return (long)(dur \* 0.0343 / 2.0); // cm
}

void setup() {
Serial.begin(115200);

pinMode(TRIG1, OUTPUT); pinMode(ECHO1, INPUT);
pinMode(TRIG2, OUTPUT); pinMode(ECHO2, INPUT);
pinMode(TRIG3, OUTPUT); pinMode(ECHO3, INPUT);
pinMode(TRIG4, OUTPUT); pinMode(ECHO4, INPUT);
pinMode(TRIG5, OUTPUT); pinMode(ECHO5, INPUT);

WiFi.begin(ssid, password);
Serial.print("Menyambungkan WiFi");
while (WiFi.status() != WL_CONNECTED) {
delay(500);
Serial.print(".");
}
Serial.println("\nWiFi Tersambung!");

db.begin(supabase_url, anon_key);
}

void loop() {
long jarak1 = readUltrasonic(TRIG1, ECHO1);
long jarak2 = readUltrasonic(TRIG2, ECHO2);
long jarak3 = readUltrasonic(TRIG3, ECHO3);
long jarak4 = readUltrasonic(TRIG4, ECHO4);
long jarak5 = readUltrasonic(TRIG5, ECHO5);

String status1 = (jarak1 <= 7) ? "Terisi" : "Kosong";
String status2 = (jarak2 <= 7) ? "Terisi" : "Kosong";
String status3 = (jarak3 <= 7) ? "Terisi" : "Kosong";
String status4 = (jarak4 <= 7) ? "Terisi" : "Kosong";
String status5 = (jarak5 <= 7) ? "Terisi" : "Kosong";

// --- Tampilkan ke Serial Monitor ---
Serial.printf("Slot1: %s (%ld cm)\n", status1.c_str(), jarak1);
Serial.printf("Slot2: %s (%ld cm)\n", status2.c_str(), jarak2);
Serial.printf("Slot3: %s (%ld cm)\n", status3.c_str(), jarak3);
Serial.printf("Slot4: %s (%ld cm)\n", status4.c_str(), jarak4);
Serial.printf("Slot5: %s (%ld cm)\n", status4.c_str(), jarak5);

if (WiFi.status() == WL_CONNECTED) {
// Update slot 1
String payload1 = "{\"status\":\"" + status1 + "\", \"jarak\": " + String(jarak1) + "}";
int code1 = db.update(table_name.c_str()).eq("id", "1").doUpdate(payload1);
Serial.printf("Update slot1 → kode: %d\n", code1);
db.urlQuery_reset();

    // Update slot 2
    String payload2 = "{\"status\":\"" + status2 + "\", \"jarak\": " + String(jarak2) + "}";
    int code2 = db.update(table_name.c_str()).eq("id", "2").doUpdate(payload2);
    Serial.printf("Update slot2 → kode: %d\n", code2);
    db.urlQuery_reset();

    // Update slot 3
    String payload3 = "{\"status\":\"" + status3 + "\", \"jarak\": " + String(jarak3) + "}";
    int code3 = db.update(table_name.c_str()).eq("id", "3").doUpdate(payload3);
    Serial.printf("Update slot3 → kode: %d\n", code3);
    db.urlQuery_reset();

    // Update slot 4
    String payload4 = "{\"status\":\"" + status4 + "\", \"jarak\": " + String(jarak4) + "}";
    int code4 = db.update(table_name.c_str()).eq("id", "4").doUpdate(payload4);
    Serial.printf("Update slot4 → kode: %d\n", code4);
    db.urlQuery_reset();

    // Update slot 5
    String payload5 = "{\"status\":\"" + status5 + "\", \"jarak\": " + String(jarak5) + "}";
    int code5 = db.update(table_name.c_str()).eq("id", "5").doUpdate(payload5);
    Serial.printf("Update slot5 → kode: %d\n", code5);
    db.urlQuery_reset();

}

delay(500); // kirim tiap 2 detik
}
