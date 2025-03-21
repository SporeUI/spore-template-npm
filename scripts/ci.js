const $fse = require('fs-extra');
const { resolve } = require('./path');
const $package = require('../package.json');
const $config = require('../sconfig');

async function prepareEnv() {
  const env = {};
  env.sdk_version = $package.version;
  env.sdk_upload_path = `/${$config.group}/${$config.name}`;

  const arr = [];
  Object.keys(env).forEach((envName) => {
    const envValue = env[envName];
    process.env.envName = envValue;
    const cmd = `export ${envName}="${envValue}"`;
    arr.push(cmd);
  });

  const envFile = resolve('./ignore/env.sh');
  await $fse.ensureFile(envFile);
  await $fse.writeFile(envFile, arr.join('\n'), 'utf8');
}

prepareEnv();
