var express = require('express')
    , app = express()
    , server = require("http").createServer(app)

app.use(express.static(__dirname + '/public'));

require("./drone/camera-feed");
require("./drone/controller");

app.listen(3000);


