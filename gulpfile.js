var gulp = require('gulp');
var merge = require('merge2');
var browser = require('browser-sync');
var mainBowerFiles = require('main-bower-files');
var $ = require('gulp-load-plugins')();

var config = {
    bowerDir: './src/client/bower_components',
    clientSourceDir: './src/client',
    clientBuildDir: './build/client',

    serverSourceDir: './src/server',
    serverBuildDir: './build',
};
var tsConfig = require(config.serverSourceDir + '/tsconfig.json');

//
// initilaize
//
gulp.task('tsd', function (cb) {
    return $.tsd({
        'command': 'reinstall',
        'latest': true,
        'config': config.serverSourceDir + '/tsd.json',
        'opts': {
        }
    }, cb);
});
gulp.task('bower', function () {
    return $.bower({
        cwd: config.clientSourceDir
    });
});
gulp.task('init', ['tsd', 'bower'], function () {
});

//
// server
//
gulp.task('nodemon', ['tsc'], function () {
    $.nodemon({
        //cwd: config.serverBuildDir,
        script: config.serverBuildDir + '/app.js', 
        //ext: 'js', // 監視するファイルの拡張子
        //ignore: [config.clientBuildDir]
        env: {
            client_dir: config.clientBuildDir
        }
    })
        .on('start', function () {
        })
        .on('restart', function () {
            console.log('nodemon restarted!');
            browser.reload();
        })
        .on('change')
    ;
});
gulp.task('server', ['nodemon'], function () {
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
// preprocess client side
//

//
// html
//
gulp.task('html', function () {
    return gulp.src(config.clientSourceDir + '/*.html')
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.htmlhint())
        .pipe($.htmlhint.reporter())        
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
            browser: true,
            continue: true,
            devel: true,
            indent: 2,
            maxerr: 50,
            newcap: true,
            nomen: true,
            plusplus: true,
            regexp: true,
            sloppy: true,
            vars: false,
            white: true
        }))
        .on('error', function (error) {
            console.error(String(error));
        })
        //.pipe($.uglify())
        .pipe(gulp.dest(config.clientBuildDir + '/js'))
        .pipe(browser.reload({ stream: true }))
        ;
});

//
// bower js
//
gulp.task('bowerjs', function () {
    var files=mainBowerFiles({
        paths: {
            bowerDirectory: config.bowerDir,
            bowerJson: config.clientSourceDir + '/bower.json'
        }
    });
    files.push(config.bowerDir+'/taffydb/taffy.js');
    
    return gulp.src(files)
        .pipe($.plumber({ errorHandler: $.notify.onError('<%= error.message %>') }))
        .pipe($.filter('*.js'))
        .pipe($.debug({title: 'bowerjs files:'}))
        //.pipe($.uglify())
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
    gulp.watch(
        config.serverSourceDir + '/**/*.ts',
        ['tsc']);
});

// tasks
gulp.task('build', ['tsc',
    'bowerjs', 'bowercss', 'fonts',
    'html', 'js', 'css']);

gulp.task('default', ['build', 'watch']);
