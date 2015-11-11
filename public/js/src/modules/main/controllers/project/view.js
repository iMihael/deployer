angular.module('main').controller('projectView',  ['$scope', 'project', '$location', 'growl', '$routeParams', 'remote', 'local_command',
    'remote_command', 'symlink', 'upload', '$modal', 'viewPath',
    function($scope, project, $location, growl, $routeParams, remote, local_command, remote_command, symlink, upload, $modal, viewPath){

    $scope.viewPath = 'js/src/modules/main/views/project/view/';
    $scope.activeTab = $routeParams.tab;

    project.get({
        id: $routeParams.id
    }, function(data){
        $scope.project = data;
        $scope.deployFlow.list = data.deployFlow;
        $scope.rollbackFlow.list = data.rollbackFlow;

        if(data.hasOwnProperty('remotes') && data.remotes.length == 1) {
            $scope.deployFlow.remote = data.remotes[0].id;
            $scope.rollbackFlow.remote = data.remotes[0].id;
        }
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
                    remote_path: $scope.project.remote_path,
                    passphrase: $scope.project.passphrase,
                    systemKeys: $scope.project.systemKeys
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


        $scope.deployFlow = {
            deploy: function(){
                if($scope.deployFlow.remote != '-1') {
                    $modal.open({
                        animation: true,
                        templateUrl: viewPath + '/project/deploy.html',
                        scope: $scope,
                        controller: 'projectDeploy',
                        size: 'lg'
                    });
                }
            },
            remote: '-1',
            drop: function(item, type, index){

                if(type != "deploy") {

                    if (type == 'local_command') {
                        item.title = item.name;
                        item.description = 'Local Command';
                    } else if (type == 'remote_command') {
                        item.title = item.name;
                        item.description = 'Remote Command';
                    } else if (type == 'symlink') {
                        item.title = item.source + "\n" + item.destination;
                        item.description = 'Symlink';
                    } else if (type == 'upload') {
                        item.title = item.source + "\n" + item.destination;
                        item.description = 'Upload';
                    }

                    item.type = type;

                }

                item.index = index;

                project.update({id: $routeParams.id}, {
                    deployFlow: $scope.deployFlow.list
                });

                return item;
            },
            list: [
                {
                    title: 'Deploy',
                    description: '',
                    primary: true
                }
            ],
            remove: function($index){
                $scope.deployFlow.list.splice($index, 1);

                project.update({id: $routeParams.id}, {
                    deployFlow: $scope.deployFlow.list
                });
            }
        };

        $scope.rollbackFlow = {
            rollback: function(){
                if($scope.rollbackFlow.remote != '-1') {
                    console.log('sss');
                }
            },
            remote: '-1',
            drop: function(item, type, index){

                if(type == 'local_command' ) {
                    item.title = item.name;
                    item.description = 'Local Command';
                } else if(type == 'remote_command') {
                    item.title = item.name;
                    item.description = 'Remote Command';
                } else if(type == 'symlink') {
                    item.title = item.source + "\n" + item.destination;
                    item.description = 'Symlink';
                } else if(type == 'upload') {
                    item.title = item.source + "\n" + item.destination;
                    item.description = 'Upload';
                }

                item.type = type;
                item.index = index;

                project.update({id: $routeParams.id}, {
                    rollbackFlow: $scope.rollbackFlow.list
                });


                return item;
            },
            list: [
                {
                    title: 'Rollback',
                    description: '',
                    primary: true
                }
            ],
            remove: function($index){
                $scope.rollbackFlow.list.splice($index, 1);

                project.update({id: $routeParams.id}, {
                    rollbackFlow: $scope.rollbackFlow.list
                });
            }
        };

    }]);