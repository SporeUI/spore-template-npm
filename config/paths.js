const $path = require('path');

const resolveApp = function (relativePath) {
  const cwd = process.cwd();
  return $path.join(cwd, relativePath);
};

module.exports = {
  appPath: resolveApp('.'),
  appBuild: resolveApp('dist'),
  appPublic: resolveApp('public'),
  appIndexJs: resolveApp('src/index.ts'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  appTsConfig: resolveApp('tsconfig.json'),
  proxySetup: resolveApp('setup-proxy.js'),
  appNodeModules: resolveApp('node_modules'),
};
