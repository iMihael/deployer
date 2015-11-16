angular.module('main', ['ngRoute', 'ngResource', 'ui.bootstrap'])
    .config(['$routeProvider', 'viewPath', '$compileProvider', function($routeProvider, viewPath, $compileProvider){

        //var oldWhiteList = $compileProvider.aHrefSanitizationWhitelist();
        //console.log(oldWhiteList);
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|tel|file|blob):/);
        //var viewPath = 'js/src/modules/main/views/';

        $routeProvider
            .when('/', {
                templateUrl: viewPath + 'project/list.html',
                controller: 'projectList',
                title: 'Deployer - Projects'
            })
            .when('/projects/create', {
                templateUrl: viewPath + 'project/create.html',
                controller: 'projectCreate',
                title: 'Deployer - Create Project'
            })
            .when('/project/:id/:tab', {
                templateUrl: viewPath + 'project/view.html',
                title: 'Deployer - Project',
                controller: 'projectView'
            })
            .when('/project/create/remote/:id', {
                templateUrl: viewPath + 'remote-server/create.html',
                title: 'Deployer - Create Remote',
                controller: 'remoteCreate'
            })
            .when('/project/create/local_command/:id', {
                templateUrl: viewPath + 'local-command/create.html',
                title: 'Deployer - Create Local Command',
                controller: 'localCommandCreate'
            })
            .when('/project/create/remote_command/:id', {
                templateUrl: viewPath + 'remote-command/create.html',
                title: 'Deployer - Create Remote Command',
                controller: 'remoteCommandCreate'
            })
            .when('/project/create/symlink/:id', {
                templateUrl: viewPath + 'symlink/create.html',
                title: 'Deployer - Create Symlink',
                controller: 'symlinkCreate'
            })
            .when('/project/create/upload/:id', {
                templateUrl: viewPath + 'upload/create.html',
                title: 'Deployer - Create Upload',
                controller: 'uploadCreate'
            });
    }]).constant('viewPath', 'js/src/modules/main/views/');