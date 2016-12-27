///////////////////////////////////////////////////////////////////////
// PLUGINS DECLARATIONS
///////////////////////////////////////////////////////////////////////
var gulp          = require("gulp"),
    sass          = require("gulp-sass"),
    concat        = require("gulp-concat"),
    watch         = require("gulp-watch"),
    plumber       = require("gulp-plumber"),
    cleanCSS      = require("gulp-clean-css"),
    uglify        = require("gulp-uglify"),
    sourcemaps    = require("gulp-sourcemaps"),
    autoprefixer  = require("gulp-autoprefixer"),
    rename        = require("gulp-rename"),
    gulpif        = require("gulp-if"),
    minifyHTML    = require("gulp-minify-html"),
    gutil         = require('gulp-util'),
    imagemin      = require('gulp-imagemin'),
    pngquant      = require('imagemin-pngquant');
    browserSync   = require("browser-sync").create(),
    notify        = require("gulp-notify");

///////////////////////////////////////////////////
// main variables

var env,
    sassSources,
    htmlSources,
    jsSources,
    outputDir,
    jsVendors;


///////////////////////////////////////////////////
// Enviroment var

env = process.env.NODE_ENV || 'development';

if (env==='development') {
  outputDir = 'app/development/'
} else {
  outputDir = 'app/production/'
}

///////////////////////////////////////////////////
// PATHS DECLARATIONS

sassSources = ['app_components/sass/app.scss'];
htmlSources = [outputDir + '/**/*.html'];
jsVendors   = [outputDir + '/assets/js/vendor/*.js'];

jsSources = [
  'app_components/scripts/test.js',
  'app_components/scripts/main.js'
];

///////////////////////////////////////////////////
// Error Handler (for PLUMBER plugin)
var onError = function(err) {
  console.log(err);
  this.emit('end');
}

///////////////////////////////////////////////////////////////////////
// Task: SASS
///////////////////////////////////////////////////////////////////////

gulp.task('sass', function() {

  return gulp.src(sassSources)
    .pipe(plumber({
        errorHandler: onError
    }))
    .pipe(sass())
    .pipe(autoprefixer({
              browsers: ['last 3 versions'],
              cascade: false
          }))
    //.pipe(gulpif(env === 'production', rename({suffix: '.min'})))
    .pipe(gulpif(env === 'production', cleanCSS({debug: true})))
    .pipe(gulpif(env === 'development', sourcemaps.init()))
    .pipe(gulpif(env === 'development', sourcemaps.write('../maps')))
    .pipe(gulp.dest(outputDir + 'assets/css'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({message: 'SASS OK'}));
});



///////////////////////////////////////////////////////////////////////
// Task: JavaScript
///////////////////////////////////////////////////////////////////////

gulp.task('js', function() {
  gulp.src(jsSources)
    .pipe(plumber())
    .pipe(concat('app.js'))
    .pipe(gulpif(env === 'production', uglify()))
    //.pipe(gulpif(env === 'production', rename({suffix: '.min'})))
    .pipe(gulp.dest(outputDir + 'assets/js'))
    .pipe(browserSync.reload({stream: true}))
    .pipe(notify({message: 'JS OK'}));
});



///////////////////////////////////////////////////////////////////////
// Task: HTML
///////////////////////////////////////////////////////////////////////

gulp.task('html', function() {
  gulp.src('app/development/*.html')
  .pipe(plumber())
  .pipe(gulpif(env === 'production', minifyHTML()))
  .pipe(gulpif(env === 'production', gulp.dest(outputDir)))
  .pipe(browserSync.reload({stream: true}))
  .pipe(notify({message: 'HTML OK'}));
});


///////////////////////////////////////////////////////////////////////
// Task: Compress images
///////////////////////////////////////////////////////////////////////

gulp.task('imagemin', function () {
    return gulp.src('app/development/assets/images/**/*')
        .pipe(gulpif(env === 'production', imagemin({
            progressive: true,
            use: [pngquant()]
        })))
        .pipe(gulpif(env === 'production', gulp.dest('app/production/assets/images')))
        .pipe(gulpif(env === 'production', notify({message: 'IMAGES COMPRESSED'})));
});


///////////////////////////////////////////////////////////////////////
// Task: BrowserSync
///////////////////////////////////////////////////////////////////////

gulp.task('browser-sync', function() {
  browserSync.init({
    server: {
        baseDir: outputDir
    }
  });
});



///////////////////////////////////////////////////////////////////////
// Task: WATCH
///////////////////////////////////////////////////////////////////////

gulp.task('watch', function () {
  gulp.watch(jsSources, ['js']);
  gulp.watch('app_components/sass/**/*.scss', ['sass']);
  gulp.watch('app/development/*.html', ['html']).on('change', browserSync.reload);
});



///////////////////////////////////////////////////////////////////////
// Task: Copy JS Vendor files (/assets/js/vendor)
///////////////////////////////////////////////////////////////////////

gulp.task('copy-js-vendors', function() {
  gulp.src('app/development/assets/js/vendor/*.*')
    .pipe(plumber())
    .pipe(gulpif(env === 'production', gulp.dest('app/production/assets/js/vendor')))
    .pipe(gulpif(env === 'production', notify({message: 'JS VENDORS COPIED'})));
});


//////////////////////////////////////////////////////////////////////
// Task: Copy root files [favicon.ico, apple-touch-icon.png, robots.txt]
gulp.task('copy-root-files', function() {
  gulp.src('app/development/*.{ico,png,txt,xml,gitignore,htaccess}')
    .pipe(plumber())
    .pipe(gulpif(env === 'production', gulp.dest('app/production')))
    .pipe(gulpif(env === 'production', notify({message: 'ROOT FILES COPIED'})));
});

///////////////////////////////////////////////////////////////////////
// Task: DEFAULT
///////////////////////////////////////////////////////////////////////

gulp.task('default', ['copy-root-files', 'copy-js-vendors', 'imagemin', 'js', 'sass', 'html', 'browser-sync', 'watch']);
