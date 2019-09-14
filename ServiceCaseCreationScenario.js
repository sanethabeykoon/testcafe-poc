import {getLogger} from './lib/logger';
const log = getLogger();

import {webFlowSpec} from './lib/webflow.spec';
import {getServiceCase,closeServiceCase,verifyNotificationEmail} from './lib/serviceclients';

import SelectCountryPage from './pageobjects/SelectCountryPage';
import SelectDevicePage from './pageobjects/SelectDevicePage';
import ProblemPage from './pageobjects/ProblemPage';

import {dataSet} from './config/webflow.config';

const wfSpec = webFlowSpec();

var caseId;
var emailStatus;
var serviceCase;

const parameters = dataSet[0];

const selectCountryPage = new SelectCountryPage(wfSpec, parameters);
const selectDevicePage = new SelectDevicePage(wfSpec, parameters);
const problemPage = new ProblemPage(wfSpec, parameters);

fixture `Test Environment`;

test.page `http://hmd.ebuildertest.io.s3-website-eu-west-1.amazonaws.com`
('Test Case: Service case creation - Front end scenario', async t => {

    caseId = null;
    
    try{
        await t.maximizeWindow();

        //await selectCountryPage.verifyTextContent();
        await selectCountryPage.selectCountry();

        //await selectDevicePage.verifyTextContent();
        await selectDevicePage.selectDevice();

        //await problemPage.verifyTextContent();
        await problemPage.selectProblemUsingList();
        
        //flow continues further...

        //await t.wait(60000);
    }catch(err){
        let errorMsg = 'Error details: error type: ' + err.type 
        + ', TestCafe error status: ' + err.isTestCafeError 
        + ', error message: ' + err.errMsg;

        log.error(errorMsg);
        throw errorMsg;
    }
    
});

test('Test Case: Service case creation - Back end scenario', async t => {

    try{

        //Verifing service case creation
        serviceCase = await getServiceCase(caseId.substring(14), parameters.product);

        log.info('CaseID: ' + serviceCase[0].caseId);
        log.info('Product: ' + serviceCase[0].product);
        log.info('Status: ' + serviceCase[0].status);

        await t.expect(serviceCase[0].caseId).eql(caseId.substring(14), 'CaseID is NOT the expected.');
        await t.expect(serviceCase[0].product).eql(parameters.product, 'Product is NOT the expected.');

        //Closing the service case if it's NOT in the expected status
        if(serviceCase[0].status != 'Inprogress'){
            serviceCase = null;
            serviceCase = await closeServiceCase(caseId.substring(14), parameters.product);
            await t.expect(serviceCase.message.status).eql('Closed', 'Service case status is NOT in Closed');
        }

        //Verifing notification email - service case creation
        emailStatus = await verifyNotificationEmail(caseId.substring(14));
        await t.expect(emailStatus.availability).ok('Notification email verification failed. Notification availability is NOT TRUE.');

    }catch(err){
        let errorMsg = 'Error details: error type: ' + err.type 
        + ', TestCafe error status: ' + err.isTestCafeError 
        + ', error message: ' + err.errMsg;

        log.error(errorMsg);
        throw errorMsg;
    }
    
});
