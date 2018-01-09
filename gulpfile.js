// Requires
var gulp = require('gulp');

// Include plugins
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var minifycss = require('gulp-clean-css');
var autoprefixer = require('gulp-autoprefixer');
const pug = require('gulp-pug');
const browserSync = require('browser-sync').create();
const backstop = require('backstopjs');

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


// Tests (pour l'instant uniquement grillade)
// Description des 4 tâches :
// 1/ La tâche test:compile génère les pages HTML de test à partir de templates pug/jade
// 2/ La tâche test:server lance un serveur sur le port :6768 qui sera utilisé par les tâches de test proprement dites
// 3/ et 4/ backstopJS :
// ⇒ L'outil de test de régression visuelle backstopJS réalise des captures du rendu d'éléments (ou de page, à éviter) ici avec Chromy donc Chrome Headless qu'il compare à des images de référence réalisées auparavant. Il faut donc le lancer une 1ère fois avec l'argument 'reference' (ce que fait la tâche test:reference) pour réaliser les captures de références puis ensuite le lancer à chaque fois avec l'argument test (ce que fait la tâche test:run)
// 3/ La tâche test:reference doit être lancée une 1ère fois afin que backstopJS génère les images qui serviront ensuite de référence aux tests ultérieurs
// 4/ La tâche test:run réalise les captures des mêmes éléments que la tâche 3/ test:reference, compare les 2 versions et génère un rapport HTML listant :
//      * les images identiques ⇒ OK = les images reference et test càd avant/après sont identiques, pas de régression
//      * montrant une erreur ⇒ Fail = l'image de test présente des différences par rapport à l'image de référence : il y a régression visuelle. Cette régression peut être attendue (les CSS ont volontairement changé et l'élément est à présent stylé comme prévu) ou détecter une erreur (des modifications CSS sur cet élément ou ailleurs ont des répercussions qu'on ne souhaitait pas). Il faut alors soit valider la modification soit corriger les CSS et recommencer les tests.
//
// 1/ Génération des pages de test HTML à partir de pug/jade
gulp.task('test:compile', function buildHTML() {
  return gulp.src('test/{index,grid*}.pug')
  .pipe(pug({
    "pretty": "  "
  }))
  .pipe(gulp.dest('test/'))
});
// 2/ Serveur statique pour BackstopJS et Chrome Headless
gulp.task('test:server', function() {
    browserSync.init({
        server: {
            baseDir: "./",
            index: "test/index.html"
        },
        port: 6768,
        open: false // Decide which URL to open automatically when Browsersync starts => don't
    });
});
// 3/ Premier lancement de backstopJS, à faire une fois avant de lancer la tâche de test 4/ ci-dessous
gulp.task('test:reference', function() {
  // @TODO En parallèle ou sync? Ne doit pas consommer trop de RAM donc sync préférable
  backstop('reference', {config:'test/backstop.grillade1.json'});
  backstop('reference', {config:'test/backstop.grillade2.json'});
  backstop('reference', {config:'test/backstop.grillade3.json'});
});
// 4/ Le lancement "habituel" de backstopJS (possible seulement après avoir lancé la tâche de test précédente 3/)
gulp.task('test:run', function() {
  // @TODO En parallèle ou sync? Ne doit pas consommer trop de RAM donc sync préférable
  backstop('test', {config:'test/backstop.grillade1.json'});
  backstop('test', {config:'test/backstop.grillade2.json'});
  backstop('test', {config:'test/backstop.grillade3.json'});
});
gulp.task('test', ['test:compile']);

// Watcher
gulp.task('watch', function() {
  gulp.watch(['./sass/*.scss'], ['css']);
  gulp.watch(['./test/*.pug'], ['test']);
});


gulp.task('default', ['css']);
