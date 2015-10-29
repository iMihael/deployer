angular.module('main').factory('remote_command', ['$resource', function($resource) {
    return $resource('/v1', {}, {
        create: {
            url: '/v1/project/:id/remote_command/create',
            method: 'POST'
        },
        delete: {
            url: '/v1/project/:id/remote_command/delete/:commandId',
            method: 'DELETE'
        }
    });
}]);