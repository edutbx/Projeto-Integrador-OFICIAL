const { createProxyMiddleware } = require('http-proxy-middleware');

/**
 * Proxy seletivo: apenas rotas /api/** são redirecionadas para o backend.
 * Imagens, CSS, JS e tudo mais é servido diretamente pelo React dev server.
 * 
 * O http-proxy-middleware já vem instalado com react-scripts — não precisa instalar nada.
 */
module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
    })
  );
};
