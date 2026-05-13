const fs = require('fs');
const path = require('path');

function replaceInFile(filePath, regex, replacement) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(regex, replacement);
  fs.writeFileSync(filePath, content);
}

const baseDir = 'C:\\Users\\pc\\Documents\\Requisitos y Modelos\\eiar-clean\\src';

// 1. firebase.service.ts, user.repository.ts, mision-logro.repository.ts
const firebaseDir = path.join(baseDir, 'frameworks/database/firebase');
const firebaseFiles = fs.readdirSync(firebaseDir).filter(f => f.endsWith('.ts'));
for (const file of firebaseFiles) {
  let fPath = path.join(firebaseDir, file);
  replaceInFile(fPath, /from '\.\.\/\.\.\/usecases\//g, "from '../../../usecases/");
  replaceInFile(fPath, /from '\.\.\/\.\.\/entities\//g, "from '../../../entities/");
}

// 2. infrastructure.module.ts
const modPath = path.join(baseDir, 'frameworks/infrastructure.module.ts');
replaceInFile(modPath, /from '\.\/firebase/g, "from './database/firebase");
replaceInFile(modPath, /from '\.\/guards/g, "from './web/guards");
replaceInFile(modPath, /from '\.\.\/usecases\//g, "from '../usecases/"); // Just in case it needs it, though it was at depth 2 before and now depth 2.

// 3. firebase-auth.guard.ts
const guardPath = path.join(baseDir, 'frameworks/web/guards/firebase-auth.guard.ts');
replaceInFile(guardPath, /from '\.\.\/firebase/g, "from '../../database/firebase");

// 4. auth.service.ts (interactor)
const authPath = path.join(baseDir, 'usecases/interactor/auth.service.ts');
replaceInFile(authPath, /from '\.\.\/\.\.\/frameworks\/database\/firebase\//g, "from '../../frameworks/database/firebase/");

console.log('Paths fixed.');
