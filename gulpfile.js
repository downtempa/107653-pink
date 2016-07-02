"use strict";

var gulp = require("gulp");
var sass = require("gulp-sass");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var server = require("browser-sync");
var mqpacker = require("css-mqpacker");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var runSequence = require("run-sequence");
var del = require("del");


//STYLES
gulp.task("style", function() {
	gulp.src("app/sass/style.scss")
		.pipe(plumber())
		.pipe(sass())
		.pipe(gulp.dest("build/css"))
		.pipe(postcss([
			autoprefixer({
				browsers: [
					"last 1 version",
					"last 2 Chrome versions",
					"last 2 Firefox versions",
					"last 2 Opera versions",
					"last 2 Edge versions"
				]
			}),
			mqpacker({
				sort: true
			})
		]))
		.pipe(gulp.dest("build/css"))
		.pipe(minify({
			restructure: true,
			debug: true
		}))
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("build/css"))
		.pipe(server.reload({
			stream: true
		}));
});


//SERVER & WATCHER
gulp.task("serve", ["style"], function() {
	server.init({
		server: "build"
	})

	gulp.watch("app/sass/**/*.scss", ["style"]);
	gulp.watch("build/*.html")
		.on("change", server.reload);
});

//IMG
gulp.task("images", function() {
	return gulp.src("build/img/**/*.{png,jpg,gif}")
		.pipe(imagemin({
			optimizationLevel: 3,
			progressive: true
		}))
		.pipe(gulp.dest("build/img"));
});


//COPY
//fonts
gulp.task("fonts", function() {
	return gulp.src("app/fonts/**/*.{woff,woff2}")
		.pipe(gulp.dest("build/fonts"))
});

//img
gulp.task("img", function() {
	return gulp.src("app/img/**")
		.pipe(gulp.dest("build/img"))
});

//js
gulp.task("js", function() {
	return gulp.src("app/js/**")
		.pipe(gulp.dest("build/js"))
});

//html
gulp.task("html", function() {
	return gulp.src("app/*.html")
		.pipe(gulp.dest("build"))
});


//CLEAN
gulp.task("clean:build", function() {
	return del.sync("build");
});


//BUILD
gulp.task("build", function(callback) {
	runSequence("clean:build", ["style", "fonts", "img", "js", "html"],
		"serve",
		callback
	)
})