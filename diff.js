/*
    AsciiDoc Diff v1.0.0

    Copyright 2020-2025 Alexander Schwartz
    (alexander.schwartz@gmx.net)

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

        http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

    Original script by Alexander Schwartz (alexander.schwartz@gmx.net) 
    Subsequent modifications by Stefan Sitani (stefan.sitani@gmail.com)

*/

/*
    Lower priority fixes:
    TODO: Print usage information to STDOUT and exit when no input or output file arguments are specified.
    TODO: Add a means of scpefying a custom path for the input and output files.
    TODO: Gracefully handle errors if one or both input file are not specified.
    TODO: Use a default output file name, if none is provided.
    TODO: Maybe also use the default as fallback if specified output file already exists.
    TODO: Add a means of specifying a custom CSS style sheet for the diff output HTML.
    TODO: Gracefully handle invalid or empty HTML files when passed as input. 
*/

const HtmlDiff = require('htmldiff-js').default;
const fs = require('fs');
const { allowedNodeEnvironmentFlags } = require('process');
path = require('path');

// List processed arguments starting at index 2, trims the "HtmlDiff" and "fs" constants
const arg = process.argv.slice(2);
// Get the path to the current working directory.
// Used as the output path.
const workdir = process.cwd();

// DEBUG: Print current working directory
console.log("Current working directory: ",
    process.cwd());

// New HTML
// Name of input file 1
arg[0] = String(arg[0]);
// Old HTML
// Name of input file 2
arg[1] = String(arg[1]);
// Name of the output file
arg[2] = String(arg[2]);

// append workdir path to input file 1
var filepathNew = path.join(workdir, arg[0]);
// DEBUG: print path to NEW input file
console.log('Path to new HTML file: ', filepathNew);

// append workdir path to input file 2 (OLD)
var filepathOld = path.join(workdir, arg[1]);
// DEBUG: print path to OLD input file
console.log('Path to old HTML file: ', filepathOld);


// specify output file name
var outputPath = path.join(workdir, arg[2]);
console.log('Path to output file:', outputPath);

var newHtml = fs.readFileSync(filepathNew, 'utf8');
var oldHtml = fs.readFileSync(filepathOld, 'utf8');

// DEBUG: print a message for the log
console.log("Comparing files and generating diff...");

// Generate the diff
var diffHtml = HtmlDiff.execute(oldHtml, newHtml);

console.log("Done!");

/*
    Append CSS classes used for highlighting additions, deletions, 
    and for highlighting modified blocks, to the inline CCS from 
    the input HTML files.
    Not tested with 2 input files with different inline CSS, yet. 
*/
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
