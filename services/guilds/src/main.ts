import * as http from 'http';

const PORT = process.env.PORT || 5402;

http
  .createServer((_: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'guilds', status: 'ok', port: PORT }));
  })
  .listen(Number(PORT), () => console.log(`Guilds service listening on ${PORT}`));
