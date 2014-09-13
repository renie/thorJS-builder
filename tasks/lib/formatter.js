/*
 * grunt-thorJS-builder
 * https://github.com/renie/thorJS-builder
 *
 * Copyright (c) 2014 Renie Siqueira
 * Licensed under the MPL, 2.0 licenses.
 */

'use strict';

var grunt, options;

var map = {}, src, file;

function verifyExistence() {

	if (file === null || file === undefined)
		throw new Error('No file defined for formatter.');

	src = file.src.filter(function (filepath) {
		if (!grunt.file.exists(filepath)) {
			grunt.log.warn('Source file "' + filepath + '" not found.');
			return false;
		} else {
			return true;
		}
	});
}

function mappingFunctions() {
	src = src.map(function (filepath) {
		var source =  grunt.file.read(filepath);
		var regex = /(\w+)\.prototype\.(\w+)=function\(([a-zA-Z0-9,_]*)?\)/g;
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


			myArray[3] = myArray[3] || '';

			map[part].push({
				'name' : myArray[2],
				'parameters' : myArray[3].replace(/\s/g, '').split(','),
				'body' : string,
				'originalPartName' : myArray[1]
			});
		}
	});
}

var Formatter = function() {};

Formatter.prototype.setFile = function(f) {
	file = f;
};

Formatter.prototype.toLiteralObject = function() {

	verifyExistence();
	mappingFunctions();

	var standalone = 'var ' + options.libName + '={};';

	for (var part in map) {
		standalone += options.libName + '.' + part + '={';

		var i = 0,
			functions = map[part],
			len = functions.length;
		for (; i < len ; i++) {
			var curr = functions[i];
			standalone += "'" + curr.name + "':function(";

			if (curr.body.indexOf('this') !== -1) {
				standalone += "libobj";

				if (curr.parameters.length > 0 &&
					curr.parameters[0].replace(/\s/g, '') !== '')
					standalone +=  ',';
			}

			standalone += curr.parameters.join(',') + "){";

			if (curr.body.indexOf('this') !== -1)
				standalone += curr.body.replace(/this/g, 'libobj');
			else
				standalone += curr.body;

			standalone += ";}";

			if (i + 1 < len)
				standalone += ',';
		}

		standalone += '};';
	}

	// Write the destination file.
	grunt.file.write(options.finalPath + options.libName.toLocaleLowerCase() +'.standalone.js', standalone);

	file = null;
};


exports.init = function(g, o) {
	grunt = g;
	options = o;
	return new Formatter();
};