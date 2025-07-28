// scripts/extractPages.js
const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, '../src/App.jsx');
const pagesDir = path.join(__dirname, '../src/pages');

if (!fs.existsSync(pagesDir)) {
  fs.mkdirSync(pagesDir);
}

const appCode = fs.readFileSync(appPath, 'utf8');

// List your page component names here:
const pageNames = [
  'Analytics',
  'Learning',
  'Collaboration',
  'Reporting',
  'Favorites',
  'ProfileMenu'
];

let newAppCode = appCode;

pageNames.forEach(name => {
  // Regex to match the function component (simple version)
  const regex = new RegExp(`function ${name}\\([^)]*\\)\\s*{[\\s\\S]*?^}`, 'm');
  const match = appCode.match(regex);
  if (match) {
    const componentCode = match[0] + `\n\nexport default ${name};\n`;
    const filePath = path.join(pagesDir, `${name}.jsx`);
    fs.writeFileSync(filePath, componentCode, 'utf8');
    // Replace in App.jsx with import
    newAppCode = newAppCode.replace(match[0], `import ${name} from './pages/${name}';`);
  }
});

// Write the updated App.jsx
fs.writeFileSync(appPath, newAppCode, 'utf8');

console.log('Extraction complete! Review your new pages and App.jsx.');