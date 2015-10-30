var Client = require('ssh2').Client;
var conn = new Client();

conn.on('ready', function() {
    module.exports.onReady();
});



module.exports = {
    onReady: function(){

    },
    connect: function(host, port, username, privateKey){
        conn.connect({
            host: host,
            port: port,
            username: username,
            privateKey: privateKey
        });
    },
    disconnect: function(){
        conn.end();
    }
};