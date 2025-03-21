import { byteLength } from '@spore-ui/tskit';
import { asyncLog } from './mod';

async function main(): Promise<number> {
  const len: number = byteLength('中文cc');
  await asyncLog('length:', len);
  return len;
}

main();

export default main;
