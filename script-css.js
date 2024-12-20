const fs = require('fs');
const path = require('path');

const CSS_FILE_PATH = './public/assets/css/styles.css';
const SRC_DIR = './src';

// Function to extract class names from CSS file
function extractClassNames(cssContent) {
  const classNames = new Set();
  const classRegex = /\.([a-zA-Z0-9_-]+)/g;
  let match;

  while ((match = classRegex.exec(cssContent)) !== null) {
    classNames.add(match[1]);
  }

  return classNames;
}

// Function to check if a file contains a class name
function fileContainsClass(filePath, classNames) {
  const content = fs.readFileSync(filePath, 'utf-8').toLowerCase();
  return Array.from(classNames).some((className) =>
    content.includes(className.toLowerCase())
  );
}

// Read CSS file
const cssContent = fs.readFileSync(CSS_FILE_PATH, 'utf-8');
const classNames = extractClassNames(cssContent);

// Recursively read through src directory
function searchDirectory(directory) {
  const files = fs.readdirSync(directory);

  for (const file of files) {
    const fullPath = path.join(directory, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      searchDirectory(fullPath);
    } else if (stat.isFile()) {
      if (fileContainsClass(fullPath, classNames)) {
        classNames.forEach((className) => {
          if (fullPath.includes(className)) {
            classNames.delete(className);
          }
        });
      }
    }
  }
}

searchDirectory(SRC_DIR);
