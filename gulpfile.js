//load configurations
var UGLIFY = true,
    MINIFY_CSS = true,
    ANONYMOUS_SCOPE = true,

    // module requirements
    fs = require('fs'),
    path = require('path'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    gulpif = require('gulp-if'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    gulpDust = require('gulp-dust'),
    insert = require('gulp-insert'),
    streamqueue = require('streamqueue'),
    through = require('through2'),

    //sass
    sass = require('gulp-sass'),
    minifycss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),

    shell = require('gulp-shell'),

    //imageoptimization
    imageop = require('gulp-image-optimization'),
    imageResize = require('gulp-image-resize'),

    //path vars
    tmp_dir = path.join(__dirname, 'tmp'),
    pub_dir = path.join(__dirname, 'public'),
    src_dir = path.join(__dirname, 'src'),

    //render site
    site = require(src_dir + '/site.js'),
    dust = require('dustjs-linkedin');

//compiled templates
require(src_dir + '/js/dust.tpl.js');


/*--------------------------------------*/
/*  DEFAULT TASK: BUILD ALL    */
/*--------------------------------------*/
gulp.task('default', ['css', 'dust', 'jib', 'js']);

/*--------------------------------------*/
/*  Watch these    */
/*--------------------------------------*/
gulp.task('watch', function() {
    gulp.watch(src_dir + '/dust/*', ['dust']);
    gulp.watch(src_dir + '/js/*.js', ['js']);
    gulp.watch(src_dir + '/js/jib/*.js', ['jib']);
    gulp.watch(src_dir + '/scss/*', ['css']);
});


/*--------------------------------------*/
/*  IMAGES    */
/*--------------------------------------*/

function generateSizes() {

    var shave = {
    };

    return through.obj(function(file, enc, cb) {
        var name = path.basename(file.path, path.extname(file.path));

        if (shave[name]) {
            console.log('CREATE HALF SIZE');
            gulp.src(file.path)
                .pipe(imageResize({
                    width: shave[name].w / 2
                }))
                .pipe(imageop({
                    optimizationLevel: 5,
                    progressive: true,
                    interlaced: true
                }))
                .pipe(rename({
                    suffix: '.h'
                }))
                .pipe(gulp.dest(path.join(pub_dir, 'img')));
        }

        return cb();
    });

}

gulp.task('img', function() {

    gulp.src(path.join(src_dir, 'img/*'))
        .pipe(generateSizes())
        .pipe(imageop({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest(path.join(pub_dir, 'img')));

});


/*--------------------------------------*/
/*  TEMPLATE processing
/* TODO fork gulp-dust module to make
/* smarter js
/*--------------------------------------*/


gulp.task('dust', function() {

    return streamqueue({
                objectMode: true
            },
            gulp.src(src_dir + '/dusthead.js'),

            gulp.src(src_dir + '/dust/*.dust')
            .pipe(gulpDust().on('error', gutil.log)),

            gulp.src(src_dir + '/dustfoot.js')
        )
        .pipe(concat('dust.tpl.js'))
        .pipe(gulp.dest(src_dir + '/js'));

});


/*--------------------------------------*/
/*  CSS processing    */
/*--------------------------------------*/
gulp.task('css', function() {

    console.log('CSS...');

    return gulp.src(src_dir + '/scss/app.scss')
        .pipe(sass().on('error', gutil.log))
        .pipe(gulpif(MINIFY_CSS, minifycss()))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(pub_dir + '/css'));

});

/*--------------------------------------*/
/*  Javascript processing    */
/*--------------------------------------*/
gulp.task('js', function() {

    var jsPrepend = '(function() {',
        jsAppend = '})();';

    return gulp.src(src_dir + '/js/*.js')
        .pipe(concat('app.js'))
        .pipe(gulpif(UGLIFY, uglify().on('error', gutil.log)))
        .pipe(gulpif(ANONYMOUS_SCOPE, insert.wrap(jsPrepend, jsAppend)))
        .pipe(rename({
            suffix: '.min',
        }))
        .pipe(gulp.dest(pub_dir + '/js'));

});


/*--------------------------------------*/
/*  Pack lib to one file    */
/*--------------------------------------*/
gulp.task('jib', function() {

    return gulp.src(src_dir + '/js/jib/*.js')
        .pipe(concat('_jib.js'))
        .pipe(gulp.dest(src_dir + '/js'));

});
