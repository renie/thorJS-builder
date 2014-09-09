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
			finalPath:'/home/renie/teste.txt'
		});

		// Iterate over all specified file groups.
		this.files.forEach(function (f) {


			var map = {};

			var src = f.src.filter(function (filepath) {
				if (!grunt.file.exists(filepath)) {
					grunt.log.warn('Source file "' + filepath + '" not found.');
					return false;
				} else {
					return true;
				}
			}).map(function (filepath) {
				var source =  grunt.file.read(filepath);
				var regex = /(\w+)\.prototype\.(\w+)=function\((\w*)\)/g;
				var final = "";
				var myArray;
				while ((myArray = regex.exec(source)) !== null) {
					var string = source.substring(regex.lastIndex + 1);
					var fi = string.indexOf('prototype');
					if (fi !== -1) {
						string = string.substring(0, fi);
						fi = string.lastIndexOf('}');
						string = string.substring(0, fi);
					} else {
						string = string.substring(0, string.length-2);
					}

					var part = myArray[1];
					if (myArray[1].indexOf('HTML') !== -1)
						part = 'DOM';

					if (!map.hasOwnProperty(part))
						map[part] = [];

					map[part].push({
						'name' : myArray[2],
						'parameters' : myArray[3].replace(/\s/g, '').split(','),
						'body' : string,
						'originalPartName' : myArray[1]
					});
				}
			});

			var standalone = 'var Thor={};';

			for (var part in map) {
				standalone += 'Thor.' + part + '={';

				var i = 0,
					functions = map[part],
					len = functions.length;
				for (; i < len ; i++) {
					var curr = functions[i];
					standalone += "'" + curr.name + "':function(";
					standalone += "thorobj";

					if (curr.parameters.length > 0 &&
						curr.parameters[0].replace(/\s/g, '') !== '')
						standalone +=  ',';

					standalone += curr.parameters.join(',') + "){";
					standalone += curr.body.replace(/this/g, 'thorobj');
					standalone += ";}";

					if (i + 1 < len)
						standalone += ',';
				}

				standalone += '};';
			}


			// Write the destination file.
			grunt.file.write(options.finalPath + 'thor.standalone.js', standalone);

			// Print a success message.
			grunt.log.writeln('File "' + options.finalPath + '" created.');
		});
	});

};
