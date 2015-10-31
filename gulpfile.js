var gulp = require("gulp");
var $ = require('gulp-load-plugins')();

var config = {
    sassPath: './src/sass',
    bowerDir: './bower_components'
};

//
// bower
//
gulp.task('bower', function() {
    return $.bower()
        .pipe(gulp.dest(config.bowerDir))
});

//
// icons
//
gulp.task('icons', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('out/fonts'))
        .pipe(browser.reload({stream:true}))
        ;
});

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
        .pipe($.plumber())    
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
        .pipe($.plumber())    
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
// js
//
var uglify = require("gulp-uglify");
gulp.task("js", function() {
    gulp.src(["src/js/**/*.js","!src/js/min/**/*.js"])
        .pipe($.plumber())
        .pipe($.jslint({           
        }))
        .on('error', function (error) {
            console.error(String(error));
        })        
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
