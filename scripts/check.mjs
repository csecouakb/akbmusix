import { readFile, access } from 'node:fs/promises';
const required=['dist/index.html','dist/song.html','dist/admin.html','dist/styles.css','dist/robots.txt','dist/sitemap.xml','functions/[[path]].js','migrations/0001_initial.sql'];
for(const file of required) await access(file);
const html=await readFile('dist/index.html','utf8');
for(const ref of ['styles.css','script.js','/about.html','/contact.html','/legal.html']) if(!html.includes(ref)) throw new Error(`Missing reference: ${ref}`);
console.log('Static entrypoints and required deployment files verified.');
