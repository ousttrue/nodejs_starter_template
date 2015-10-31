var gulp = require("gulp");

//
// sass
//
var sass = require("gulp-sass");
var autoprefixer = require("gulp-autoprefixer");
 
gulp.task("sass", function() {
    gulp.src("src/sass/**/*scss")
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(gulp.dest("out/css"));
});
