const RestClient = require('node-rest-client').Client;
import {getLogger} from './logger';

const log = getLogger();

export function getRequest(caseId, product){

    var args = {
        serviceCaseRes: ''
    };

    log.info("Query parameters into GET request: caseId=" + caseId + ", product=" + product);

    var client = new RestClient();

    client.get("https://endpoint/?caseId=" + caseId + "&product=" + product, args, function (data, response) {
        args.serviceCaseRes = JSON.stringify(data);
    });
    client.on('error', function (err) {
        log.error("Something went wrong in the service case client. Error message: " + err);
    });
      
    return new Promise(function(resolve, reject){
        const interval = setInterval(function(){
                    if (args.serviceCaseRes != '') {
                      clearInterval(interval);
                      resolve(args.serviceCaseRes);
                    }
                  }
        , 3000);
    });

}

export function closeRequest(requestObj){

    var args = {
        headers: { "":"" },
        data: requestObj,
        serviceCaseRes: ''
    };

    log.info("Request data into PUT request: " + args.data);

    var client = new RestClient();
    
    client.put("https://endpoint", args, function (data, response) {
        args.serviceCaseRes = JSON.stringify(data);
    });
    client.on('error', function (err) {
        log.error("Something went wrong in the service case client. Error message: " + err);
    });
      
    return new Promise(function(resolve, reject){
        const interval = setInterval(function(){
                    if (args.serviceCaseRes != '') {
                      clearInterval(interval);
                      resolve(args.serviceCaseRes);
                    }
                  }
        , 3000);
    });

}
