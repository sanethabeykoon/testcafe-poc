const bunyan = require('bunyan');

export function getLogger(){
    
    return bunyan.createLogger({name: 'webflow', streams: [{
    path: './log/webflow.log',
    level: 'info'
    }]});
}
