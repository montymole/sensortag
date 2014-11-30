var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    MONGODB_DATABASE = process.env.MONGODB_DATABASE || 'sensortag',
    MONGODB_PORT = process.env.MONGODB_PORT || 27017,
    MONGODB_USERNAME = process.env.MONGODB_USERNAME,
    MONGODB_PASSWORD = process.env.MONGODB_PASSWORD,
    MONGO_URL = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/sensortag',

    sensorReadingSchema = new Schema({

        date: String,
        sensorTagId: String,
        cname: String,
        value: Object

    });

mongoose.connect(MONGO_URL, {
    user: MONGODB_USERNAME,
    pass: MONGODB_PASSWORD
});

mongoose.model('sensorReading', sensorReadingSchema);

module.exports = mongoose.model('sensorReading');
