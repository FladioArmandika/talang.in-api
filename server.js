const express   = require('express');
const config    = require('./config');
const cors      = require('cors');
const bodyParser    = require('body-parser')


const startServer = async() => {
    const app = express();
    app.use(cors());
    app.use(bodyParser.json());

    await require('./loaders')(app);

    app.use(cors());

    app.listen(config.port, err => {

        if (err) {
            process.exit(1);
            return;
        }
        console.log('SERVER LISTENING ON ' + config.port);
    })
}

startServer();