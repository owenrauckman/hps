'use strict';

var _index = require('./index');

var _index2 = _interopRequireDefault(_index);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _config = require('./config.json');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var server = _http2.default.createServer(_index2.default);
server.listen(process.env.PORT || _config2.default.port);
server.on('listening', function () {
  console.log('server listening on port ' + _config2.default.port);
});