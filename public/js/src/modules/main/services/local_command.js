angular.module('main').factory('local_command', ['$resource', function($resource) {
    return $resource('/v1', {}, {
        create: {
            url: '/v1/project/:id/local_command/create',
            method: 'POST'
        },
        delete: {
            url: '/v1/project/:id/local_command/delete/:remoteId',
            method: 'DELETE'
        }
    });
}]);