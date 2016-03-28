var gulp = require('gulp');
var gutil = require('gulp-util');
var gulpif = require('gulp-if');
var streamify = require('gulp-streamify');
var autoprefixer = require('gulp-autoprefixer');
var cssmin = require('gulp-cssmin');
var less = require('gulp-less');
var concat = require('gulp-concat');
var plumber = require('gulp-plumber');
var source = require('vinyl-source-stream');
var babelify = require('babelify');
var browserify = require('browserify');
var watchify = require('watchify');
var uglify = require('gulp-uglify');

var production = process.env.NODE_ENV === 'production';

var dependencies = [
  'alt',
  'react',
  'react-dom',
  'react-router',
  'underscore',
  'lodash',
  'jointjs',
  'react-bootstrap-table',
  'classnames',
];

var browserifyConfig = {
    debug:true,
    transform: [babelify.configure({'presets': ["react", "es2015"]})],
    extensions: ['.jsx']
}

/*
 |--------------------------------------------------------------------------
 | Combine all JS libraries into a single file for fewer HTTP requests.
 |--------------------------------------------------------------------------
 */
gulp.task('vendor', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js',
    'bower_components/magnific-popup/dist/jquery.magnific-popup.js',
    'bower_components/toastr/toastr.js',
    'node_modules/svg-pan-zoom/dist/svg-pan-zoom.js'
  ]).pipe(concat('vendor.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile third-party dependencies separately for faster performance.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-vendor', function() {
  return browserify()
    .require(dependencies)
    .bundle()
    .pipe(source('vendor.bundle.js'))
    .pipe(gulpif(production, streamify(uglify({ mangle: false }))))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Compile only project files, excluding all third-party dependencies.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify', ['browserify-vendor'], function() {
  return browserify('app/main.jsx', browserifyConfig)
    .external(dependencies)
    .external('app/extra.jointjs.js')
    // .transform(babelify, { presets: ['es2015', 'react'] })
    .bundle()
    .pipe(source('bundle.js'))
    .pipe(gulpif(production, streamify(uglify({ mangle: false }))))
    .pipe(gulp.dest('public/js'));
});

/*
 |--------------------------------------------------------------------------
 | Same as browserify task, but will also watch for changes and re-compile.
 |--------------------------------------------------------------------------
 */
gulp.task('browserify-watch', ['browserify-vendor'], function() {
  var bundler = watchify(browserify('app/main.jsx', browserifyConfig));
  bundler.external(dependencies);
  bundler.transform(babelify, { presets: ['es2015', 'react'] })
  bundler.on('update', rebundle);
  return rebundle();

  function rebundle() {
    var start = Date.now();
    return bundler.bundle()
      .on('error', function(err) {
        gutil.log(gutil.colors.red(err.toString()));
      })
      .on('end', function() {
        gutil.log(gutil.colors.green('Finished rebundling in', (Date.now() - start) + 'ms.'));
      })
      .pipe(source('bundle.js'))
      .pipe(gulp.dest('public/js/'));
  }
});

/*
 |--------------------------------------------------------------------------
 | Compile LESS stylesheets.
 |--------------------------------------------------------------------------
 */
gulp.task('styles', function() {
  return gulp.src('app/stylesheets/main.less')
    .pipe(plumber())
    .pipe(less())
    .pipe(autoprefixer())
    .pipe(gulpif(production, cssmin()))
    .pipe(gulp.dest('public/css'));
});

gulp.task('watch', function() {
  gulp.watch('app/stylesheets/**/*.less', ['styles']);
});

gulp.task('default', ['styles', 'vendor', 'browserify-watch', 'watch']);
gulp.task('build', ['styles', 'vendor', 'browserify']);

/*
-----------------------------------------------------------------------------
*/

var sourceFile = './app/components/Graph.js';
var destFolder = './public/js/write';
var destFile = 'bundle-write.js';
var notify = require('gulp-notify');

var handleError = function(err) {
    notify.onError({
        message: "<%= error.message %>"
    }).apply(this, arguments);

    this.emit('end');
};


var writeBrowserifyConfig = {
    debug:true,
}

gulp.task('vendor-write', function() {
  return gulp.src([
    'bower_components/jquery/dist/jquery.js',
    'bower_components/bootstrap/dist/js/bootstrap.js'
  ]).pipe(concat('vendor-write.js'))
    .pipe(gulpif(production, uglify({ mangle: false })))
    .pipe(gulp.dest(destFolder));
});


gulp.task('browserify-write', function() {
  return browserify(sourceFile, writeBrowserifyConfig)
  .bundle()
  .on('error', handleError)
  .pipe(source(destFile))
  .pipe(gulp.dest(destFolder));
});

gulp.task('watch-write', function() {
  var bundler = watchify(browserify(sourceFile, writeBrowserifyConfig));
  bundler.on('update', rebundle);

  function rebundle() {
    return bundler.bundle()
      .on('error', handleError)
      .pipe(source(destFile))
      .pipe(gulp.dest(destFolder));
  }

  return rebundle();
});

gulp.task('write', ['vendor-write', 'browserify-write', 'watch-write']);
