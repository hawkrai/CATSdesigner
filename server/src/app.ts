import express from 'express'
import path from 'path'
import { createProxyMiddleware } from 'http-proxy-middleware'
import * as modules from './modules.json'

const app = express()
const PORT = 3000
const TARGET_DOMAIN = 'https://educats.by'
const TARGET_CHAT_DOMAIN = 'https://localhost:4200/'

app.use(express.static(path.resolve('/.temp/apps')))

const allowedExt = [
  '.js',
  '.gif',
  '.ico',
  '.css',
  '.png',
  '.jpg',
  '.woff2',
  '.woff',
  '.ttf',
  '.svg',
  '.mp4',
  '.mp3',
]

function getModule(url: string) {
  const module = url.split('/')[1]

  return modules[module]
}

const proxyServiceOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Services': 'Services',
    '^/course/Services': 'Services',
    '^/diplom/Services': 'Services',
    '^/libBook/Services': 'Services',
    '^/Services': 'Services',
  },
  secure: false,
}

const proxyAccountOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/Account': 'Account',
  },
  secure: false,
}

const proxyTestPassingOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/TestPassing': 'TestPassing',
  },
  secure: false,
}

const proxyTestOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/Tests': 'Tests',
  },
  secure: false,
}

const proxyApiOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/course/api': 'api',
    '^/diplom/api': 'api',
    '^/subject/api': 'api',
    '^/libBook/api': 'api',
  },
  secure: false,
}

const proxyAdminOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/Administration': 'Administration',
  },
  secure: false,
}

const proxyProfileOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/Profile': 'Profile',
  },
  secure: false,
}

const proxySubjectOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Subject': 'Subject',
  },
}

const proxyStatisticOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/subject/Statistic': 'Statistic',
  },
  secure: false,
}

const proxyElasticSearchOptions = {
  target: TARGET_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/ElasticSearch': 'ElasticSearch',
  },
  secure: false,
}

const proxyChatOptions = {
  target: TARGET_CHAT_DOMAIN,
  changeOrigin: true,
  pathRewrite: {
    '^/catService': '/ChatApi',
  },
  secure: false,
}

const proxySignalROptions = {
  target: TARGET_CHAT_DOMAIN,
  pathRewrite: {
    '^/chatSignalR': '/chat',
  },
  secure: false,
  ws: true,
}

const socketProxy = createProxyMiddleware(proxySignalROptions)
const chatOptions = createProxyMiddleware(proxyChatOptions)

app.use('*/chatSignalR/*', socketProxy)
app.use('*/notificationSignalR/*', socketProxy)

app.use('*/catService/*', chatOptions)
app.use('*/ProtectionApi/*', chatOptions)
app.use('*/Services/*', createProxyMiddleware(proxyServiceOptions))
app.use('*/Account/*', createProxyMiddleware(proxyAccountOptions))
app.use('*/Profile/*', createProxyMiddleware(proxyProfileOptions))
app.use('*/TestPassing/*', createProxyMiddleware(proxyTestPassingOptions))
app.use('*/Tests/*', createProxyMiddleware(proxyTestOptions))
app.use('*/api/*', createProxyMiddleware(proxyApiOptions))
app.use('*/Administration/*', createProxyMiddleware(proxyAdminOptions))
app.use('*/subject/Subject/*', createProxyMiddleware(proxySubjectOptions))
app.use('*/subject/Statistic/*', createProxyMiddleware(proxyStatisticOptions))
app.use('*/ElasticSearch/*', createProxyMiddleware(proxyElasticSearchOptions))

app.get('*', (req, res) => {
  const url = req.url
  const module = getModule(url)

  const setModule = module === undefined ? modules['web'] : module
  const modulePath = setModule.path
  const entryPoint = setModule.entryPoint

  if (allowedExt.filter((ext) => url.indexOf(ext) > 0).length > 0) {
    // start
    let updatedPath
    const splitModulePath = modulePath.split('/').filter(Boolean)
    const splitReq = req.url.split('/').filter(Boolean)
    const common: string[] = [...splitModulePath]
    splitReq.map((value) => {
      if (!common.includes(value)) {
        common.push(value)
      }
    })
    updatedPath = common.join('/')
    // end

    res.sendFile(path.resolve(updatedPath))
    res.setHeader('Cache-Control', 'max-age=3153600')
  } else {
    res.sendFile(path.resolve(`${modulePath}/${entryPoint}`))
  }
})

app.listen(PORT, () => {
  return console.log(`server is listening on ${PORT}`)
})
