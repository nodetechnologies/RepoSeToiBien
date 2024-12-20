// set-version.js
const fs = require('fs');
const packageJson = require('./package.json');

const version = packageJson.version;

const updateEnvFile = (filePath) => {
  let envContent = fs.existsSync(filePath)
    ? fs.readFileSync(filePath, 'utf-8')
    : '';

  // Replace existing REACT_APP_VERSION or add it if not present
  if (envContent.match(/^REACT_APP_VERSION=.*/m)) {
    envContent = envContent.replace(
      /^REACT_APP_VERSION=.*$/m,
      `REACT_APP_VERSION=${version}`
    );
  } else {
    envContent += `\nREACT_APP_VERSION=${version}\n`;
  }

  fs.writeFileSync(filePath, envContent);
};

updateEnvFile('./.env.production');
updateEnvFile('./.env');
