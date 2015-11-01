var gulp = require('gulp');
var merge = require('merge2');
var browser = require('browser-sync');
var $ = require('gulp-load-plugins')();

var config = {
    bowerDir: './src/client/bower_components',
    clientSourceDir: './src/client',
    clientBuildDir: './build/client',

    serverSourceDir: './src/server',
    serverBuildDir: './build',
};
var bower_js_list = [
    config.bowerDir + '/jquery/dist/jquery.js',
    config.bowerDir + '/bootstrap-sass/assets/javascripts/bootstrap.js'
];
var tsConfig = require(config.serverSourceDir + '/tsconfig.json');

//
// initilaize
//
gulp.task('tsd', function () {
    return gulp.src(config.serverSourceDir + '/gulp_tsd.json').pipe($.tsd());
});
gulp.task('bower', function () {
    return $.bower({ cwd: config.clientSourceDir});
});
gulp.task('init', ['tsd', 'bower'], function () {
});

//
// server
//
gulp.task('nodemon', function (cb) {
    $.nodemon({ script: config.serverBuildDir + '/app.js' })
        .on('start', function () {
            cb();
        })
        .on('restart', function () {
            console.log('nodemon restarted!');
        });
});
gulp.task('jsserver', ['nodemon'], function () {
    browser.init(null, {
        proxy: 'http://localhost:7000',
        port: 3000
    });
});

//
// server ts
//
gulp.task('tsc', function () {
    var tsResult = gulp.src([
        config.serverSourceDir + '/**/*.ts',
        '!' + config.serverSourceDir + '!/definitions/**/*.ts'
    ])
        .pipe($.typescript(tsConfig.compilerOptions))
        ;

    return tsResult.js
        .pipe($.concat('app.js'))
        .pipe(gulp.dest(config.serverBuildDir))
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
// static files
//
gulp.task('server', function () {
    browser({
        server: {
            baseDir: config.clientBuildDir
        }
    });
});

//
// preprocess client side
//

//
// html
//
gulp.task('html', function () {
    return gulp.src(config.clientSourceDir + '/**/*.html')
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe(gulp.dest(config.clientBuildDir))
        .pipe(browser.reload({ stream: true }))
        ;
});

// fonts
gulp.task('fonts', function () {
    return gulp.src(config.bowerDir + '/font-awesome/fonts/**.*')
        .pipe(gulp.dest(config.clientBuildDir + '/fonts'))
        .pipe(browser.reload({ stream: true }))
        ;
});

//
// user css
//
gulp.task('css', function () {
    return gulp.src([
        config.clientSourceDir + '/sass/**/*.scss',
        '!' + config.clientSourceDir + '/sass/all.scss'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
    // relative from styleguide
        .pipe($.frontnote({ css: '../build/client/css/style.css' }))
        .pipe($.sass({
            //outputStyle: 'compressed',
        }))
        .pipe($.autoprefixer())
        .pipe(gulp.dest(config.clientBuildDir + '/css'))
        .pipe(browser.reload({ stream: true }))
        ;
});

//
// bower css
//
gulp.task('bowercss', function () {
    return gulp.src(config.clientSourceDir + '/sass/all.scss')
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.sass({
            //outputStyle: 'compressed',
            includePaths: [
                config.bowerDir + '/bootstrap-sass/assets/stylesheets',
                config.bowerDir + '/font-awesome/scss',
            ]
        }))
        .pipe(gulp.dest(config.clientBuildDir + '/css'))
        .pipe(browser.reload({ stream: true }))
        ;
});

//
// user js
//
gulp.task('js', function () {
    return gulp.src([
        config.clientSourceDir + '/js/**/*.js',
        //config.clientSourceDir + '!/js/min/**/*.js'
    ])
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.jslint({
        }))
        .on('error', function (error) {
            console.error(String(error));
        })
        .pipe($.uglify())
        .pipe(gulp.dest(config.clientBuildDir + '/js'))
        .pipe(browser.reload({ stream: true }))
        ;
});

//
// bower js
//
gulp.task('bowerjs', function () {
    return gulp.src(bower_js_list)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.uglify())
        .pipe($.concat('all.min.js'))
        .pipe(gulp.dest(config.clientBuildDir + '/js'))
        .pipe(browser.reload({ stream: true }))
        ;
});

//
// watch
//
gulp.task('watch', ['server'], function () {
    gulp.watch(config.clientSourceDir + '/*.html',
        ['html']);
    gulp.watch([
        config.clientSourceDir + '/sass/**/*.scss',
        '!' + config.clientSourceDir + '/sass/all.scss'
    ], ['css']);
    gulp.watch([
        config.clientSourceDir + '/js/**/*.js', 
        //'!'+config.clientSourceDir + '/js/min/**/*.js'
    ], ['js']);
});

// default
gulp.task('default', ['tsc',
    'bowerjs', 'bowercss', 'fonts',
    'html', 'js', 'css']);
