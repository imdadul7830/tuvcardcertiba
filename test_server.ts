import { spawn } from 'child_process';
import http from 'http';

const server = spawn('npx', ['node', 'dist/server.cjs'], {
  env: { ...process.env, PORT: '8888', NODE_ENV: 'production' }
});

server.stdout.on('data', data => console.log(`stdout: ${data}`));
server.stderr.on('data', data => console.error(`stderr: ${data}`));

setTimeout(() => {
  http.get('http://localhost:8888/api/health', (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    server.kill();
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
    server.kill();
  });
}, 3000);
