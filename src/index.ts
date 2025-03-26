import { default as $main } from './comp/run';
import './comp/style.less';

// export const { VERSION, __APP_ENV__ } = process.env;
// console.info('version:', VERSION);
console.log('NODE_ENV:', NODE_ENV);


export const main = $main;
