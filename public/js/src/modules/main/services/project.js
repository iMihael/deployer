angular.module('main').factory('project', ['$resource', function($resource) {


    var res = $resource('/v1/projects', {}, {
        create: {
            method: 'POST'
        }
    });

    return res;
}]);