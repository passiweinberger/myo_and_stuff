var Myo = require('myo');

//Start talking with Myo Connect
Myo.connect('com.passiweinberger.TestMyo001');

Myo.on('fist', function(){
    console.log('Hello Myo!');
    this.vibrate();
});