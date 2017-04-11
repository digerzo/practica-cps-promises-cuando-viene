var r = require('./request_wrapper')

var INTERVALID
var SERVERID
var supervisorUrl = 'http://127.0.0.1:4040'

var SupervisorClient = function(url, fallback) {
    this.url = url;

    this.fallback = fallback;

    this.boundCatch = this.catchConnectionError.bind(this)
}

SupervisorClient.prototype = {
    isOnline: function () {
        return !!SERVERID
    },

    register: function () {
        return r.post(supervisorUrl + '/register', { url: this.url }).then(function (response) {
            console.log('Conectado correctamente con el supervisor, el ID de este servidor es', response.serverId)
            SERVERID = response.serverId
            clearInterval(INTERVALID)
        }).catch(this.boundCatch)
    },

    catchConnectionError: function() {
        SERVERID = undefined

        clearInterval(INTERVALID)
        INTERVALID = this.fallback()

        setTimeout(function() {
            this.register()
        }.bind(this), 10000)
    }
}

module.exports = SupervisorClient
