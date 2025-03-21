const $fse = require('fs-extra');
const $execa = require('execa');
const { resolve } = require('./path');

// 获取git路径
function getGitPath() {
  let gitPath = '';
  const gitConfigFile = resolve('.git/config');
  let gitConfig = '';
  if ($fse.existsSync(gitConfigFile)) {
    gitConfig = $fse.readFileSync(gitConfigFile, 'utf-8').trim();
    const match = (/\[remote\s*"origin"\]([^[\]]+)\[/).exec(gitConfig);
    let info = '';
    const gitInfo = {};
    if (match[1]) {
      info = match[1].trim();
    }
    if (info) {
      info.split(/[\r\n]+/).forEach((line) => {
        const trim = line.trim();
        const pair = trim.split('=');
        const key = pair[0].trim();
        const val = pair[1].trim();
        gitInfo[key] = val;
      });
    }
    if (gitInfo.url) {
      let { url } = gitInfo;
      url = url.replace(/http[:/\w.]+.com\//, '');
      url = url.replace(/git@[:/\w.]+com:/, '');
      url = url.replace(/\.git$/, '');
      gitPath = url;
    }
  }
  return gitPath;
};

// 获取git版本
const getGitVersion = function () {
  let gitVersion = '';
  const gitHEADFile = resolve('.git/HEAD');
  if ($fse.existsSync(gitHEADFile)) {
    // ref: refs/heads/develop
    const gitHEAD = $fse.readFileSync(gitHEADFile, 'utf-8').trim();
    // refs/heads/develop
    // eslint-disable-next-line prefer-destructuring
    const ref = gitHEAD.split(': ')[1];
    // 环境：develop
    // eslint-disable-next-line prefer-destructuring
    const develop = gitHEAD.split('/')[2];

    const gitRefFile = resolve(`.git/${ref}`);
    if ($fse.existsSync(gitRefFile)) {
      // git版本号，例如：6ceb0ab5059d01fd444cf4e78467cc2dd1184a66
      gitVersion = $fse.readFileSync(gitRefFile, 'utf-8').trim();
    }
    gitVersion = gitVersion.slice(0, 10);

    // 例如dev环境: "develop: 6ceb0ab5059d01fd444cf4e78467cc2dd1184a66"
    console.log(`branch: ${develop} version: ${gitVersion}`);
  }
  return gitVersion;
};

async function getGitUser() {
  const uinfo = {
    name: '',
    email: '',
  };
  try {
    const { stdout } = await $execa('git', ['config', '--get', 'user.name']);
    uinfo.name = stdout;
  } catch (err) {
    // do nothing
  }
  try {
    const { stdout } = await $execa('git', ['config', '--get', 'user.email']);
    uinfo.email = stdout;
  } catch (err) {
    // do nothing
  }
  return uinfo;
}

exports.getGitPath = getGitPath;
exports.getGitVersion = getGitVersion;
exports.getGitUser = getGitUser;
