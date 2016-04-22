var $ = require('gulp-load-plugins')();
var source = require('vinyl-source-stream');
var gulp = require('gulp');
var gutil = require('gulp-util');
var browserify = require('browserify');
var watchify = require('watchify');
var notify = require('gulp-notify');
var cssnano = require('cssnano');
var autoprefixer = require('autoprefixer');

var stylus = require('gulp-stylus');
var autoprefixer = require('gulp-autoprefixer');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var buffer = require('vinyl-buffer');

var historyApiFallback = require('connect-history-api-fallback');

var basePaths = {
    src: 'scss/',
    dest: 'build/'
};


/*
  Styles Task
*/

gulp.task('styles', function() {
    return gulp.src(basePaths.src + '*.scss')
        .pipe($.sass({
            includePaths: ['scss']
        }))
        .pipe($.autoprefixer('last 4 versions'))
        .pipe($.minifyCss())
        .pipe(gulp.dest('./build/css'))
});

/*
  Images
*/
// gulp.task('images',function(){
//   gulp.src('css/images/**')
//     .pipe(gulp.dest('./build/css/images'))
// });

/*
  Browser Sync
*/
// gulp.task('browser-sync', function() {
//     browserSync({
//         // we need to disable clicks and forms for when we test multiple rooms
//         server : {},
//         middleware : [ historyApiFallback() ],
//         ghostMode: false
//     });
// });

function handleErrors() {
    var args = Array.prototype.slice.call(arguments);
    notify.onError({
        title: 'Compile Error',
        message: '<%= error.message %>'
    }).apply(this, args);
    this.emit('end'); // Keep gulp from hanging on this task
}

function buildScript(file, watch) {
    var props = {
        entries: ['./scripts/' + file],
        debug: true,
        cache: {},
        packageCache: {}
    };

    // watchify() if watch requested, otherwise run browserify() once 
    var bundler = watch ? watchify(browserify(props)) : browserify(props);

    function rebundle() {
        var stream = bundler.bundle();
        return stream
            .on('error', handleErrors)
            .pipe(source(file))
            .pipe(gulp.dest('./build/js'))
            // If you also want to uglify it
            // .pipe(buffer())
            // .pipe(uglify())
            // .pipe(rename('app.min.js'))
            // .pipe(gulp.dest('./build'))
    }

    // listen for an update and run rebundle
    bundler.on('update', function() {
        rebundle();
        gutil.log('Rebundle...');
    });

    // run it once the first time buildScript is called
    return rebundle();
}

gulp.task('scripts', function() {
    return buildScript('main.js', false); // this will run once because we set watch to false
});

// run 'scripts' task first, then watch for future changes
gulp.task('default', ['styles', 'scripts'], function() {
    gulp.watch('scss/**/*', ['styles']); // gulp watch for stylus changes
    return buildScript('main.js', true); // browserify watch for JS changes
});