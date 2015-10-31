var gulp = require("gulp");

//
// server
//
var browser = require("browser-sync");
gulp.task("server", function() {
    browser({
        server: {
            baseDir: "./out"
        }
    });
});

//
// html
//
gulp.task("html", function(){

    gulp.src("src/**/*.html")
        .pipe(gulp.dest("out"))
        .pipe(browser.reload({stream:true}))
        ;
    
});

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
        .pipe(gulp.dest("out/css"))
        .pipe(browser.reload({stream:true}))
        ;
});

//
// uglify
//
var uglify = require("gulp-uglify");
gulp.task("js", function() {
    gulp.src(["src/js/**/*.js","!src/js/min/**/*.js"])
        .pipe(uglify())
        .pipe(gulp.dest("out/js/min"))
        .pipe(browser.reload({stream:true}))
        ;
});

//
// watch
//
gulp.task("default", ['server'], function() {
    gulp.watch(["src/js/**/*.js","!src/js/min/**/*.js"],["js"]);
    gulp.watch("src/sass/**/*.scss",["sass"]);
    gulp.watch("src/*.html",["html"]);
});
