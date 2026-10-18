const { spawn } = require('child_process');
const path = require('path');

const ngBin = path.join(__dirname, 'node_modules', '@angular', 'cli', 'bin', 'ng.js');

console.log('[Runner] Starting Angular Dev Server with persistent detached stdin...');

const child = spawn(process.execPath, [
  ngBin,
  'serve',
  '--host', '0.0.0.0',
  '--port', '4200',
  '--proxy-config', 'proxy.conf.json'
], {
  cwd: __dirname,
  stdio: ['ignore', 'inherit', 'inherit'],
  env: { ...process.env, CI: 'true' }
});

child.on('error', (err) => {
  console.error('[Runner] Child process error:', err);
});

child.on('exit', (code, signal) => {
  console.log(`[Runner] Child process exited with code ${code} and signal ${signal}`);
  process.exit(code || 0);
});
