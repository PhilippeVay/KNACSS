// Requires
var gulp = require('gulp');

// Include plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');
// var sourcemaps = require('gulp-sourcemaps');
var autoprefixer = require('gulp-autoprefixer');

// tâche CSS = compile vers knacss.css et knacss-unminified.css
gulp.task('css', function () {
  return gulp.src('./sass/knacss.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(rename('knacss-unminified.css'))
    .pipe(gulp.dest('./css/'))
    .pipe(rename('knacss.css'))
    //.pipe(sourcemaps.init())
    .pipe(minifycss())
    //.pipe(sourcemaps.write('.', {includeContent: false}))
    .pipe(gulp.dest('./css/'));
});

gulp.task('grillade', function() {
  return gulp.src(['./sass/_config/_breakpoints.scss', './sass/grids/_grillade.scss'])
    .pipe(concat('grillade.scss'))
    .pipe(gulp.dest('./css/'))
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(gulp.dest('./css/'));
});

// Stylelint: https://github.com/olegskl/gulp-stylelint
gulp.task('lint-css', function lintCssTask() {
  const gulpStylelint = require('gulp-stylelint');
  // const myStylelintFormatter = require('my-stylelint-formatter');

  return gulp
    .src('./css/knacss-unminified.css')
    .pipe(gulpStylelint({
      failAfterError: true,
      reportOutputDir: 'reports/lint',
      reporters: [
        {formatter: 'verbose', console: true},
        // {formatter: 'json', save: 'report.json'},
        // {formatter: myStylelintFormatter, save: 'my-custom-report.txt'}
      ],
      debug: true
    }));
});

// Watcher
gulp.task('watch', function() {
  gulp.watch(['./sass/*.scss'], ['css']);
});


gulp.task('default', ['css']);
