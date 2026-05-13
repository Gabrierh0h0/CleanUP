const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src');
const testDir = path.join(__dirname, '../test');

function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== 'frontend') {
        getAllFiles(fullPath, fileList);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const allFiles = [...getAllFiles(baseDir), ...getAllFiles(testDir)];

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf8');

  // Fix common bad relative paths:
  // repositories.output.ts is at src/usecases/output/ -> ../../entities/user.model
  content = content.replace(/from '\.\.\/models\//g, "from '../../entities/");
  content = content.replace(/from '\.\.\/rules\//g, "from '../../entities/");
  
  content = content.replace(/from '\.\.\/domain\/models\//g, "from '../entities/");
  content = content.replace(/from '\.\.\/\.\.\/domain\/models\//g, "from '../../entities/");
  content = content.replace(/from '\.\.\/\.\.\/domain\/interfaces\/repositories\.interface/g, "from '../../usecases/output/repositories.output");
  content = content.replace(/from '\.\.\/\.\.\/domain\/rules\//g, "from '../../entities/");

  // app.module.ts is at src/
  content = content.replace(/from '\.\/presentation\/controllers\//g, "from './adapters/controllers/");
  content = content.replace(/from '\.\/application\/services\//g, "from './usecases/interactor/");
  content = content.replace(/from '\.\/infrastructure\//g, "from './frameworks/");

  // main.ts is at src/
  content = content.replace(/from '\.\/presentation\/frontend\//g, "from './frameworks/web/frontend/");

  // other replacements
  content = content.replace(/from '\.\.\/\.\.\/application\/services/g, "from '../../usecases/interactor");
  content = content.replace(/from '\.\.\/\.\.\/infrastructure\/firebase/g, "from '../../frameworks/database/firebase");
  
  // test replacements
  content = content.replace(/src\/domain\/rules\//g, "src/entities/");
  content = content.replace(/src\/domain\/models\//g, "src/entities/");

  fs.writeFileSync(filePath, content);
}
console.log('Imports fixed.');
