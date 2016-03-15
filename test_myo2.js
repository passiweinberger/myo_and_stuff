#!/bin/node

// See: http://diagnostics.myo.com/
// http://developerblog.myo.com/myo-unleashed-myo-js/

var Myo = require('myo');

Myo.onError = function () {  
        console.log("Woah, couldn't connect to Myo Connect");
}

//Start talking with Myo Connect
Myo.connect('com.passiweinberger.TestMyo001');


Myo.on('connected', function(){
	console.log("connected to:", this.macAddress);  
    var myMyo = this;
    addEvents(myMyo);
});
var addEvents = function(myo){
    var imu_enabled = false;  
    var detect_punches = false;
    var punchTime = 0;
    var this_battery_lvl = null;

    myo.on('ready', function(){
        console.log('ready for:', this.macAddress);
        // enable EMG stream:
        this.streamEMG(true); console.log("EMG enabled for:", this.macAddress);
        this.vibrate();
    });
    myo.on('disconnect', function(){
        console.log('disconnect for:', this.macAddress);
    });
    myo.on('frame', function(frame){
        console.log('Frame id: ' + frame.id + ', timestamp: ' + frame.timestamp);
    });
    myo.on('fist', function(){
        console.log('fist for:', this.macAddress);
        this.streamEMG(true); console.log("EMG enabled for:", this.macAddress);
        this.vibrate();
    });
    myo.on('fingers_spread', function(){
        console.log('fingers_spread for:', this.macAddress);
        this.streamEMG(false); console.log("EMG disabled for:", this.macAddress);
        this.requestBatteryLevel();
        this.vibrate();
    });
    myo.on('wave_out', function(){
        console.log('wave_out for:', this.macAddress);
        imu_enabled = false; console.log("IMU disabled for:", this.macAddress);
        this.vibrate();
    });
    myo.on('wave_in', function(){
        console.log('wave_in for:', this.macAddress);
        imu_enabled = true; console.log("IMU enabled for:", this.macAddress);
        this.vibrate();
    });
    myo.on('tab', function(){
        console.log('tab for:', this.macAddress);
        this.vibrate();
    });
    myo.on('imu', function(data){  
        if (imu_enabled) { console.log('imu:', data); };
    });
    /* Individuals:
    // Stream Orientation
    Myo.on('orientation', function(data){  
        console.log('orientation:', data);
    });

    // Stream Accelerometer
    Myo.on('accelerometer', function(data){  
        console.log('accelerometer:', data);
    });

    // Stream Gyroscope
    Myo.on('gyroscope', function(data){  
        console.log('gyroscope:', data);
    });
    */
    // stream EMG  
    myo.on('emg', function(data){  
        console.log('EMG:', data);
    });
    // Detect sudden movements in 3D:
    if (detect_punches) {  
        myo.on('imu', function(data) {  
               var time = (new Date()).getTime();
               if ((punchTime < time - 1000 && data.accelerometer.x < -1.0)) {
                      console.log("PUNCH: X!");
                      punchTime = time;
               };
        });
        myo.on('imu', function(data) {  
               var time = (new Date()).getTime();
               if ((punchTime < time - 1000 && data.accelerometer.y < -1.0)) {
                      console.log("PUNCH: Y!");
                      punchTime = time;
               };
        });
        myo.on('imu', function(data) {  
               var time = (new Date()).getTime();
               if ((punchTime < time - 1000 && data.accelerometer.z < -1.0)) {
                      console.log("PUNCH: Z!");
                      punchTime = time;
               };
        });
    };
    // Battery-Level:
    myo.on('battery_level', function(data){ 
        this.vibrate(); 
        console.log('battery_level:', data);
        if (!this_battery_lvl && this_battery_lvl !== data) { 
            this_battery_lvl = data;
            console.log('NEW battery_level:', data); 
        };
    });


};





