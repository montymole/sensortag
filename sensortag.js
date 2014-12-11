var TIBase = ['f000', '04514000b000000000000000'],

    //based on http://processors.wiki.ti.com/images/a/a8/BLE_SensorTag_GATT_Server.pdf
    sensorTagAttributeTable = {

        //TYPE(hex string): [TYPE(text), DESCRIPTION]
        "2A00": ['DeviceName', 'TI BLE Sensor Tag'],
        "2A23": ['System ID'],
        "2A24": ['Model Number String', '4E:2E:41:2E:00'],
        "2A25": ['Serial Number String','4E:2E:41:2E:00 '],
        "2A26": ['Firmware Revision String'],
        "2A27": ['Hardware Revision String'],
        "2A28": ['Software Revision String'],
        "2A29": ['Manufacturer Name String'],
        "2A2A": ['IEEE11073-20601 Regulatory '],
        "2A50": ['PnP ID'],

        AA00: ['IR Temperature Service'],
        AA01: ['IR Temperature Data', 'ObjectLSB : ObjectMSB : AmbientLSB : AmbientMSB'],
        AA02: ['IR Temperature Config', 'Write "01" to start Sensor and Measurements,"00" to put to sleep'],
        AA03: ['IR Temperature Period', 'Period = [Input*10]ms, (lowerlimit 300 ms), default 1000 ms'],

        AA10: ['Accelerometer Service'],
        AA11: ['Accelerometer Data', 'X: Y: Z Coordinates'],
        AA12: ['Accelerometer Config', 'Write "01" to select range 2G, "02" for 4G, "03" for 8G, "00" disable sensor'],
        AA13: ['Accelerometer Period', 'Period = [Input*10]ms, (lowerlimit 100ms), default1000ms'],

        AA20: ['Humidity Service'],
        AA21: ['Humidity Data', 'TempLSB:TempMSB:HumidityLSB:HumidityMSB'],
        AA22: ['Humidity Config', 'Write"01"to startmeasurements, "00"tostop'],
        AA23: ['Humidity Period', 'Period =[Input*10]ms,(lowerlimit 100 ms),default1000 ms'],

        AA30: ['Magnetometer Service'],
        AA31: ['Magnetometer Data', 'XLSB:XMSB:YLSB:YMSB:ZLSB:ZMSBCoordinates'],
        AA32: ['Magnetometer Config', 'Write "01" to start Sensor and Measurements, "00" to put to sleep'],
        AA33: ['Magnetometer Period', 'Period =[Input*10]ms (lower limit100ms) ,default 2000ms'],

        AA40: ['Barometer Service'],
        AA41: ['Barometer Data', 'TempLSB:TempMSB:PressureLSB:PressureMSB'],
        AA42: ['Barometer Config', 'Write "01" to start Sensor and Measurements , "00" to put to sleep, "02" to read calibration values from sensor'],
        AA44: ['Barometer Period', 'Period =[Input*10]ms,(lowerlimit 100 ms),default1000 ms'],
        AA43: ['Barometer Calibration', 'When write "02" to Barometer conf. ha sbeen issued,the calibration values is found here.'],

        AA50: ['Gyroscope Service'],
        AA51: ['Gyroscope Data', 'XLSB:XMSB:YLSB:YMSB:ZLSB:ZMSB'],
        AA52: ['Gyroscope Config', 'Write 0 to turn off gyroscope,1 to enable X-axis only, 2t o enable Y-axis only, 3=X and Y,4 = Zo nly, 5 = X and Z, 6 = Y'],
        AA53: ['Gyroscope Period', 'Period =[Input*10]ms(lower limit100ms),default 1000ms'],
    
        AA61: ['TestData', 'Self-test results (highbitindicatesPASSED):Bit 0:IRtemp,1:Humidity,2:Magnetometer,3:accelerometer,4:Barometer,5:Gyroscope'],
    
        AA62: ['Test Config', 'bit 7: enable testmode; bit 0-1LED bit mask'],
    
        CCC1: ['Connection Parameters', 'ConnInterval,SlaveLatency,SupervisionTimeout(2 byteseach)'],
    
        CCC2: ['Request Connection Parameters', 'MinConnInterval,MaxConnInterval,SlaveLatency,SupervisionTimeout(2 byteseach)'],
    
        CCC3: ['Disconnect request', 'Change thevaluetodisconnect'],
    
        FFC1: ['OADImage Identify', 'Write "0" to identify image type "A", "1" to identify "B". Data in notification 8 bytes: imagetype(2), size/4(2),userdata(4).'],
    
        FFC2: ['OADImage Block', 'Imageblock(18bytes).Blockno. (2 bytes),OADimage block (16 bytes)'],

        FFE0: ['Keypress service'],
        FFE1: ['Keypress Data'],
        "2902": ['Keypress Notification']

    };


function getTiAttribute(uuid) {

    var id = uuid.replace(TIBase[0], '').replace(TIBase[1], '').toUpperCase();

    return [uuid, id].concat(sensorTagAttributeTable[id]);

}

function MSBLSBtoWORD(msb, lsb) {

    return (((msb << 8) | lsb) << 16) >> 16;
}

function SensorTag(p, cb) {

    this.p = p;
    this.rssi = 0;

    //console.log(this.p.advertisement);

    this.init(p, cb);

}




