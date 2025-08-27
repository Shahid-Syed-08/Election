const http = require('http');
const fs = require('fs');
const path = require('path');
const { request: httpRequest } = require('http');

const PORT = 5000;

const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.woff': 'application/font-woff',
    '.ttf': 'application/font-ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'application/font-otf',
    '.wasm': 'application/wasm'
};

const server = http.createServer((req, res) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    
    // Simple reverse proxy for API routes to backend on port 3000
    if (req.url.startsWith('/api/')) {
        const options = {
            hostname: 'localhost',
            port: 3000,
            path: req.url,
            method: req.method,
            headers: req.headers,
        };
        const proxyReq = httpRequest(options, proxyRes => {
            res.writeHead(proxyRes.statusCode || 500, proxyRes.headers);
            proxyRes.pipe(res, { end: true });
        });
        proxyReq.on('error', (err) => {
            console.error('API proxy error:', err.message);
            res.writeHead(502, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Bad gateway to API', error: err.message }));
        });
        req.pipe(proxyReq, { end: true });
        return;
    }
    
    let filePath = '.' + req.url;
    if (filePath === './') {
        filePath = './index.html';
    }

    const extname = String(path.extname(filePath)).toLowerCase();
    const mimeType = mimeTypes[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File not found');
            } else {
                res.writeHead(500);
                res.end('Server error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': mimeType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌐 Frontend Server running on port ${PORT}`);
    console.log(`📁 Serving files from: ${__dirname}`);
    console.log(`🌍 Local access: http://localhost:${PORT}`);
    console.log(`🌍 External access: http://YOUR_IP_ADDRESS:${PORT}`);
    console.log(`📱 Mobile/Device access: http://YOUR_IP_ADDRESS:${PORT}`);
    console.log(`⏰ Started at: ${new Date().toISOString()}`);
});
