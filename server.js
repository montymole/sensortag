var sensorReading = require('./db.js'),
    express = require('express'),
    app = express(),
    dust = require('dustjs-linkedin');

require('./src/js/dust.tpl.js');

function readingsDateFromTo(dstart, dend, cb) {

    sensorReading.find({
        date: {
            $gte: dstart,
            $lte: dend
        }
    }, function(err, sensorReadings) {

        if (!err) {
            cb(sensorReadings);

        } else {
            cb(error);
            console.error(err);
        }

    });

}

app.get('/', function(req, res) {

    var now = new Date(),
        dstart = new Date();

    dstart.setHours(now.getHours() - 1);


    readingsDateFromTo(dstart.getTime(), now.getTime(), function(readings) {

        var model = {},r,n;

        //process readings abit
        while(readings.length) {
            r = readings.shift();
            n = r.cname.split(' ').join(''); //camelcase the names
            if (!model[n]) {
                model[n] = [];
            }
            r.dateStr = new Date();
            r.dateStr.setTime(r.date);
            model[n].push(r);
        }

        console.log(model);

        dust.render('index.dust', model, function(err, output) {

            res.send(output);

        });

    });

});

app.listen(3000);
