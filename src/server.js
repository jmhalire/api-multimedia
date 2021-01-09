const app = require('./app');
require('./database');

app.listen(app.get('port'),
    () => console.log('server on PORT: ' + app.get('port'))
);