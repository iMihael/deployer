angular.module('main').factory('remote', ['$resource', function($resource) {


    return $resource('/v1', {}, {
        create: {
            url: '/v1/project/:id/remote/create',
            method: 'POST'
        },
        delete: {
            url: '/v1/project/:id/remote/delete/:remoteId',
            method: 'DELETE'
        }
    });
}]);