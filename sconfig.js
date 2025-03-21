const $path = require('path');
const $package = require('./package.json');

const config = {};

// 任务运行时环境，保存任务执行期间一些环境参数
config.context = {};
config.root = $path.resolve(__dirname);

// 源代码路径
config.src = 'src';
// 构建生成路径
config.dist = 'dist';

// 项目名称，应当与 package.json 同步
config.name = $package.name || 'demo';
config.name = config.name.replace(/^@\w+\//, '');
// 项目组
config.group = 'group';

module.exports = config;
