angular.module('main').controller('import',  ['$scope', 'growl', 'project', function($scope, growl, project){

    $scope.beginImport = function(){
        var control = document.getElementById("iFile");
        var files = control.files;

        var reader = new FileReader();
        reader.onload = function(event) {
            var contents = event.target.result;
            var json = JSON.parse(contents);
            if(json) {
                for(var i in json) {

                    delete json[i]._id;
                    delete json[i].selected;

                    project.create(json[i]);
                }
                growl.success('Projects imported. Update page to see new items.');
            } else {
                growl.error('Something went wrong.');
            }
        };

        reader.onerror = function(event) {
            growl.error('Something went wrong.');
        };

        reader.readAsText(files[0]);
    }
}]);