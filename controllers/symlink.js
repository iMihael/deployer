var lc = require('../db/symlink');

module.exports = {
    create: function(req, res) {
        var symlink = req.body;
        lc.addSymlink(symlink, req.params.id, function(data){
            res.json(data);
        }, function(){
            res.status(422);
            res.end();
        });
    },
    delete: function(req, res) {
        lc.deleteSymlink(req.params.id, req.params.symlinkId, function(){
            res.status(204);
            res.end();
        }, function(){
            res.status(422);
            res.end();
        });
    }
};