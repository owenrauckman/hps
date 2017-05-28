'use strict';

import app from './index';
import http from 'http';
import config from './config.json';


let server = http.createServer(app);
server.listen(process.env.PORT || config.port);
server.on('listening', ()=>{
  console.log(`server listening on port ${config.port}`);
});
