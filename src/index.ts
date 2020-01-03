import debug from 'debug';
import http from 'http';
import { AddressInfo } from 'net';

import app from './app/app';

class Server {
  public server: http.Server;
  public port: boolean | string | number;

  constructor() {
    this.port = this.normalizePort(process.env.PORT || '3000');
    app.set('port', this.port);
    this.server = http.createServer(app);
    this.server.listen(this.port);
    this.server.on('error', this.onError);
    this.server.on('listening', () => {
      console.log(`Server started to port ${this.port}`);
      const addr = this.server.address() as AddressInfo;
      const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
      debug('Listening on ' + bind);
    });
  }

  /* Normalize a port into a number, string, or false. */
  private normalizePort(val: string): boolean | string | number {
    const n = parseInt(val, 10);

    if (isNaN(n)) {
      // named pipe
      return val;
    }

    if (n >= 0) {
      // port number
      return n;
    }

    return false;
  }

  /* Event listener for HTTP server "error" event. */
  private onError(error: any): void {
    if (error.syscall !== 'listen') {
      throw error;
    }

    const bind = typeof this.port === 'string'
      ? 'Pipe ' + this.port
      : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }
}

const server = new Server();
