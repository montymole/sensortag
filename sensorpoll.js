var noble = require('noble'),
    SensorTag = require('./sensortag.js').SensorTag,
    sensorTags = [],
    sensorReading = require('./db.js');


function outputValue(st, cname, err, v) {

    var data = new sensorReading({
        date: new Date().getTime(),
        sensorTagId: st.id,
        cname: cname,
        value: v
    });

    data.save(function(err) {
        if (!err) {
            console.log(data);
        } else {
            console.error(err);
        }
    });

}


function startProbing(st) {

    var onBit = new Buffer([0x01]),
        offBit = new Buffer([0x00]);

    st.getSystemId(function(st, cname, err, v) {
        st.id = v;
    });

    st.getModelNumberString(outputValue);

    st.getSerialNumberString(outputValue);

    st.getFirmwareRevisionString(outputValue);

    st.startIRTemperature(function() {
        st.getIRTemperatureConfig(outputValue);
    });

    st.startHumidity(function() {
        st.getHumidityConfig(outputValue);
    });

    st.getBarometerCalibration(function(st, cname, err, v) {
        outputValue(st, cname, err, v);
        st.startBarometer(function() {
            st.getBarometerConfig(outputValue);
        });
    });


    function probe() {
        st.getIRTemperatureData(outputValue);
        st.getHumidityData(outputValue);
        st.getBarometerData(outputValue);
    }

    setInterval(probe, 5000);

}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

noble.on('discover', function(P) {

    if (P) {
        var sensorTag = new SensorTag(P, startProbing);
        sensorTag.idx = sensorTags.length;
        sensorTags.push(sensorTag);
    }

});

console.log('SCANNING....');
noble.startScanning();
