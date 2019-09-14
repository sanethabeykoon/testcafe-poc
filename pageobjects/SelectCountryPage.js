import { t } from 'testcafe';
import {getLogger} from '../lib/logger';
const log = getLogger();

export default class SelectCountryPage {

    constructor (wfSpec, parameters) {
        this.wfSpec = wfSpec;
        this.parameters = parameters;

        this.countryName = this.wfSpec.getElementWithText('div', this.parameters.country);

        //Text content
        this.textContent01 = this.wfSpec.getElementWithText('h1', "");
        this.textContent02 = this.wfSpec.getElementWithText('p', "");
    }

    async selectCountry() {
        await t.expect(this.countryName.exists).ok('countryName element does not exist.')
        .click(this.countryName)
        .navigateTo('http://hmd.ebuildertest.io.s3-website-eu-west-1.amazonaws.com/' + this.parameters.locale + '/repair');
    }

    async verifyTextContent(){
        log.info(await this.textContent01.innerText);
        log.info(await this.textContent02.innerText);

        await t.expect(await this.textContent01.innerText).eql(this.parameters.countryPage_Text01, "countryPage_Text01 is empty or NOT equal.")
        .expect(await this.textContent02.innerText).eql(this.parameters.countryPage_Text02, "countryPage_Text02 is empty or NOT equal.");
    }
}