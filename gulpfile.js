const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const rimraf = require('gulp-rimraf');
const rename = require('gulp-rename');


// build sass
gulp.task('compile-sass', function() {
  return gulp.src('src/css/build.scss') // Path to your SASS files
    .pipe(sass({
      outputStyle: 'compressed',
      precision: 3,
      errLogToConsole: true,
      includePaths: ['node_modules/']
    }).on('error', console.error))
    .pipe(gulp.dest('dist')); // Output directory for CSS files
});
gulp.task('rename-css', function() {
  return gulp.src('dist/build.css') // Path to your CSS file
    .pipe(rimraf())
    .pipe(rename('OPACUserCSS.min.css'))
    .pipe(gulp.dest('dist')); // Output directory for CSS file
});
gulp.task('sass', gulp.series('compile-sass', 'rename-css'));


// watch sass
gulp.task('watch-sass', function() {
  gulp.watch('src/css/build.scss', gulp.series('compile-sass', 'rename-css'));
});
