import { execSync } from 'child_process';

try {
  execSync('npm whoami', { stdio: 'inherit' });
  console.log('✔ npm 已登录');
} catch (err) {
  console.error('❌ npm 未登录，请运行 npm login 后再执行 release');
  process.exit(1);
}
