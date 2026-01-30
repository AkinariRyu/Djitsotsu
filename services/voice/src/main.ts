import * as http from 'http';

const PORT = process.env.PORT || 5404;

http
  .createServer((_: http.IncomingMessage, res: http.ServerResponse) => {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ service: 'voice', status: 'placeholder', port: PORT }));
  })
  .listen(Number(PORT), () => console.log(`Voice service (placeholder) on ${PORT}`));
