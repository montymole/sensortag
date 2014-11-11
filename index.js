var noble = require('noble'),
    SensorTag = require('./sensortag.js').SensorTag,
    sensorTags = [];

function outputValue(st, cname, err, v) {
    var t = new Date();
    console.log(t.getTime(), cname, v);
}


function startProbing(st) {

    var onBit = new Buffer([0x01]),
        offBit = new Buffer([0x00]);

    st.getSystemId(outputValue);

    st.getModelNumberString(outputValue);

    st.getSerialNumberString(outputValue);

    st.getFirmwareRevisionString(outputValue);

    st.startIRTemperature(function() {
        st.getIRTemperatureConfig(outputValue);
    });

    function probe() {
        st.getIRTemperatureData(outputValue);
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
