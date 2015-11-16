angular.module('main').controller('projectList',  ['$scope', 'project', '$modal', 'viewPath', function($scope, project, $modal, viewPath){


    project.query({}, {}, function(data){
        $scope.projects = data;
    });

    $scope.deleteProject = function(row) {
        project.delete({id: row._id}, function(){
            row.deleted = true;
        });
    };

    $scope.restoreProject = function(row) {
        project.restore({id: row._id}, {}, function(){
            row.deleted = false;
        });
    };

    $scope.exportHref = false;

    $scope.rowClick = function(row){

        row.selected = !row.selected;

        var selected = [];
        for(var i in $scope.projects) {
            if($scope.projects[i].selected) {
                selected.push($scope.projects[i]);
            }
        }

        if(selected.length > 0) {
            var json = JSON.stringify(selected);
            var blob = new Blob([json], {type: "application/json"});
            var url = URL.createObjectURL(blob);
            $scope.exportHref = url;
        } else {
            $scope.exportHref = false;
        }
    };

    $scope.import = function(){
        $modal.open({
            animation: true,
            templateUrl: viewPath + '/project/import.html',
            scope: $scope,
            controller: 'import',
            size: 'lg'
        });
    };

}]);