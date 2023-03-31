const gulp = require('gulp');
const path = require("path");
const del = require("del");
const plumber = require("gulp-plumber");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");
const csso = require("postcss-csso");
const rename = require("gulp-rename");
const htmlmin = require("gulp-htmlmin");
const terser = require("gulp-terser");
const imagemin = require("gulp-imagemin");
const webp = require("gulp-webp");
const svgstore = require("gulp-svgstore");
const sync = require("browser-sync").create();

const gulpReplace = require('./gulpfile.replace');

const baseDir = 'build';

// * Clean
const clean = () => del(baseDir);

// * Copy
const copy = (done) => {
  gulp.src([
    "source/*.ico",
    "source/assets/fonts/*.{ttf,woff2,woff}",
  ], {
    base: "source",
  })
    .pipe(gulp.dest(baseDir))
  done();
};
exports.copy = copy;

// * HTML
const html = () => {
  return gulp.src([
    "source/public/**/*.html",
    // Skip include templates
    "!source/public/include/**/*.html",
  ], {
    base: 'source/public',
  })
    .pipe(
      gulpReplace({})
    )
    .pipe(htmlmin({ /* collapseWhitespace: true */ }))
    .pipe(gulp.dest(baseDir));
};
exports.html = html;

// * Styles
const styles = () => {
  return gulp.src("source/assets/css/**/*.css")
    .pipe(plumber())
    .pipe(postcss([
      autoprefixer(),
      // csso(),
    ]))
    // .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(baseDir + "/assets/css"))
    .pipe(sync.stream());
};
exports.styles = styles;

// * Scripts
const scripts = async () => {
  return gulp.src("source/assets/js/**/*.js")
    //.pipe(terser())
    //.pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(baseDir + "/assets/js"))
    .pipe(sync.stream());
};
exports.scripts = scripts;

// * Images
const copyImages = () => {
  return gulp.src([
    "source/assets/img/**/*.{png,jpg,svg}",
    // Skip svg sprites
    "!source/assets/img/sprites/**/*.svg",
  ], {
    base: "source",
  })
    .pipe(gulp.dest(baseDir + "/assets/img"))
};
exports.copyImages = copyImages;

// WebP
const createWebp = () => {
  return gulp.src("source/assets/img/**/*.{jpg,png}")
    .pipe(webp({ quality: 90 }))
    .pipe(gulp.dest(baseDir + "/assets/img"))
};
exports.createWebp = createWebp;

// Optimize Images
const optimizeImages = () => {
  return gulp.src([
    "source/assets/img/**/*.{png,jpg,svg}",
    // Skip svg sprites
    "!source/assets/img/sprites/**/*.svg",
  ], {
    base: "source",
  })
    .pipe(imagemin([
      imagemin.mozjpeg({ progressive: true }),
      imagemin.optipng({ optimizationLevel: 3 }),
      imagemin.svgo(),
    ]))
    .pipe(gulp.dest(baseDir + "/assets/img"))
}
exports.optimizeImages = optimizeImages;

// Sprite
const createSprite = () => {
  return gulp.src("source/assets/img/sprites/**/*.svg", {
    base: 'source/assets/img/sprites',
  })
    .pipe(rename((file) => {
      const name = file.dirname.split(path.sep).filter(e => e !== '.' && e !== '..');
      name.push(file.basename);
      file.basename = name.join('-');
    }))
    .pipe(imagemin([
      imagemin.svgo(),
    ]))
    .pipe(svgstore({
      inlineSvg: true,
    }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest(baseDir + "/assets/img"));
}
exports.createSprite = createSprite;

const assetsImagesBuild = gulp.parallel(
  // copyImages,
  optimizeImages,
  createWebp,
  createSprite,
);
exports.assetsImagesBuild = assetsImagesBuild;

// Build
const build = gulp.series(
  clean,
  copy,
  gulp.parallel(
    html,
    // stylesSass,
    styles,
    scripts,
    assetsImagesBuild,
  ),
);
exports.build = build;

// Server
const server = (done) => {
  sync.init({
    server: {
      baseDir,
    },
    browser: 'chrome',
    cors: true,
    notify: false,
    ui: false,
  });
  done();
};
exports.server = server;

// Reload
const reload = (done) => {
  sync.reload();
  done();
};

// Watcher
const watcher = () => {
  gulp.watch("source/**/*.html", gulp.series(html, reload));
  // gulp.watch("source/assets/sass/**/*.scss", gulp.series(stylesSass));
  // gulp.watch("source/assets/sass/**/*.css", gulp.series(styles));
  gulp.watch("source/assets/css/**/*.css", gulp.series(styles));
  gulp.watch("source/assets/js/*.js", gulp.series(scripts));
  gulp.watch("source/assets/img/**/*", gulp.series(assetsImagesBuild));
};

// Default (build & serve)
exports.default = gulp.series(
  build,
  gulp.series(
    server,
    watcher
  )
);
