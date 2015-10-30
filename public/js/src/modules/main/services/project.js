angular.module('main').factory('project', ['$resource', function($resource) {


    var res = $resource('/v1/projects', {}, {
        create: {
            method: 'POST'
        },
        get: {
            method: 'GET',
            url: '/v1/project/:id'
        },
        delete: {
            method: 'DELETE',
            url: '/v1/project/:id'
        },
        restore: {
            method: 'POST',
            url: '/v1/project/:id/restore'
        },
        update: {
            method: 'PUT',
            url: '/v1/project/:id'
        },
        deploy: {
            method: 'POST',
            url: '/v1/project/:id/deploy'
        },
        rollback: {
            method: 'POST',
            url: '/v1/project/:id/rollback'
        }
    });

    return res;
}]);