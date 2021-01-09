const mongoose = require('mongoose')
const configDB = require('./config/config')


mongoose.connect(configDB.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });