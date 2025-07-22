const fs = require('fs');

const inputFile = 'citations_sanitized.md';
const outputFile = 'citations_renamed.md';

const content = fs.readFileSync(inputFile, 'utf8');
const lines = content.split('\n');

const headingCounts = {};

const headingRegex = /^## License: ([^\n(]+)(?: \([^)]+\))?/;

const newLines = lines.map(line => {
  const match = line.match(headingRegex);
  if (match) {
    const base = match[1].trim();
    headingCounts[base] = (headingCounts[base] || 0) + 1;
    if (headingCounts[base] === 1) {
      return `## License: ${base}`;
    } else {
      return `## License: ${base} (${headingCounts[base]})`;
    }
  }
  return line;
});

fs.writeFileSync(outputFile, newLines.join('\n'), 'utf8');
console.log(`Done! Output written to ${outputFile}`);