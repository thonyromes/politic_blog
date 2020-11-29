// import dependacies
const gulp = require("gulp"),
  autoPrefixer = require("gulp-autoprefixer"),
  cleanCss = require("gulp-clean-css"),
  newer = require("gulp-newer"),
  imageMin = require("gulp-imagemin"),
  webP = require("gulp-webp"),
  less = require("gulp-less"),
  rename = require("gulp-rename"),
  uglify = require("gulp-uglify"),
  babel = require("gulp-babel"),
  pug = require("gulp-pug"),
  cached = require("gulp-cached"),
  pugInheritance = require("gulp-pug-inheritance"),
  browserSync = require("browser-sync").create();

// create tasks object

const Tasks = {
  js: {
    src: ["./src/js/*.+(js)", "!./src/js/_*.+(js)"],
    dst: "./static/js/",
    action: js,
  },
  less: {
    src: ["./src/css/*.+(less)", "!./src/css/_*.+(less)"],
    dst: "./static/css/",
    action: lessFn,
  },
  css: {
    src: ["./src/css/*.+(css)", "!./src/css/_*.+(css)"],
    dst: "./static/css/",
    action: css,
  },
  image: {
    src: "./src/img/**",
    dst: "./static/img/",
    action: image,
  },
  webpImg: {
    src: "./src/img/images/**",
    dst: "./static/img/compressed/",
    action: webpImg,
  },
  php: {
    src: ["./src/php/*.+(php)", "!./src/php/_*.+(php)"],
    dst: "./static/php/",
    action: php,
  },
  font: {
    src: "./src/font/**",
    dst: "./static/font/",
    action: font,
  },
  html: {
    src: "./**/*.+(html)",
    action: html,
  },
  pug: {
    src: "./src/pug/**/*.+(pug)",
    dst: "./",
    action: pugFn,
  },
};

// initialize server and browser reloader

function server(done) {
  browserSync.init({
    server: {
      baseDir: "./",
    },
    port: 3000,
  });
  done();
}

function reload(done) {
  browserSync.reload();
  done();
}

// create task functions

function image() {
  return gulp
    .src(Tasks.image.src)
    .pipe(newer(Tasks.image.dst))
    .pipe(
      imageMin([
        imageMin.gifsicle({
          interlaced: true,
        }),
        imageMin.mozjpeg({
          quality: 75,
          progressive: true,
        }),
        imageMin.optipng({
          optimizationLevel: 5,
        }),
        imageMin.svgo({
          plugins: [
            {
              removeViewBox: true,
              // collapseGroups: true,
            },
            { cleanupIDs: false },
          ],
        }),
      ])
    )
    .pipe(gulp.dest(Tasks.image.dst))
    .pipe(browserSync.stream());
}

function webpImg() {
  return gulp
    .src(Tasks.webpImg.src)
    .pipe(newer(Tasks.webpImg.dst))
    .pipe(
      webP({
        quality: 80,
      })
    )
    .pipe(gulp.dest(Tasks.webpImg.dst))
    .pipe(browserSync.stream());
}

function lessFn() {
  return gulp
    .src(Tasks.less.src)
    .pipe(less())
    .pipe(autoPrefixer("last 1 versions"))
    .pipe(gulp.dest(Tasks.less.dst))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest(Tasks.less.dst))
    .pipe(browserSync.stream());
}

function css() {
  return gulp
    .src(Tasks.css.src)
    .pipe(autoPrefixer("last 1 versions"))
    .pipe(gulp.dest(Tasks.css.dst))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(cleanCss())
    .pipe(gulp.dest(Tasks.css.dst))
    .pipe(browserSync.stream());
}

function js() {
  return gulp
    .src(Tasks.js.src)
    .pipe(gulp.dest(Tasks.js.dst))
    .pipe(
      rename({
        suffix: ".min",
      })
    )
    .pipe(
      babel({
        presets: ["@babel/env"],
      })
    )
    .pipe(uglify())
    .pipe(gulp.dest(Tasks.js.dst))
    .pipe(browserSync.stream());
}

function php() {
  return gulp
    .src(Tasks.php.src)
    .pipe(gulp.dest(Tasks.php.dst))
    .pipe(browserSync.stream());
}

function font() {
  return gulp
    .src(Tasks.font.src)
    .pipe(newer(Tasks.font.dst))
    .pipe(gulp.dest(Tasks.font.dst))
    .pipe(browserSync.stream());
}

function html() {
  return gulp
    .src(Tasks.html.src)
    .pipe(
      newer(Tasks.html.src, {
        extension: ".html",
      })
    )
    .pipe(browserSync.stream());
}

function pugFn() {
  return gulp
    .src(Tasks.pug.src)
    .pipe(
      newer(Tasks.pug.src, {
        extension: ".pug",
      })
    )
    .pipe(cached("pug"))
    .pipe(
      pugInheritance({
        basedir: "./src/pug/pages",
        skip: "node_modules",
      })
    )
    .pipe(
      pug({
        locals: {},
        pretty: true,
      })
    )
    .pipe(gulp.dest(Tasks.pug.dst))
    .pipe(browserSync.stream());
}

function watch(done) {
  Object.keys(Tasks).forEach(function (task, i) {
    gulp.watch(Tasks[task].src, gulp.series(Tasks[task].action, reload));
  });
  done();
}

gulp.task("css", gulp.series(Tasks.css.action));
gulp.task("less", gulp.series(Tasks.less.action));
gulp.task("js", gulp.series(Tasks.js.action));
gulp.task("image", gulp.series(Tasks.image.action));
gulp.task("webpImg", gulp.series(Tasks.webpImg.action));
gulp.task("php", gulp.series(Tasks.php.action));
gulp.task("font", gulp.series(Tasks.font.action));
gulp.task("html", gulp.series(Tasks.html.action));
gulp.task("pug", gulp.series(Tasks.pug.action));
gulp.task("browserSync", gulp.series(server));
gulp.task("watch", gulp.series(server, watch));

gulp.task(
  "default",
  gulp.series(
    gulp.parallel(
      lessFn,
      css,
      js,
      html,
      image,
      webpImg,
      pugFn,
    ),
    gulp.series(server, watch)
  )
);
