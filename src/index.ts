import { default as $main } from './comp/run';
import './comp/style.less';

export const { VERSION } = process.env;
console.info('version:', VERSION);

export const main = $main;
