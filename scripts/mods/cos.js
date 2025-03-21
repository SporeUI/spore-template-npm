const $fse = require('fs-extra');
const $chalk = require('chalk');
const $cosUpload = require('qcloud-cos-upload');
const { resolve } = require('./path');

let cachedCosConfig = null;
function getCosConf() {
  const cosFile = resolve('../cos.json');
  if (cachedCosConfig) return cachedCosConfig;
  if (!$fse.existsSync(cosFile)) {
    console.error($chalk.red('cosConfig file not exists:', cosFile));
    return;
  }
  cachedCosConfig = $fse.readJSONSync(cosFile);
  return cachedCosConfig;
}

async function cosUpload(options) {
  const expectOptions = {
    domain: '',
    bucket: '',
    localPath: '',
    remotePath: '',
  };
  const conf = {
    region: '',
    overwrite: false,
    ...expectOptions,
    ...options,
  };
  const cosConfig = getCosConf();
  if (!cosConfig) {
    console.error($chalk.red('cosUpload: require cosConfig'));
    return;
  }
  const validOptions = Object.keys(expectOptions).some((key) => {
    if (!conf[key]) {
      console.error($chalk.red(`cosUpload: require options.${key}`));
      return true;
    }
    return false;
  });
  if (validOptions) return;

  let res = null;
  try {
    res = await $cosUpload({
      cdn: conf.domain,
      overwrite: conf.overwrite,
      AppId: cosConfig.AppId,
      SecretId: cosConfig.SecretId,
      SecretKey: cosConfig.SecretKey,
      Bucket: conf.bucket,
      Region: conf.region || cosConfig.Region,
      FilePath: conf.localPath,
      Key: conf.remotePath,
    });
  } catch (err) {
    res = null;
    console.error($chalk.red(`upload ${conf.filePath} error:`), err);
  }
  return res;
}

exports.getCosConf = getCosConf;
exports.cosUpload = cosUpload;
