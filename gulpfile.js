const { src, dest, series, parallel, watch } = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cssnano = require('gulp-cssnano')
const autoprefixer = require('gulp-autoprefixer')
const rename = require('gulp-rename')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify')
const imagemin = require('gulp-imagemin')
const sourcemaps = require('gulp-sourcemaps')
const kit = require('gulp-kit')
const clean = require('gulp-clean')
const browserSync = require('browser-sync').create()
const reload = browserSync.reload

const paths = {
	html: `./html/**/*.kit`,
	sass: `./src/sass/**/*.scss`,
	sassDest: `./dist/css`,
	js: `./src/js/**/*.js`,
	jsDest: `./dist/js`,
	img: `./src/img/*`,
	imgDest: `./dist/img`,
	dist: `./dist`,
}

const sassCompiler = done => {
	src(paths.sass)
		.pipe(sourcemaps.init())
		.pipe(sass().on(`error`, sass.logError))
		.pipe(autoprefixer())
		.pipe(cssnano())
		.pipe(rename({ suffix: `.min` }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.sassDest))
	done()
}

const javaScript = done => {
	src(paths.js)
		.pipe(sourcemaps.init())
		.pipe(
			babel({
				presets: ['@babel/env'],
			})
		)
		.pipe(uglify())
		.pipe(rename({ suffix: `.min` }))
		.pipe(sourcemaps.write())
		.pipe(dest(paths.jsDest))
	done()
}

const imagesMin = done => {
	src(paths.img).pipe(imagemin()).pipe(dest(paths.imgDest))
	done()
}

const handleKits = done => {
	src(paths.html).pipe(kit()).pipe(dest(`./`))
	done()
}

const cleanFiles = done => {
	src(paths.dist, { read: false }).pipe(clean())
	done()
}

const startBrowserSync = done => {
	browserSync.init({
		server: {
			baseDir: './',
		},
	})
	done()
}

const reloadBrowser = done => {
	watch(`.*html`).on(`change`, reload)
	watch([paths.html, paths.sass, paths.js], parallel(sassCompiler, javaScript)).on(`change`, reload)
	watch(paths.img, imagesMin).on(`change`, reload)
	done()
}

const mainfunctions = parallel(handleKits, sassCompiler, javaScript, imagesMin)
exports.cleanFiles = cleanFiles
exports.default = series(mainfunctions, startBrowserSync, reloadBrowser)
