var gulp = require("gulp");

//
// sass
//
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
var frontnote = require("gulp-frontnote");
 
gulp.task("sass", function() {
    gulp.src("src/sass/**/*scss")
        .pipe(frontnote({
            css: '../out/css/style.css'
        }))
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("out/css"));
});

//
// uglify
//
var uglify = require("gulp-uglify");
 
gulp.task("js", function() {
    gulp.src(["src/js/**/*.js","!src/js/min/**/*.js"])
        .pipe(uglify())
        .pipe(gulp.dest("out/js/min"));
});