SensorTag.prototype = {

    init: function(p, cb) {

        var st = this;

        p.connect(function(error) {

            if (error) {

                console.error(error);

            } else {
                p.updateRssi(function(error, rssi) {
                    st.rssi = rssi;
                });

                p.discoverAllServicesAndCharacteristics(function(error, srvs, cha) {

                    var srv;

                    while (srvs.length) {

                        srv = srvs.shift();

                        //console.log(getTiAttribute(srv.uuid));

                        while (srv.characteristics.length) {
                            st.addCharacteristic(srv.characteristics.shift());
                        }

                    }

                    cb(st);

                });


            }
        });

    },

    addCharacteristic: function(ch) {

        var tiAttr = getTiAttribute(ch.uuid);

        if (tiAttr) {

            //removeSpaces to make CamelCaseNames
            var fName = tiAttr[2].split(' ').join('');

            this[fName] = {
                ch: ch,
                info: tiAttr
            };

        } else {
            console.error('unknown charactersitc');
        }

    },

    readConfigHex: function(cname, cb) {
        var st = this;
        st[cname].ch.read(function(err, buf) {
            cb(st, st[cname].info[2], err, buf.toString('hex'));
        });
    },

    getSystemId: function(cb) {
        this.readConfigHex('SystemID', cb);
    },

    getModelNumberString: function(cb) {
        this.readConfigHex('ModelNumberString', cb);
    },

    getSerialNumberString: function(cb) {
        this.readConfigHex('SerialNumberString', cb);
    },

    getFirmwareRevisionString: function(cb) {
        this.readConfigHex('FirmwareRevisionString', cb);
    },

    ////////////////////////////////////////////////////////////////////////////////////

    getIRTemperatureConfig: function(cb) {
        this.readConfigHex('IRTemperatureConfig', cb);
    },

    startIRTemperature: function(cb) {
        var onBit = new Buffer([0x01]);
        this.IRTemperatureConfig.ch.write(onBit, true, cb);
    },

    stopIRTemperature: function(cb) {
        var offBit = new Buffer([0x00]);
        this.IRTemperatureConfig.ch.write(offBit, true, cb);
    },

    getIRTemperatureData: function(cb) {
        var st = this;

        st.IRTemperatureData.ch.read(function(err, data) {

            var objT = MSBLSBtoWORD(data[1], data[0]),
                ambT = MSBLSBtoWORD(data[3], data[2]),
                m_tmpAmb = ambT / 128.0,
                Vobj2 = objT * 0.00000015625,
                Tdie2 = m_tmpAmb + 273.15,
                S0 = 6.4E-14, // Calibration factor
                a1 = 1.75E-3,
                a2 = -1.678E-5,
                b0 = -2.94E-5,
                b1 = -5.7E-7,
                b2 = 4.63E-9,
                c2 = 13.4,
                Tref = 298.15,
                S = S0 * (1 + a1 * (Tdie2 - Tref) + a2 * Math.pow((Tdie2 - Tref), 2)),
                Vos = b0 + b1 * (Tdie2 - Tref) + b2 * Math.pow((Tdie2 - Tref), 2),
                fObj = (Vobj2 - Vos) + c2 * Math.pow((Vobj2 - Vos), 2),
                tObj = Math.pow(Math.pow(Tdie2, 4) + (fObj / S), 0.25);

            tObj = (tObj - 273.15);

            var TObj = {
                rawData : data,
                objTempWORD: objT,
                ambTempWORD: ambT,
                objectTemp : tObj
            };

            cb(st, st.IRTemperatureData.info[2], err, TObj);

        });
    },

    ////////////////////////////////////////////////////////////////////////////////////

    getHumidityConfig: function(cb) {
        this.readConfigHex('HumidityConfig', cb);
    },

    startHumidity: function(cb) {
        var onBit = new Buffer([0x01]);
        this.HumidityConfig.ch.write(onBit, true, cb);
    },

    stopHumidity: function(cb) {
        var offBit = new Buffer([0x00]);
        this.HumidityConfig.ch.write(offBit, true, cb);
    },

    getHumidityData: function(cb) {
        var st = this;

        st.HumidityData.ch.read(function(err, data) {

            var TempWORD = MSBLSBtoWORD(data[1], data[0]),
                HumidityWORD = MSBLSBtoWORD(data[3], data[2]);

            var HObj = {
                rawData: data,
                tempWORD: TempWORD,
                humidityWORD: HumidityWORD
            };

            cb(st, st.HumidityData.info[2], err, HObj);


        });
    },

    ////////////////////////////////////////////////////////////////////////////////////

    getBarometerConfig: function(cb) {
        this.readConfigHex('BarometerConfig', cb);
    },

    startBarometer: function(cb) {
        var onBit = new Buffer([0x01]);
        this.BarometerConfig.ch.write(onBit, true, cb);
    },

    stopBarometer: function(cb) {
        var offBit = new Buffer([0x00]);
        this.BarometerConfig.ch.write(offBit, true, cb);
    },

    getBarometerCalibration: function(cb) {
        var calibrationBit = new Buffer([0x02]),
            st = this;
        this.BarometerConfig.ch.write(calibrationBit, true, function() {
            st.BarometerCalibration.ch.read(function(err, data) {

                var CObj = {
                    rawData: data
                };
                cb(st, st.BarometerCalibration.info[2], err, CObj);
            });
        });
    },

    getBarometerData: function(cb) {
        var st = this;

        st.BarometerData.ch.read(function(err, data) {

            var BObj = {
                rawData: data
            };

            cb(st, st.BarometerData.info[2], err, BObj);
        });
    }


};


exports.SensorTag = SensorTag;
