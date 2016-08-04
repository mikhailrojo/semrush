var gulp = require('gulp'),
  browserSync= require('browser-sync'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  precss = require('precss'),
  cssnano = require('cssnano'),
  uglify = require('gulp-uglify'),
  htmlmin = require('gulp-htmlmin'),
  rename = require('gulp-rename')
  code = 'code',
  build = 'build';

gulp.task('server', function(){
  browserSync.init({
      server: {
          baseDir: build
      }
  });
});

gulp.task('html', function(){
  gulp.src(code + '/*.html')
    .pipe(htmlmin({collapseWhitespace: true, processScripts: ["text/template"]}))
    .pipe(gulp.dest(build));
});

gulp.task('js', function(){
  gulp.src(code + '/*.js')
    .pipe(uglify())
    .pipe(gulp.dest(build+'/js'));
});

gulp.task('css', function(){
  gulp.src(code + '/style.scss')
    .pipe(postcss([
      autoprefixer(),
      precss(),
      cssnano()
    ]))
    .pipe(rename("style.css"))
    .pipe(gulp.dest(build+'/css'));
});

gulp.task('watch', function(){
  gulp.watch(code +'/*.html', ['html', browserSync.reload]);
  gulp.watch(code+ '/style.scss', ['css', browserSync.reload]);
  gulp.watch(code+ '/*.js', ['js', browserSync.reload]);
});
gulp.task('default', ['html', 'css', 'server', 'js', 'watch']);
