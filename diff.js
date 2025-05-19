// TODO:
// Parse absolute path form input arguments
// use absolute path as fallback for outputDir
// use cwd as fallback if no path specified

//TODO: Gracefully handle errors if one or both input file are not specified.

const HtmlDiff = require('htmldiff-js').default;
const fs = require('fs');
const { allowedNodeEnvironmentFlags } = require('process');
//const { argv } = require('node:process');
path = require('path');

// list processed arguments starting at index 2, trims the "HtmlDiff" and "fs" constants
const arg = process.argv.slice(2);
const workdir = process.cwd();

// DEBUG: Print current working directory
console.log("Current working directory: ",
    process.cwd());

// Name of the new HTML input file
arg[0] = String(arg[0]);
// Name of the old HTML input file
arg[1] = String(arg[1]);
// Name of the output file
arg[2] = String(arg[2]);
// Custom output file path
arg[3] = String(arg[3]);

// append workdir path to input file 1
var filepathNew = path.join(workdir, arg[0]);
// DEBUG: print filepath
console.log('Path to new HTML file: ', filepathNew);

// append workdir path to input file 2
var filepathOld = path.join(workdir, arg[1]);
// DEBUG: print filepath
console.log('Path to old HTML file: ', filepathOld);

//TODO: use parsed input file dirpath as fallback if no output file path is specified
//TODO: use cwd as fallback if no output or input path is specified
//TODO: use a fallback output file name, if none is provided

//specify output file name
//TODO: enable CLI arg for specifying custom output directory path
var outputPath = path.join(workdir, arg[2]);
console.log('Path to output file:', outputPath);

var newHtml = fs.readFileSync(filepathNew, 'utf8');
var oldHtml = fs.readFileSync(filepathOld, 'utf8');

console.log("Comparing files and generating diff...");

var diffHtml = HtmlDiff.execute(oldHtml, newHtml);

console.log("Done!");

// adding additional style to make changes highlighted in color (might still be incomplete,
// TODO: Append the change bar style to the inline CSS instead of replacing the entire CSS block.
diffHtml = diffHtml.replace("<head>",`<head><style>
del {
    text-decoration: none;
    background-color: #fdb8c0;
}

ins {
    text-decoration: none;
    background-color: #acf2bd;
}

/* just formatting changes */
ins.mod {
    background-color: #fafaa9;
}
</style>`)

fs.writeFile(arg[2], diffHtml, function (err) {
    if (err) throw err;
    console.log('HTML diff generated in', path.join(workdir, arg[2]));
});


