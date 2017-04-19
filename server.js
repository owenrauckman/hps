'use strict';

import app from './index';
import http from 'http';


let server = http.createServer(app);
server.listen(process.env.PORT || 3000);
server.on('listening', ()=>{
  console.log(`server listening on port 3000`);
});
