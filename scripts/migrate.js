const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, '../src');

const mappings = [
  { old: 'domain/models', new: 'entities' },
  { old: 'domain/rules', new: 'entities' },
  { old: 'domain/interfaces/repositories.interface.ts', new: 'usecases/output/repositories.output.ts' },
  { old: 'application/services', new: 'usecases/interactor' },
  { old: 'presentation/controllers', new: 'adapters/controllers' },
  { old: 'presentation/dto', new: 'adapters/controllers/dto' },
  { old: 'presentation/frontend', new: 'frameworks/web/frontend' },
  { old: 'infrastructure/firebase', new: 'frameworks/database/firebase' },
  { old: 'infrastructure/guards', new: 'frameworks/web/guards' },
  { old: 'infrastructure/infrastructure.module.ts', new: 'frameworks/infrastructure.module.ts' }
];

const importReplacements = [
  { regex: /domain\/models/g, replacement: 'entities' },
  { regex: /domain\/rules/g, replacement: 'entities' },
  { regex: /domain\/interfaces\/repositories\.interface/g, replacement: 'usecases/output/repositories.output' },
  { regex: /application\/services/g, replacement: 'usecases/interactor' },
  { regex: /presentation\/controllers/g, replacement: 'adapters/controllers' },
  { regex: /presentation\/dto/g, replacement: 'adapters/controllers/dto' },
  { regex: /presentation\/frontend/g, replacement: 'frameworks/web/frontend' },
  { regex: /infrastructure\/firebase/g, replacement: 'frameworks/database/firebase' },
  { regex: /infrastructure\/guards/g, replacement: 'frameworks/web/guards' },
  { regex: /infrastructure\/infrastructure\.module/g, replacement: 'frameworks/infrastructure.module' },
  { regex: /domain\//g, replacement: 'entities/' }, // fallback for domain
  { regex: /application\//g, replacement: 'usecases/' }, // fallback
  { regex: /presentation\//g, replacement: 'adapters/' }, // fallback
  { regex: /infrastructure\//g, replacement: 'frameworks/' } // fallback
];

// Read all ts files
function getAllFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules' && file !== 'dist' && file !== 'frontend') {
        getAllFiles(fullPath, fileList);
      } else if (file === 'frontend') {
          // just include frontend as a file/dir to move but don't parse its internal TS for now except to move it
          fileList.push(fullPath);
      }
    } else {
      if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx') || fullPath.endsWith('.json')) {
        fileList.push(fullPath);
      }
    }
  }
  return fileList;
}

const allFiles = getAllFiles(baseDir);

function ensureDir(filePath) {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) return true;
  ensureDir(dirname);
  fs.mkdirSync(dirname);
}

for (const oldPath of allFiles) {
  let relativeOldPath = path.relative(baseDir, oldPath).replace(/\\/g, '/');
  let relativeNewPath = relativeOldPath;

  for (const mapping of mappings) {
    if (relativeOldPath.startsWith(mapping.old)) {
      relativeNewPath = relativeOldPath.replace(mapping.old, mapping.new);
      break;
    }
  }

  const newFullPath = path.join(baseDir, relativeNewPath);
  ensureDir(newFullPath);

  if (fs.statSync(oldPath).isDirectory()) {
      // Just move directory (for frontend)
      if (oldPath !== newFullPath) {
          if (!fs.existsSync(newFullPath)) {
              fs.renameSync(oldPath, newFullPath);
          }
      }
      continue;
  }

  let content = fs.readFileSync(oldPath, 'utf8');

  // Regex replacement for imports
  for (const rep of importReplacements) {
    content = content.replace(rep.regex, rep.replacement);
  }

  if (oldPath !== newFullPath) {
    fs.writeFileSync(newFullPath, content);
    fs.unlinkSync(oldPath);
  } else {
    fs.writeFileSync(oldPath, content);
  }
}

// Write the main file
let appModulePath = path.join(baseDir, 'app.module.ts');
if (fs.existsSync(appModulePath)) {
    let content = fs.readFileSync(appModulePath, 'utf8');
    for (const rep of importReplacements) {
      content = content.replace(rep.regex, rep.replacement);
    }
    fs.writeFileSync(appModulePath, content);
}

let mainPath = path.join(baseDir, 'main.ts');
if (fs.existsSync(mainPath)) {
    let content = fs.readFileSync(mainPath, 'utf8');
    content = content.replace(/src\/presentation\//g, 'src/adapters/controllers/\n   Frontend      -> src/frameworks/web/frontend/');
    content = content.replace(/src\/application\//g, 'src/usecases/');
    content = content.replace(/src\/domain\//g, 'src/entities/');
    content = content.replace(/src\/infrastructure\//g, 'src/frameworks/');
    content = content.replace(/Monolítica en Capas/g, 'Clean Architecture');
    fs.writeFileSync(mainPath, content);
}

// Clean up old dirs
const dirsToRemove = ['domain', 'application', 'presentation', 'infrastructure'];
for (const dir of dirsToRemove) {
    const p = path.join(baseDir, dir);
    if (fs.existsSync(p)) {
        fs.rmSync(p, { recursive: true, force: true });
    }
}

console.log('Migration to Clean Architecture directory structure complete.');
