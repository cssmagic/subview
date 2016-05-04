'use strict'

const path = require('path')
const gulp = require('gulp')
const del = require('del')
const stylus = require('gulp-stylus')
const rename = require('gulp-rename')
const wrap = require('gulp-wrap')
const replace = require('gulp-replace')
const uglify = require('gulp-uglify')

const myPath = {
	src: './src/',
	dest: './dist/',
}
const FILENAME = 'subview'
const NS = 'subview'

gulp.task('default', ['clean'], function () {
	gulp.start('js')
	gulp.start('css')
})

gulp.task('clean', function (callback) {
	del(path.join(myPath.dest, '*.*'), callback)
})

gulp.task('js', function() {
	gulp.src(path.join(myPath.src, FILENAME + '.js'))
		.pipe(wrap('*/\n<%= contents %>\n/*'))
		.pipe(wrap({src: path.join(myPath.src, '_wrapper/umd.js')}))
		.pipe(replace(/\/\*\{sample}\*\//g, NS))
		.pipe(replace(/\/\*\* DEBUG_INFO_START \*\*\//g, '/*'))
		.pipe(replace(/\/\*\* DEBUG_INFO_END \*\*\//g, '*/'))
		.pipe(rename(FILENAME + '.umd.js'))
		.pipe(gulp.dest(myPath.dest))
		.pipe(uglify({
			preserveComments: 'some'
		}))
		.pipe(rename(FILENAME + '.umd.min.js'))
		.pipe(gulp.dest(myPath.dest))
})

gulp.task('css', function() {
	gulp.src(path.join(myPath.src, '_wrapper/css.styl'))
		.pipe(stylus({
			linenos: false,
			compress: false,
			errors: true
		}))
		.pipe(rename(FILENAME + '.css'))
		.pipe(gulp.dest(myPath.dest))
})
