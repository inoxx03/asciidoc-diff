const HtmlDiff = require('htmldiff-js').default;
const fs = require('fs');
const { allowedNodeEnvironmentFlags } = require('process');
//const { argv } = require('node:process');
path = require('path');

// list processed arguments starting at index 2, trims the "HtmlDiff" and "fs" constants
const arg = process.argv.slice(2);
const workdir = process.cwd();

// Printing current directory
console.log("Current working directory: ",
    process.cwd());

arg[0] = String(arg[0]);
arg[1] = String(arg[1]);
arg[2] = String(arg[2]);

var filepathNew = path.join(workdir, arg[0]);
console.log('Path to new HTML file: ', filepathNew);

var filepathOld = path.join(workdir, arg[1]);
console.log('Path to old HTML file: ', filepathOld);

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


