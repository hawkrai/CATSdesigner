import express from 'express';
import path from 'path';
import { createProxyMiddleware, Filter, Options, RequestHandler } from 'http-proxy-middleware';
import * as modules from './modules.json';

const app = express();
const port = 3000;
const targetDomain = "http://host27072020.of.by";

app.use(express.static(path.resolve('/home/educatsb/apps')));

const allowedExt = [
  '.js',
  'gif',
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
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Services': 'Services', // rewrite path
    '^/course/Services': 'Services', // rewrite path
    '^/libBook/Services': 'Services', // rewrite path
    '^/Services': 'Services', // rewrite path
  },
}

const proxyAccountOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/Account': 'Account', // rewrite path
  },
}

const proxyTestPassingOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/TestPassing': 'TestPassing', // rewrite path
  }
}

const proxyTestOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/Tests': 'Tests', // rewrite path
  }
}

const proxyApigOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/course/api': 'api', // rewrite path
    '^/subject/api': 'api', // rewrite path
    '^/libBook/api': 'api' // rewrite path
  }
}

const proxyAdmingOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/Administration': 'Administration', // rewrite path
  }
}

const proxyProfileOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/Profile': 'Profile', // rewrite path
  }
}

const proxySubjectOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Subject': 'Subject', // rewrite path
  }
}

const proxyStatisticOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Statistic': 'Statistic', // rewrite path
  }
}

const proxyElasticSearchOptions = { 
  target: targetDomain, 
  changeOrigin: true,
  pathRewrite: {
    '^/ElasticSearch': 'ElasticSearch', // rewrite path
  },
}

app.use('*/Services/*', createProxyMiddleware(proxyServiceOptions));
app.use('*/Account/*', createProxyMiddleware(proxyAccountOptions));
app.use('*/Profile/*', createProxyMiddleware(proxyProfileOptions));
app.use('*/TestPassing/*', createProxyMiddleware(proxyTestPassingOptions));
app.use('*/Tests/*', createProxyMiddleware(proxyTestOptions));
app.use('*/api/*', createProxyMiddleware(proxyApigOptions));
app.use('*/Administration/*', createProxyMiddleware(proxyAdmingOptions));
app.use('*/subject/Subject/*', createProxyMiddleware(proxySubjectOptions));
app.use('*/subject/Statistic/*', createProxyMiddleware(proxyStatisticOptions));
app.use('*/ElasticSearch/*', createProxyMiddleware(proxyElasticSearchOptions));

app.get('*', (req,res) => {
  let url = req.url;
  let module = getModule(url)

  let setModule = module === undefined ? modules["web"] : module;
  let modulePath = setModule.path;
  let entryPoint = setModule.entryPoint; 

  if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
     res.sendFile(path.resolve(`${modulePath}/${req.url}`));
     res.setHeader('Cache-Control', 'max-age=3153600');
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