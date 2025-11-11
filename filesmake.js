const fs = require('fs');
const dirs = ['controllers', 'middlewares', 'models', 'routes', 'utils'];
const files = {
  controllers: ['authController.js', 'productController.js'],
  middlewares: ['authMiddleware.js', 'adminMiddleware.js'],
  models: ['User.js', 'Product.js'],
  routes: ['authRoutes.js', 'productRoutes.js'],
  utils: ['cloudinary.js'],
  root: ['.env', 'server.js', 'package.json']
};

dirs.forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
  files[dir].forEach(file => fs.writeFileSync(`${dir}/${file}`, ''));
});

files.root.forEach(file => fs.writeFileSync(file, ''));
console.log('✅ Project structure created successfully!');