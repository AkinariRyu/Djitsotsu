import * as http from 'http';

const PORT = process.env.PORT || 5403;

http
  .createServer((_: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'chat', status: 'ok', port: PORT }));
  })
  .listen(Number(PORT), () => console.log(`Chat service listening on ${PORT}`));
