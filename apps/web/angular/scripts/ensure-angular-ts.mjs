import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../..');
const packages = ['@angular/compiler-cli', '@angular/build'];

for (const pkg of packages) {
  const dir = path.join(root, 'node_modules', pkg);
  const tsPath = path.join(dir, 'node_modules', 'typescript');
  if (!existsSync(tsPath)) {
    execSync('npm install typescript@6.0.3 --no-package-lock --no-save', {
      cwd: dir,
      stdio: 'inherit',
    });
  }
}
