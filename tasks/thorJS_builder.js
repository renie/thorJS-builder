/*
 * grunt-thorJS-builder
 * https://github.com/renie/thorJS-builder
 *
 * Copyright (c) 2014 Renie Siqueira
 * Licensed under the MPL, 2.0 licenses.
 */

'use strict';

module.exports = function (grunt) {

	grunt.registerMultiTask('thorJS_builder', 'Grunt plugin for building ThorJS', function () {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			finalPath   : 'foo.js',
			libName     : 'MyLib'
		});

		var formatter = require('./lib/formatter').init(grunt, options);

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {

			formatter.setFile(f);
			formatter.toLiteralObject();

			// Print a success message.
			grunt.log.writeln('File "' + options.finalPath + '" created.');
		});
	});

};
