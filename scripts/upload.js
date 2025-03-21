const $path = require('path');
const $chalk = require('chalk');
const $prompts = require('prompts');
const $urlJoin = require('url-join');
const $glob = require('glob');
const { resolve } = require('./mods/path');
const { cosUpload } = require('./mods/cos');
const $config = require('../sconfig');

const { CI } = process.env;

const bucketMap = new Map();
$config.cosBuckets.forEach((item) => {
  bucketMap.set(item.name, item);
});

async function uploadDistFiles() {
  const arrTargetBuckets = [...bucketMap.keys()];
  const rsBucket = await $prompts({
    type: 'select',
    name: 'bucket',
    message: 'select bucket:',
    choices: arrTargetBuckets,
    initial: 0,
  });
  const selectedBucket = arrTargetBuckets[rsBucket.bucket];
  const selectedConfig = bucketMap.get(selectedBucket);
  const commonCosUploadOptions = {
    domain: selectedConfig.domain,
    bucket: selectedConfig.bucket,
  };

  const uploadFiles = await $glob.glob(selectedConfig.files);
  const uploadItems = [];
  uploadFiles.forEach((file) => {
    const item = {};
    item.file = file;
    item.baseName = $path.basename(item.file);
    item.localPath = resolve(file);
    uploadItems.push(item);
    item.remotePath = $urlJoin(
      selectedConfig.base,
      item.baseName,
    );
    item.fullPath = $urlJoin(
      `https://${selectedConfig.domain}`,
      item.remotePath,
    );
    let actionTip = $chalk.gray('[upload]');
    if (selectedConfig.overwrite) {
      actionTip =  $chalk.yellow('[overwrite]');
    }
    console.info(`- ${file}`);
    console.info(`- ${actionTip} =>`, $chalk.cyan(item.fullPath));
  });

  if (!CI) {
    const rsProceed = await $prompts({
      type: 'confirm',
      name: 'yes',
      message: 'Are you ready to upload files?',
      initial: false,
    });
    if (!rsProceed || !rsProceed.yes) return;
  }

  const uploadPms = [];
  uploadItems.forEach((upItem) => {
    const item = upItem;
    const pmUpload = cosUpload({
      localPath: item.localPath,
      remotePath: item.remotePath,
      overwrite: selectedConfig.overwrite,
      ...commonCosUploadOptions,
    });
    uploadPms.push(pmUpload);
  });

  await Promise.all(uploadPms);
  console.info($chalk.green('=> upload done'));
}

uploadDistFiles();
