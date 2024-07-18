import fs from 'fs';
import path from 'path';
import nameMapConfig from './nameMapConfig';
import { isDirectory, readFiles } from './utils';
// 获取输入参数
const args = process.argv.slice(2);

if (!args[0]) {
  console.warn('请输入文件夹路径');
  process.exit(1);
}

const filepath = path.resolve(__dirname, args[0]);

try {
  const isDir = await isDirectory(filepath);
  if (!isDir) throw new Error();
  const files = await readFiles(filepath);
  for (const file of files.files) {
    console.log(`===> 正在处理${file}`);
    const ext = path.extname(file);
    const name = path.basename(file, ext);
    const flag = nameMapConfig.some(item => {
      return handleFile(item, file, name, ext);
    })
    if (flag) {
      console.log(`===> 处理成功:${name}`);
    } else {
      console.log(`===> 无匹配:${name}`);
    }
  }
} catch (error) {
  console.warn(`不是文件夹: ${filepath}`);
}

function handleFile(item: typeof nameMapConfig[number], file: string, name: string, ext: string): boolean {
  // console.log('type', item.format, name, ext);
  if (typeof item.format === 'string') {
    if (item.format === name) {
      const newName = item.value + ext;
      fs.writeFileSync('./out/' + newName, fs.readFileSync(file));
      // console.log(`===> 处理成功:${name}--> ${newName}`);
      return true;
    }
    // console.log(`===> 无匹配:${name}`);
    return false;
  } else if (item.format instanceof RegExp) {
    if (item.format.test(name)) {
      const newName = item.value + ext;
      fs.writeFileSync('./out/' + newName, fs.readFileSync(file));
      // console.log(`===> 处理成功${name}--> ${newName}`);
      return true;
    }
    // console.log(`===> 无匹配:${name}`);
    return false;
  } else if (Array.isArray(item.format)) {
    return item.format.some(format => handleFile({ ...item, format }, file, name, ext));
  }
  // console.log(`===> 无匹配:${name}`);
  return false;
}

