import {getRequest} from './servicecaseclient.js';
import {closeRequest} from './servicecaseclient.js';
import {verifyEmail} from './gmailclient.js';

export async function getServiceCase(caseId, product){
    let res = await getRequest(caseId, product);
    return JSON.parse(res);
}

export async function closeServiceCase(caseId, product){
    let reqObj = JSON.parse('{"caseId":"' + caseId +'", "product":"' + product + '", "status":"Closed"}');
    let res = await closeRequest(reqObj);
    return JSON.parse(res);
}

export async function verifyNotificationEmail(caseId){
    let emailStatus = await verifyEmail(caseId);
    return emailStatus;
}
