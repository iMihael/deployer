angular.module('main').controller('projectDeploy',  ['$scope', 'project', '$sce', function($scope, project, $sce){

    var log = '';
    $scope.deployLog = '';

    $scope.log = function(str){
        log += str + "<br /> \n";
        $scope.deployLog = $sce.trustAsHtml(log);
    };

    window.socket.on('deploy', function(data){
        $scope.log(data);
        $scope.$apply();
    });

    $scope.log('Sending deploy request;');

    project.deploy({id: $scope.project._id}, {}, function(){
        $scope.log('Request sent;');
    });

}]);