const express = require('express');
const path = require('path');

const server = express();

server.use(express.static('./dist/maestro-portalunico'));

server.get('/*', function(req,res) {
    res.sendFile(path.join(__dirname,'/dist/maestro-portalunico/index.html'));
});

server.listen(process.env.PORT || 4200, function () {
    console.log('Server is running on http://localhost:4200');
});