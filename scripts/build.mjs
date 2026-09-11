import { cp, mkdir, rm } from 'node:fs/promises';

const files = ['index.html','song.html','styles.css','enhancements.css','script.js','song.js','admin.html','admin.js','about.html','contact.html','legal.html','robots.txt','sitemap.xml','favicon.svg','_headers'];
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of files) await cp(file, `dist/${file}`);
console.log(`Built ${files.length} static files into dist/`);
