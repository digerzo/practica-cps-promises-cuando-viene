var uuid4 = require('uuid/v4');
var Promise = require('bluebird');
var colored_console = require('./colored_console.js');
////
// FUNCTIONS
////

var generate_uuid_id = function () {
    return uuid4()
};

////
// SERVER
////

var express = require('express');
var app = express();
var bodyParser = require('body-parser');

var registered_servers = 0;
var servers = {};

var r = require('./request_wrapper');

app.use(bodyParser.json());

app.route('/register')
    .post(function (req, res) {
        var id = generate_uuid_id();
        console.log(req.body);
        var url = req.body.url;

        colored_console.log_info("Received registration from server ", url);

        servers[id] = {
            'id': id,
            'url': url,
            'tries': 0,
            'state': {}
        };
        registered_servers++;

        res.json({ serverId: id })
    });

var schedule = require('node-schedule');

schedule.scheduleJob('*/5 * * * * *', function(){
     colored_console.log_info("Try to send a heartbeat to the servers");
    for (var _server in servers) {
        console.log("Sending Heartbeat to server: "+servers[_server]['url']);

        r.heartbeat(servers[_server]['url'] + '/heartbeat', 2000).catch(function() {
            // Add 5 seconds to each bidding
            console.log("Received Heartbeat")
        })
    }
});

var port = 4040;
var server = app.listen(port, function () {
    colored_console.log_info("Initializing supervisor node in port " + server.address().port + "....")
});


