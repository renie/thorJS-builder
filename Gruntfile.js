/*
 * grunt-thorJS-builder
 * https://github.com/renie/thorJS-builder
 *
 * Copyright (c) 2014 Renie Siqueira
 * Licensed under the MPL, 2.0 licenses.
 */

'use strict';

module.exports = function (grunt) {

	// Project configuration.
	grunt.initConfig({
		jshint: {
			all: [
				'Gruntfile.js',
				'tasks/*.js'
			],
			options: {
				jshintrc: '.jshintrc'
			}
		},

		// Before generating any new files, remove any previously-created files.
		clean: {
			tests: ['tmp']
		},

		// Configuration to be run (and then tested).
		thorJS_builder: {
			default_options: {
				options: {
				},
				files: {
					'tmp/default_options': ['test/fixtures/testing', 'test/fixtures/123']
				}
			}
		}
	});

	// Actually load this plugin's task(s).
	grunt.loadTasks('tasks');

	// These plugins provide necessary tasks.
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');

	// By default, lint and run all tests.
	grunt.registerTask('default', ['jshint']);

};
