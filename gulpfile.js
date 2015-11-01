var gulp = require('gulp');
var merge = require('merge2');
var browser = require('browser-sync');
var $ = require('gulp-load-plugins')();

var config = {
    sassPath: './src/sass',
    bowerDir: './bower_components'
};
var bower_js_list=[
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js'
];

//
// icons
//
gulp.task('fonts', function() {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest('out/fonts'))
        .pipe(browser.reload({stream:true}))
        ;
});

//
// server
//
gulp.task('nodemon', function(cb) {
    $.nodemon({script: './src/ts/compiled/app.js'})
    .on('start', function() {
        cb();
    })
    .on('restart', function() {
        console.log('nodemon restarted!');
    });
});
gulp.task('jsserver', ['nodemon'], function() {
    browser.init(null, {
        proxy: 'http://localhost:7000',
        port: 3000
    });
});

gulp.task('server', function() {
    browser({
        server: {
            baseDir: './out'
        }
    });
});

//
// html
//
gulp.task('html', function(){
    gulp.src('src/**/*.html')
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe(gulp.dest('out'))
        .pipe(browser.reload({stream:true}))
        ;
    
});

//
// user css
//
gulp.task('css', function() {
    return gulp.src([config.sassPath + '/**/*.scss', '!'+config.sassPath + '/all.scss'])
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.frontnote({
            css: '../out/css/style.css'
        }))
        .pipe($.sass({
            //outputStyle: 'compressed',
        })
        )
        .pipe($.autoprefixer())
        .pipe(gulp.dest('./out/css'))
        .pipe(browser.reload({stream:true}))
        ;
});

//
// bower css
//
gulp.task('bowercss', function() {
    return gulp.src(config.sassPath + '/all.scss')
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.sass({
            //outputStyle: 'compressed',
            includePaths: [
                config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                config.bowerDir + '/font-awesome/scss',
            ]
        })
        )
        .pipe(gulp.dest('./out/css'))
        ;
});

//
// ts
//
gulp.task('tsc', function(){
    var tsResult = gulp.src(['src/ts/**/*.ts', '!src/ts/definitions/**/*.ts'])
        .pipe($.typescript({
            //declaration: true,
            noExternalResolve: true,
            //module: 'commonjs',
            sortOutput: true,
            noImplicitAny: true,
            noLib: false,            
            removeComments: true,
            target: "ES5"                         
        }));
 
    tsResult.js
        .pipe($.concat('app.js'))        
        .pipe(gulp.dest('src/ts/compiled'))
        ;
 /*
    return merge([
        tsResult.dts
            .pipe(gulp.dest('src/ts/definitions')),
        tsResult.js
            .pipe($.concat('output.js'))        
            .pipe(gulp.dest('src/ts/compiled'))
    ]);
    */       
});

//
// user js
//
gulp.task('js', ['tsc'], function() {
    gulp.src(['src/js/**/*.js','!src/js/min/**/*.js'])
        .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
        .pipe($.jslint({           
        }))
        .on('error', function (error) {
            console.error(String(error));
        })        
        .pipe($.uglify())
        .pipe(gulp.dest('out/js'))
        .pipe(browser.reload({stream:true}))
        ;
});

//
// bower js
//
gulp.task('bowerjs', function(){
  gulp.src(bower_js_list)
    .pipe($.plumber({errorHandler: $.notify.onError('<%= error.message %>')}))
    //.pipe($.uglify())
    .pipe($.concat('all.min.js'))
    .pipe(gulp.dest('out/js'))
    ;
});

//
// watch
//
gulp.task('watch', ['server'], function() {
    gulp.watch(['src/js/**/*.js','!src/js/min/**/*.js'],['js']);
    gulp.watch(['src/sass/**/*.scss', '!src/sass/all.scss'],['css']);
    gulp.watch('src/*.html',['html']);
});

// default
gulp.task('default', ['bowerjs', 'bowercss', 'fonts', 
    'html', 'js', 'css']);
