import { cp, mkdir, rm, readFile, writeFile } from 'node:fs/promises';

const files = ['index.html','song.html','styles.css','enhancements.css','fontfix.css','theme.css','theme.js','script.js','song.js','admin.html','admin.js','about.html','contact.html','legal.html','robots.txt','sitemap.xml','favicon.svg','_headers'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of files) await cp(file, `dist/${file}`);
const css = await readFile('dist/styles.css', 'utf8');
const theme = await readFile('theme.css', 'utf8');
await writeFile('dist/styles.css', `${css}body{font-family:Arial,"Noto Sans Bengali","Segoe UI",sans-serif}${theme}`);
console.log(`Built ${files.length} static files into dist/`);
