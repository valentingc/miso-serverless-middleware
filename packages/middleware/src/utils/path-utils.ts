import fs from 'fs';
import path from 'path';

export function getRelativePathToProjectRoot(pathStart: string): string {
  let currentPath = pathStart;
  let relativePath = '';

  while (currentPath && currentPath !== path.parse(currentPath).root) {
    if (fs.existsSync(path.join(currentPath, 'package.json'))) {
      return relativePath || '.';
    }
    currentPath = path.dirname(currentPath);
    relativePath = path.join('..', relativePath);
  }

  throw new Error('Project noot could not be found');
}
