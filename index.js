
const WServer = require('./src/models/server');
const { port } = require('./src/env/env')

const sv = new WServer(port);
sv.listen();

