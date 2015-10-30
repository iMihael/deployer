angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'remote', 'local_command', 'remote_command', 'symlink', 'upload',
    function($scope, project, $location, growl, $routeParams, remote, local_command, remote_command, symlink, upload){

    $scope.viewPath = 'js/src/modules/main/views/project/view/';
    $scope.activeTab = $routeParams.tab;

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
    });

        $scope.submitted = false;
        $scope.update = function(form){
            $scope.submitted = true;
            if(form.$valid) {
                project.update({id: $routeParams.id}, {
                    name: $scope.project.name,
                    git_remote: $scope.project.git_remote,
                    public_key: $scope.project.public_key,
                    private_key: $scope.project.private_key,
                }, function(){
                    growl.success('Project successfully updated.');
                });
            }
        };

    $scope.remote = {
        remove: function(id){
            remote.delete({
                id: $routeParams.id,
                remoteId: id
            }, function(){
                for(var i in $scope.project.remotes) {
                    if($scope.project.remotes[i].id == id) {
                        $scope.project.remotes.splice(i, 1);
                        break;
                    }
                }
            });
        }
    };

    $scope.local_command = {
        remove: function(id){
            local_command.delete({
                id: $routeParams.id,
                commandId: id
            }, function(){
                for(var i in $scope.project.local_commands) {
                    if($scope.project.local_commands[i].id == id) {
                        $scope.project.local_commands.splice(i, 1);
                        break;
                    }
                }
            });
        }
    };

        $scope.remote_command = {
            remove: function(id){
                remote_command.delete({
                    id: $routeParams.id,
                    commandId: id
                }, function(){
                    for(var i in $scope.project.remote_commands) {
                        if($scope.project.remote_commands[i].id == id) {
                            $scope.project.remote_commands.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        };

        $scope.symlink = {
            remove: function(id){
                symlink.delete({
                    id: $routeParams.id,
                    symlinkId: id
                }, function(){
                    for(var i in $scope.project.symlinks) {
                        if($scope.project.symlinks[i].id == id) {
                            $scope.project.symlinks.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        };

        $scope.upload = {
            remove: function(id){
                upload.delete({
                    id: $routeParams.id,
                    uploadId: id
                }, function(){
                    for(var i in $scope.project.uploads) {
                        if($scope.project.uploads[i].id == id) {
                            $scope.project.uploads.splice(i, 1);
                            break;
                        }
                    }
                });
            }
        };


        $scope.deployFlow = [];

    }]);