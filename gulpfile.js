"use strict";

var gulp = require("gulp");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var sass = require("gulp-sass");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var rename = require("gulp-rename");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var imagemin = require("gulp-imagemin");
var svgstore = require("gulp-svgstore");
var svgmin = require("gulp-svgmin");
var run = require("run-sequence");
var del = require("del");
var flatten = require('gulp-flatten');

var config = {
	dest: 'build/',
	src: 'src/'
};

var path = {
	build: {
		html: config.dest,
		img: config.dest + "img/",
		styles: config.dest + "css/",
		js: config.dest + "js/",
		icons: config.dest + "img/icons/"
	},
	src: {
		html: config.src + "markup/*.html",
		img: config.src + "img/*",
		styles: config.src + "sass/**/*.scss",
		sass: config.src + "sass/style.scss",
		js: config.src + "js/*.js",
		icons: config.src + "img/icons/*.svg",
		fonts: config.src + "fonts/**/*.{woff,woff2}"
	}
};

gulp.task("style", function() {
	gulp.src(path.src.sass)
		.pipe(plumber())
		.pipe(sass())
		.pipe(postcss([
			autoprefixer({
				browsers: [
					"last 3 version",
					"last 2 Chrome versions",
					"last 2 Firefox versions",
					"last 2 Opera versions",
					"last 2 Edge versions"
				]
			})
			//			mqpacker({
			//			sort: true
			//			})
		]))
		.pipe(gulp.dest(path.build.styles))
		.pipe(minify())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest(path.build.styles))
		.pipe(server.reload({
			stream: true
		}));
});

gulp.task("images-min", function() {
	return gulp.src(path.build.img + "*.{png,jpg,gif}")
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true
		}))
		.pipe(gulp.dest(path.build.img));
});

gulp.task("symbols", function() {
	return gulp.src(path.build.icons + "*.svg")
		.pipe(svgmin())
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename("symbols.svg"))
		.pipe(gulp.dest(path.build.img));
});

gulp.task("serve", function() {
	server.init({
		server: "build",
		notify: false,
		open: true,
		ui: false
	});
	gulp.watch(path.src.styles, ["style"]).on("change", server.reload);
	gulp.watch(path.src.html, ["copy-html"]).on("change", server.reload);
});

gulp.task("copy", function() {
	return gulp.src([
			path.src.fonts,
			path.src.img,
			path.src.js
		], {
			base: "."
		})
		.pipe(flatten({
			includeParents: -1
		}))
		.pipe(gulp.dest(config.dest));
});

gulp.task("copy-html", function() {
	return gulp.src([
			path.src.html
		], {
			base: "."
		})
		.pipe(flatten())
		.pipe(gulp.dest(config.dest));
});

gulp.task("copy-icons", function() {
	return gulp.src([
			path.src.icons
		], {
			base: "."
		})
		.pipe(flatten())
		.pipe(gulp.dest(path.build.icons));
});

gulp.task("clean", function() {
	return del(config.dest);
});

gulp.task("build", function(fn) {
	run("clean", "copy", "copy-html", "copy-icons", "style", "images-min", "symbols", fn);
});
