angular.module('main').controller('projectDeploy',  ['$scope', 'project', '$sce', function($scope, project, $sce){

    var log = '';
    $scope.deployLog = '';

    var progressBar = false;
    var progressBarNum = 0;

    $scope.log = function(str){

        if(str.indexOf("%") != -1) {

            if(!progressBar) {
                progressBarNum++;

                var prog = $("#progress").html();
                prog = prog.replace(new RegExp("{{progid}}", "g"), progressBarNum);
                log += prog;
                progressBar = true;

                $scope.deployLog = $sce.trustAsHtml(log);
            }

            var percent = parseInt(str);
            //console.log(percent);

            if(percent) {
                $("#prog" + progressBarNum).css('width', percent + '%').attr('aria-valuenow', percent).html(percent + '%');
            }

        } else {
            progressBar = false;
            log += str + "<br /> \n";
            $scope.deployLog = $sce.trustAsHtml(log);
        }

        //$scope.$apply();

        //log += str + (str.indexOf("%") == -1 ? "<br /> \n" : " ");

    };

    window.socket.on('deploy', function(data){
        $scope.log(data);
        $scope.$apply();
    });

    $scope.log('Sending deploy request;');

    for(var i in $scope.project.remotes) {
        if($scope.project.remotes[i].id == $scope.deployFlow.remote) {
            project.deploy({id: $scope.project._id}, $scope.project.remotes[i], function(){
                $scope.log('Request sent;');
            });
        }
    }



}]);