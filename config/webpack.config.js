const $fse = require('fs-extra');
const $path = require('path');
const $webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const PostcssFlexbugxFixes = require('postcss-flexbugs-fixes');
const PostcssPresetEnv = require('postcss-preset-env');
const paths = require('./paths');
const $config = require('../sconfig');
const $package = require('../package.json');

module.exports = function (mode) {
  const isProd = mode === 'production';
  const isDev = mode === 'development';
  const isOther = !isProd && !isDev;
  const useEs6 = process.env.COMPILE_TARGET === 'es6';

  console.info(
    'process.env.COMPILE_TARGET:',
    process.env.COMPILE_TARGET,
  );

  const postCssPlugins = [];
  const cssPresetEnv = PostcssPresetEnv({
    autoprefixer: {
      flexbox: 'no-2009',
    },
    stage: 3,
  });
  postCssPlugins.push(PostcssFlexbugxFixes);
  postCssPlugins.push(cssPresetEnv);

  const postcssLoader = {
    // Options for PostCSS as we reference these options twice
    // Adds vendor prefixing based on your specified browser support in
    // package.json
    loader: require.resolve('postcss-loader'),
    options: {
      postcssOptions: {
        plugins: postCssPlugins,
      },
    },
  };

  const wpModuleRules = [
    {
      test: /\.css$/,
      sideEffects: true,
      use: [
        'style-loader',
        'css-loader',
        postcssLoader,
      ],
    }, {
      test: /\.less$/,
      sideEffects: true,
      use: [
        'style-loader',
        'css-loader',
        postcssLoader,
        'less-loader',
      ],
    },
  ];

  const tsUse = [];
  const tsLoader = {
    loader: require.resolve('ts-loader'),
    options: {
      allowTsInNodeModules: false,
    },
  };

  const resolvePlugins = [];

  if (!useEs6) {
    wpModuleRules.push({
      test: /\.js$/,
      loader: 'babel-loader',
      resolve: {
        fullySpecified: false,
      },
    });
    tsUse.push('babel-loader');
  }

  tsUse.push(tsLoader);
  wpModuleRules.push({
    test: /\.tsx?$/,
    use: tsUse,
  });

  const webpackConfig = {
    mode: isProd ? 'production' : 'development',
    entry: [
      isDev && require.resolve('react-dev-utils/webpackHotDevClient'),
      paths.appIndexJs,
    ].filter(Boolean),
    output: {
      path: (isProd || isOther) ? paths.appBuild : undefined,
      pathinfo: isDev,
      filename: $config.name + (isProd ? '.min.js' : '.js'),
      library: $config.name,
      libraryTarget: 'umd',
    },
    resolve: {
      // Add `.ts` and `.tsx` as a resolvable extension.
      extensions: ['.ts', '.tsx', '.js'],
      plugins: resolvePlugins,
      fallback: { url: require.resolve('url/') },
    },
    devtool: isProd ? undefined : 'cheap-module-source-map',
    module: {
      rules: wpModuleRules,
    },
    plugins: [
      new $webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify($package.version),
        },
      }),
    ],
  };

  if (useEs6) {
    webpackConfig.optimization = {
      usedExports: true,
      minimizer: [new TerserPlugin()],
    };
    webpackConfig.target = 'web';
  }

  if (isProd || isDev) {
    const files = $fse.readdirSync(paths.appTplDir);
    if (files.length <= 1) {
      const htmlPligin = new HtmlWebpackPlugin({
        title: $package.name,
        inject: false,
        minify: false,
        filename: 'index.html',
        template: paths.appHtml,
      });
      webpackConfig.plugins.push(htmlPligin);
    } else {
      files.forEach((file) => {
        const tplPath = $path.join(paths.appTplDir, file);
        const pureName = $path.basename(file, $path.extname(file));
        const htmlPligin = new HtmlWebpackPlugin({
          title: $package.name,
          inject: false,
          minify: false,
          filename: `${pureName}.html`,
          template: tplPath,
        });
        webpackConfig.plugins.push(htmlPligin);
      });
    }
  }

  return webpackConfig;
};
