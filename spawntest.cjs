const { spawn } = require('child_process');
const p = spawn(process.execPath, ['-e', "console.log('child ok')"], { stdio: 'inherit' });
p.on('error', (e) => { console.error('spawn error', e); process.exit(1); });
