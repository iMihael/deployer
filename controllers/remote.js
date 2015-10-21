var r = require('../db/remote.js');

module.exports = {
    create: function(req, res) {
        var remote = req.body;
        r.addRemote(remote, req.params.id, function(data){
            res.json(data);
        }, function(){
            res.status(422);
            res.end();
        });
    },
    delete: function(req, res) {
        r.deleteRemote(req.params.id, req.params.remoteId, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    }
};