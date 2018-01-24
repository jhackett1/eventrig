var gulp = require('gulp');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');

// Compile ma sass for me and autoprefix it
gulp.task('sass', function(){
  return gulp.src('./public/css/*.sass')
  .pipe(sass().on('error', sass.logError))
  // And autoprefix it too
  .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
  }))
  .pipe(gulp.dest('./public/css/'));
})

gulp.task('default', function(){
  gulp.watch('./public/css/*.sass', ['sass']);
})
