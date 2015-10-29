var lc = require('../db/remote_command');

module.exports = {
    create: function(req, res) {
        var remote = req.body;
        lc.addRemote(remote, req.params.id, function(data){
            res.json(data);
        }, function(){
            res.status(422);
            res.end();
        });
    },
    delete: function(req, res) {
        lc.deleteRemote(req.params.id, req.params.commandId, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    }
};