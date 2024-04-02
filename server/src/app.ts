import express from 'express'
import path from 'path'
import http from 'http'
import https from 'https'
import fs from 'fs'
import pem from 'pem'
import {
  createProxyMiddleware,
  Filter,
  Options,
  RequestHandler,
} from 'http-proxy-middleware'
import * as modules from './modules.json'

pem.createCertificate({ days: 356, selfSigned: true }, function (err, keys) {
  const credentials = { key: keys.serviceKey, cert: keys.certificate }
  const app = express()
  const port = 3000
  const httpsPort = 443
  const targetDomain = 'http://localhost:2021'
  const targetChatDomain = 'http://localhost:4201'
  app.use(express.static(path.resolve('d:/CatsProject/apps')))

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
    'mp4',
  ]

  function getModule(url: string) {
    var module = url.split('/')[1]

    return modules[module]
  }

  const proxyServiceOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/subject/Services': 'Services', // rewrite path
      '^/course/Services': 'Services', // rewrite path
      '^/diplom/Services': 'Services', // rewrite path
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
    },
  }

  const proxyTestOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/Tests': 'Tests', // rewrite path
    },
  }

  const proxyApigOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/course/api': 'api', // rewrite path
      '^/diplom/api': 'api', // rewrite path
      '^/subject/api': 'api', // rewrite path
      '^/libBook/api': 'api', // rewrite path
    },
  }

  const proxyAdmingOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/Administration': 'Administration', // rewrite path
    },
  }

  const proxyProfileOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/Profile': 'Profile', // rewrite path
    },
  }

  const proxySubjectOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/subject/Subject': 'Subject', // rewrite path
    },
  }

  const proxyStatisticOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/subject/Statistic': 'Statistic', // rewrite path
    },
  }

  const proxyElasticSearchOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/ElasticSearch': 'ElasticSearch', // rewrite path
    },
  }

  const proxyChatOptions = {
    target: targetChatDomain,
    changeOrigin: true,
    pathRewrite: {
      '^/catService': '/ChatApi',
      '^/subject/ProtectionApi': '/ProtectionApi',
    },
    secure: false,
  }

  const proxySignalROptions = {
    target: targetChatDomain,
    pathRewrite: {
      '^/chatSignalR': '/chat',
      '^/notificationSignalR': '/notification',
    },
    changeOrigin: true,
    ws: true,
    secure: false,
  }

  const socketProxy = createProxyMiddleware(proxySignalROptions)
  const chatOptions = createProxyMiddleware(proxyChatOptions)

  app.use('*/chatSignalR/*', socketProxy)
  app.use('*/catService/*', chatOptions)
  app.use('*/ProtectionApi/*', chatOptions)
  app.use('*/Services/*', createProxyMiddleware(proxyServiceOptions))
  app.use('*/Account/*', createProxyMiddleware(proxyAccountOptions))
  app.use('*/Profile/*', createProxyMiddleware(proxyProfileOptions))
  app.use('*/TestPassing/*', createProxyMiddleware(proxyTestPassingOptions))
  app.use('*/Tests/*', createProxyMiddleware(proxyTestOptions))
  app.use('*/api/*', createProxyMiddleware(proxyApigOptions))
  app.use('*/Administration/*', createProxyMiddleware(proxyAdmingOptions))
  app.use('*/subject/Subject/*', createProxyMiddleware(proxySubjectOptions))
  app.use('*/subject/Statistic/*', createProxyMiddleware(proxyStatisticOptions))
  app.use('*/notificationSignalR/*', socketProxy)
  app.use('*/ElasticSearch/*', createProxyMiddleware(proxyElasticSearchOptions))

  app.get('*', (req, res) => {
    let url = req.url
    let module = getModule(url)

    let setModule = module === undefined ? modules['web'] : module
    let modulePath = setModule.path
    let entryPoint = setModule.entryPoint

    if (allowedExt.filter((ext) => url.indexOf(ext) > 0).length > 0) {
      res.sendFile(path.resolve(`${modulePath}/${req.url}`))
      res.setHeader('Cache-Control', 'max-age=3153600')
    } else {
      res.sendFile(path.resolve(`${modulePath}/${entryPoint}`))
    }
  })

  var httpServer = http.createServer(app)
  var httpsServer = https.createServer(credentials, app)

  httpServer.listen(port)
  httpsServer.listen(httpsPort)
})
