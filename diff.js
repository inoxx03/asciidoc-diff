#!/usr/bin/env node

// Import Node.js standard modules using ES module syntax
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import htmldiff from 'htmldiff-js';
//import HtmlDiff from 'htmldiff-js';

// Required for __dirname replacement in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get CLI arguments (after the first two: node + script path)
const [fileNew, fileOld, fileOut] = process.argv.slice(2);

// Validate input
if (!fileNew || !fileOld || !fileOut) {
console.error("Usage: asciidoc-diff <new.html> <old.html> <output.html>");
process.exit(1);
}

// Resolve absolute paths
const filepathNew = path.resolve(process.cwd(), fileNew);
const filepathOld = path.resolve(process.cwd(), fileOld);
const outputPath = path.resolve(process.cwd(), fileOut);

// DEBUG
console.log("Working directory:", process.cwd());
console.log("New file path:", filepathNew);
console.log("Old file path:", filepathOld);
console.log("Output file path:", outputPath);

// Read HTML files
const newHtml = fs.readFileSync(filepathNew, 'utf8');
const oldHtml = fs.readFileSync(filepathOld, 'utf8');

// Generate diff
console.log("Comparing files and generating diff...");
//let diffHtml = HtmlDiff.execute(oldHtml, newHtml);
//let diffHtml = HtmlDiff(oldHtml, newHtml);
let diffHtml = htmldiff.default.execute(oldHtml, newHtml);
console.log("Done!");

// Inject custom styling for insertions and deletions
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

// Write to output
fs.writeFileSync(outputPath, diffHtml, 'utf8');
console.log(`HTML diff written to: ${outputPath}`);