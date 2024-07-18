import fs from 'fs';
import path from 'path';

export const isDirectory = (path: string) => fs.promises.stat(path).then((stats) => stats.isDirectory());
export const readFiles = (filepath: string) => fs.promises.readdir(filepath).then(async _files => {
  const dirs = [];
  const files = [];
  for (const file of _files) {
    const fullPath = path.join(filepath, file);
    const flag = await isDirectory(fullPath);
    flag ? dirs.push(fullPath) : files.push(fullPath);
  }
  return {
    dirs, files
  }
});