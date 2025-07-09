#!/usr/bin/env node

// Import Node.js standard modules
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import htmldiff from 'htmldiff-js';

// Required for __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Process CLI arguments  For input and output files
// Trim the first 2 default positional arguments that provide `node` and script path
const [fileNew, fileOld, fileOut] = process.argv.slice(2);

//Print usage hint and exit if any of the input and output arguments are not provided
if (!fileNew || !fileOld || !fileOut) {
console.error("Usage: asciidoc-diff <new.html> <old.html> <output.html>");
process.exit(1);
}

// Resolve absolute paths to input and output files
// Required so that the script can be used on the PATH
const filepathNew = path.resolve(process.cwd(), fileNew);
const filepathOld = path.resolve(process.cwd(), fileOld);
const outputPath = path.resolve(process.cwd(), fileOut);

// DEBUG: print current working directory path and resolve input and output file paths when executing this script.
console.log("Working directory:", process.cwd());
console.log("New file path:", filepathNew);
console.log("Old file path:", filepathOld);
console.log("Output file path:", outputPath);

// Read content from input HTML files
const newHtml = fs.readFileSync(filepathNew, 'utf8');
const oldHtml = fs.readFileSync(filepathOld, 'utf8');

//DEBUG: Print a log message before generating the diff
console.log("Comparing files and generating diff...");
// Generate diff by calling htmldiff on the input files.
let diffHtml = htmldiff.default.execute(oldHtml, newHtml);
//DEBUG: Print a log message when the diff is generated
console.log("Done!");

// Inject custom styling for insertions, deletions, and formatting modification.
diffHtml = diffHtml.replace("<head>", `<head><style>
del {
text-decoration: none;
background-color: #fdb8c0;
}
ins {
text-decoration: none;
background-color: #acf2bd;
}
ins.mod {
background-color: #fafaa9;
}
</style>`);

// Write the output HTML file to the resolved output path.
fs.writeFileSync(outputPath, diffHtml, 'utf8');
console.log(`HTML diff written to: ${outputPath}`);