import express from 'express';
import path from 'path';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import * as modules from './modules.json';

const app = express();
const port = 3000;


app.use(express.static(path.resolve('d:/.temp/apps')));

const allowedExt = [
  '.js',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
];

function getModule(url: string){
  var module = url.split('/')[1];
  
  return modules[module];
}

const proxyServiceOptions = { 
  target: 'http://localhost:84', 
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Services': 'Services', // rewrite path
    '^/Services': 'Services', // rewrite path
  },
}

const proxyAccountOptions = { 
  target: 'http://localhost:84', 
  changeOrigin: true,
  pathRewrite: {
    '^/Account': 'Account', // rewrite path
  },
}

app.use('*/Services/*', createProxyMiddleware(proxyServiceOptions));
app.use('*/Account/*', createProxyMiddleware(proxyAccountOptions));

app.get('*', (req,res) => {
  let url = req.url;
  let module = getModule(url)

  let setModule = module === undefined ? modules["web"] : module;
  let modulePath = setModule.path;
  let entryPoint = setModule.entryPoint; 

  if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
     res.sendFile(path.resolve(`${modulePath}/${req.url}`));
     res.setHeader('Cache-Control', 'max-age=31536000');
  } else {
     res.sendFile(path.resolve(`${modulePath}/${entryPoint}`));
   }    
 });

app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});