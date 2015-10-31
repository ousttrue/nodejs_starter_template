var gulp = require("gulp");

//
// sass
//
var sass = require("gulp-sass");

gulp.task("sass", function() {
    gulp.src("src/sass/**/*scss")
        .pipe(sass())
        .pipe(gulp.dest("out/css"));
});
