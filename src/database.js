const mongoose = require('mongoose')
const { config } = require('./config/config')


mongoose.connect(config.MONGODB_URI, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
    })
    .then(() => console.log('DB Connected!'))
    .catch(err => {
        console.log(err);
    });