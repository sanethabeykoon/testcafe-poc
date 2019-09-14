import { t } from 'testcafe';
import {getLogger} from '../lib/logger';
const log = getLogger();

export default class SelectDevicePage {
    constructor (wfSpec, parameters) {
        this.wfSpec = wfSpec;
        this.parameters = parameters;

        this.phoneModel = this.wfSpec.getNthElement('.img-wrapper', this.parameters.phoneModel);
        
        this.modelSearchBox = this.wfSpec.getElementWithAttribute('input', 'placeholder', 'Search').with({selectorTimeout: 10000, visibilityCheck: true});
        this.modelListItem = this.wfSpec.getElementWithText('span', this.parameters.modelListItem);
        this.modelNotFound = this.wfSpec.getElementWithText('a', this.parameters.modelNotFound);

        //Text content
        this.textContent01 = this.wfSpec.getElementWithText('h1', "");
        this.textContent02 = this.wfSpec.getElementWithText('p', "");
        this.textContent03 = this.wfSpec.getElementWithText('h1', "");
        this.textContent04 = this.wfSpec.getElementWithText('p', "");
        this.textContent05 = this.wfSpec.getElementWithText('h1', "");
    }

    async selectDeviceUsingList(){
        await t.typeText(this.modelSearchBox, '#')
        .expect(this.modelNotFound.exists).ok('modelNotFound element does not exist.')

        .selectText(this.modelSearchBox)
        .typeText(this.modelSearchBox, 'noki')
        .expect(this.modelListItem.exists).ok('modelListItem element does not exist.')
        .click(this.modelListItem);
    }

    async selectDevice(){
        await t.click(this.phoneModel);
    }

    async verifyTextContent(){
        log.info(await this.textContent01.innerText);
        log.info(await this.textContent02.innerText);
        log.info(await this.textContent03.innerText);
        log.info(await this.textContent04.innerText);
        log.info(await this.textContent05.innerText);

        await t.expect(await this.textContent01.innerText).eql(this.parameters.devicePage_Text01, "devicePage_Text01 is empty or NOT equal.")
        .expect(await this.textContent02.innerText).eql(this.parameters.devicePage_Text02, "devicePage_Text02 is empty or NOT equal.")
        .expect(await this.textContent03.innerText).eql(this.parameters.devicePage_Text03, "devicePage_Text03 is empty or NOT equal.")
        .expect(await this.textContent04.innerText).eql(this.parameters.devicePage_Text04, "devicePage_Text04 is empty or NOT equal.")
        .expect(await this.textContent05.innerText).eql(this.parameters.devicePage_Text05, "devicePage_Text05 is empty or NOT equal.");
    }

}