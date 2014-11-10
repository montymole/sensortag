var TIBase = ['f000', '04514000b000000000000000'];

//based on http://processors.wiki.ti.com/images/a/a8/BLE_SensorTag_GATT_Server.pdf
var sensorTagAttributeTable = {


    //TYPE(hex string): [TYPE(text), DESCRIPTION]


    "2A23": ['System ID'],
    "2A24": ['Model Number String', , '4E:2E:41:2E:00'],
    "2A25": ['Serial Number String', , '4E:2E:41:2E:00 '],
    "2A26": ['Firmware Revision String'],
    "2A27": ['Hardware Revision String'],
    "2A28": ['Software Revision String'],
    "2A29": ['Manufacturer Name String'],
    "2A2A": ['IEEE11073-20601 Regulatory '],
    "2A50": ['PnP ID'],


    AA01: ['IR Temperature Data', 'Object LSB : Object MSB : Ambient LSB : Ambient MSB'],
    AA02: ['IR Temperature Config', 'Write "01" to start Sensor and Measurements,"00" to put to sleep'],
    AA03: ['IR Temperature Period', 'Period = [Input*10]ms, (lowerlimit 300 ms), default 1000 ms'],
    AA11: ['Accelerometer Data', 'X: Y: Z Coordinates'],
    AA12: ['Accelerometer Config', 'Write"01"to selectrange2G,"02" for 4G, "03"for8G,"00" disable sensor'],
    AA13: ['Accelerometer Period', 'Period =[Input*10]ms,(lowerlimit 100ms),default1000ms'],
    AA21: ['Humidity Data', 'TempLSB:TempMSB:HumidityLSB:HumidityMSB'],
    AA22: ['Humidity Config', 'Write"01"to startmeasurements, "00"tostop'],
    AA23: ['Humidity Preioid', 'Period =[Input*10]ms,(lowerlimit 100 ms),default1000 ms'],
    AA31: ['Magnetometer Data', 'XLSB:XMSB:YLSB:YMSB:ZLSB:ZMSBCoordinates'],
    AA32: ['Magnetometer Config', 'Write"01"to startSensorandMeasurements,"00"toputto sleep'],
    AA33: ['Magnetometer Period', 'Period =[Input*10]ms(lower limit100ms),default 2000ms'],
    AA41: ['Barometer Data', 'TempLSB:TempMSB:PressureLSB:PressureMSB'],
    AA42: ['Barometer Configuration', 'Write"01"to startSensorandMeasurements,"00"toputto sleep, "02"to readcalibrationvaluesfrom sensor'],
    AA44: ['Barometer Period', 'Period =[Input*10]ms,(lowerlimit 100 ms),default1000 ms'],
    AA43: ['Barometer Calibration', 'Whenwrite"02"toBarometer conf.hasbeen issued,the calibrationvaluesisfoundhere.'],
    AA51: ['Gyroscope Data', 'XLSB:XMSB:YLSB:YMSB:ZLSB:ZMSB'],
    AA52: ['Gyroscope Config', 'Write0toturnoffgyroscope,1to enableXaxisonly,2to enable Yaxis only,3=X andY,4= Zonly,5=X and Z,6=Y'],
    AA53: ['Gyroscope Period', 'Period =[Input*10]ms(lower limit100ms),default 1000ms'],
    AA61: ['TestData', 'Self-test results (highbitindicatesPASSED):Bit 0:IRtemp,1:Humidity,2:Magnetometer,3:accelerometer,4:Barometer,5:Gyroscope'],
    AA62: ['Test Config', 'bit 7: enable testmode; bit 0-1LED bit mask'],
    CCC1: ['Connection Parameters', 'ConnInterval,SlaveLatency,SupervisionTimeout(2 byteseach)'],
    CCC2: ['Request Connection Parameters', 'MinConnInterval,MaxConnInterval,SlaveLatency,SupervisionTimeout(2 byteseach)'],
    CCC3: ['Disconnect request', 'Change thevaluetodisconnect'],
    FFC1: ['OADImage Identify', 'Write "0" to identify image type "A", "1" to identify "B". Data in notification 8 bytes: imagetype(2), size/4(2),userdata(4).'],
    FFC2: ['OADImage Block', 'Imageblock(18bytes).Blockno. (2 bytes),OADimage block (16 bytes)'],
    FFE1: ['Unkown1']

};


function getTiAttribute(uuid) {

    var id = uuid.replace(TIBase[0], '').replace(TIBase[1], '').toUpperCase();

    return [uuid, id].concat(sensorTagAttributeTable[id]);

}

function SensorTag(p) {

    this.p = p;

}

SensorTag.prototype = {

    addCharacteristic: function(ch) {

        var tiAttr = getTiAttribute(ch.uuid);

        if (tiAttr) {

            var fName = tiAttr[2].split(' ').join('');

            this[fName] = {
                ch: ch,
                info: tiAttr
            }

            console.log(tiAttr, ch.properties);

            // console.log('->',tiAttr);

        } else {
            console.log('unknown charactersitc')
        }

    }
}


function startProbing(st) {

    st.SystemID.ch.read(function(error, data) {
        console.log(error, 'SystemId--->', data);
    });

    st.ModelNumberString.ch.read(function(error, data) {
        console.log(error, 'ModelNumberString--->', data);
    });

    st.SerialNumberString.ch.read(function(error, data) {
        console.log(error, 'SerialNumberString--->', data);
    });

    st.FirmwareRevisionString.ch.read(function(error, data) {
        console.log(error, 'FirmwareRevisionString--->', data);
    });

    //start measurements
    st.IRTemperatureData.ch.notify(true, function(error) {
        console.log('notified', error)
    });

    var onBuf = new Buffer(1);
    onBuf[0] = 0x01;

    //SET ON
    st.IRTemperatureConfig.ch.write(onBuf, true);
    st.IRTemperatureConfig.ch.read(function(error, data) {
        console.log(error, 'IRTemperatureConfig--->', data);
    });


    var getTemp = function() {



        st.IRTemperatureData.ch.read(function(error, data) {
            console.log('IRTemperatureData->', data);
        });
        setTimeout(getTemp, 1000);
    };

    getTemp();

}



var noble = require('noble'),

    sensorTags = [];

noble.on('discover', function(P) {


    if (P) {

        console.log('sensortag found: ' + P);

        var sensorTag = new SensorTag(P);

        sensorTag.idx = sensorTags.length;

        sensorTags.push(sensorTag);

        P.connect(function(error) {

            if (error) {

                console.error(error);

            } else {

                console.log('STATE', P.uuid, ':', P.state);

                P.updateRssi(function(error, rssi) {
                    sensorTag.rssi = rssi;
                });

                P.discoverAllServicesAndCharacteristics(function(error, srvs, cha) {

                    var srv;

                    while (srvs.length) {

                        srv = srvs.shift();

                        console.log(srv.uuid, srv.name, srv.type);

                        while (srv.characteristics.length) {

                            sensorTag.addCharacteristic(srv.characteristics.shift());

                        }

                    }

                    startProbing(sensorTag);


                });
            }
        });


    }

});

noble.startScanning();
