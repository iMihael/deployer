angular.module('main').controller('projectRollback',  ['$scope', 'project', '$sce', function($scope, project, $sce){

    var log = '';
    $scope.rollbackLog = '';

    $scope.log = function(str){

        log += str + (str.indexOf("%") == -1 ? "<br /> \n" : " ");
        $scope.rollbackLog = $sce.trustAsHtml(log);
    };

    window.socket.on('rollback', function(data){
        $scope.log(data);
        $scope.$apply();
    });

    $scope.log('Sending rollback request;');

    for(var i in $scope.project.remotes) {
        if($scope.project.remotes[i].id == $scope.rollbackFlow.remote) {
            project.rollback({id: $scope.project._id}, $scope.project.remotes[i], function(){
                $scope.log('Request sent;');
            });
        }
    }



}]);