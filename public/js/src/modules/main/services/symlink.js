angular.module('main').factory('symlink', ['$resource', function($resource) {
    return $resource('/v1', {}, {
        create: {
            url: '/v1/project/:id/symlink/create',
            method: 'POST'
        },
        delete: {
            url: '/v1/project/:id/symlink/delete/:symlinkId',
            method: 'DELETE'
        }
    });
}]);