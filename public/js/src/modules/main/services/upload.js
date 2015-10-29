angular.module('main').factory('upload', ['$resource', function($resource) {
    return $resource('/v1', {}, {
        create: {
            url: '/v1/project/:id/upload/create',
            method: 'POST'
        },
        delete: {
            url: '/v1/project/:id/upload/delete/:uploadId',
            method: 'DELETE'
        }
    });
}]);