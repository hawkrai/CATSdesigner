"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const http_proxy_middleware_1 = require("http-proxy-middleware");
const modules = __importStar(require("./modules.json"));
const app = express_1.default();
const port = 3000;
const targetDomain = "http://localhost:84";
app.use(express_1.default.static(path_1.default.resolve('d:/.temp/apps')));
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
function getModule(url) {
    var module = url.split('/')[1];
    return modules[module];
}
const proxyServiceOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
        '^/subject/Services': 'Services',
        '^/Services': 'Services',
    },
};
const proxyAccountOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
        '^/Account': 'Account',
    },
};
const proxyTestPassingOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
        '^/TestPassing': 'TestPassing',
    }
};
const proxyTestOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
        '^/Tests': 'Tests',
    }
};
const proxyApigOptions = {
    target: targetDomain,
    changeOrigin: true,
    pathRewrite: {
        '^/course/api': 'api',
    }
};
app.use('*/Services/*', http_proxy_middleware_1.createProxyMiddleware(proxyServiceOptions));
app.use('*/Account/*', http_proxy_middleware_1.createProxyMiddleware(proxyAccountOptions));
app.use('*/TestPassing/*', http_proxy_middleware_1.createProxyMiddleware(proxyTestPassingOptions));
app.use('*/Tests/*', http_proxy_middleware_1.createProxyMiddleware(proxyTestOptions));
app.use('*/api/*', http_proxy_middleware_1.createProxyMiddleware(proxyApigOptions));
app.get('*', (req, res) => {
    let url = req.url;
    let module = getModule(url);
    let setModule = module === undefined ? modules["web"] : module;
    let modulePath = setModule.path;
    let entryPoint = setModule.entryPoint;
    if (allowedExt.filter(ext => url.indexOf(ext) > 0).length > 0) {
        res.sendFile(path_1.default.resolve(`${modulePath}/${req.url}`));
        res.setHeader('Cache-Control', 'max-age=3153600');
    }
    else {
        res.sendFile(path_1.default.resolve(`${modulePath}/${entryPoint}`));
    }
});
app.listen(port, err => {
    if (err) {
        return console.error(err);
    }
    return console.log(`server is listening on ${port}`);
});
//# sourceMappingURL=app.js.map