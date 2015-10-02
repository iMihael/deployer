var gulp = require('gulp'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify');
    //ngAnnotate = require('gulp-ng-annotate');

var conf = require('./package.json');

var srcPath = 'public/js/src';
var dstPath = 'public/js';

gulp.task(conf.env == 'dev' ? 'js' : 'default', function () {
    var app = gulp.src([
        srcPath + '/modules/**/*.js',
        //srcPath + '/libs/**/*.js' ,
        //srcPath + '/**/translate.js',
        //srcPath + '/**/config.js',
        srcPath + '/**/module.js'])
        .pipe(concat('app.js'));

    if( conf.env == 'prod' ) {
        app.pipe(uglify({mangle: false}));
    }

    app.pipe(gulp.dest(dstPath));
});

if(conf.env == 'dev') {
    gulp.task('default', ['js'], function () {
        gulp.watch(srcPath + '/**/*.js', ['js']);
    });
}