// Requires
var gulp = require('gulp');

// Include plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');

// tâche CSS = compile vers knacss.css et knacss-unminified.css
gulp.task('css', function () {
  return gulp.src('./sass/knacss.scss')
    .pipe(sass({
      outputStyle: 'expanded' // CSS non minifiée plus lisible ('}' à la ligne)
    }))
    .pipe(autoprefixer())
    .pipe(rename('knacss-unminified.css'))
    .pipe(gulp.dest('./css/'))
    .pipe(rename('knacss.css'))
    .pipe(minifycss())
    .pipe(gulp.dest('./css/'));
});

// grillade est aussi compilé dans une CSS indépendante (en plus d'être importé dans knacss.scss ci-dessus)
gulp.task('grillade', function() {
  return gulp.src('./sass/components/grillade-grid.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(gulp.dest('./css/'));
});

// l'ancienne version de grillade présente dans KNACSS v6
gulp.task('grillade-flex', function() {
  return gulp.src('./sass/components/grillade-flex.scss')
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(minifycss())
    .pipe(gulp.dest('./css/'));
});

// tests (pour l'instant uniquement grillade)
// Génération des pages de test HTML à partir de pug/jade
gulp.task('test:grillade', function buildHTML() {
  return gulp.src('test/{index,grid*}.pug')
  .pipe(pug({
    "pretty": "  "
  }))
  .pipe(gulp.dest('test/'))
});
gulp.task('test', ['test:grillade']);

// Watcher
gulp.task('watch', function() {
  gulp.watch(['./sass/*.scss'], ['css']);
  gulp.watch(['./test/*.pug'], ['test']);
});


gulp.task('default', ['css']);
