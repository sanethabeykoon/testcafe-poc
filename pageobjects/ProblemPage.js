import { t } from 'testcafe';
import {getLogger} from '../lib/logger';
const log = getLogger();

export default class ProblemPage {
    constructor (wfSpec, parameters) {
        this.wfSpec = wfSpec;
        this.parameters = parameters;

        this.problemCategory   = this.wfSpec.getElementWithText('button', this.parameters.problemCategory);
        this.problem   = this.wfSpec.getElementWithText('button', this.parameters.problem);

        this.problemSearchBox = this.wfSpec.getElementWithAttribute('input', 'placeholder', 'Search: E.g. Damaged display').with({selectorTimeout: 10000, visibilityCheck: true});
        this.problemListItem = this.wfSpec.getElementWithText('span', this.parameters.problemListItem);
        this.problemNotFound = this.wfSpec.getElementWithText('a', this.parameters.problemNotFound);

        this.problemDescription   = this.wfSpec.getElement('textarea');
        this.nextButton   = this.wfSpec.getElementWithText('button', this.parameters.problemSubmit);

        //Text content
        this.textContent01 = this.wfSpec.getElementWithText('h1', "");
        this.textContent02 = this.wfSpec.getElementWithText('p', "");
    }

    async selectProblemUsingList(){
        await t.typeText(this.problemSearchBox, '#')
        .expect(this.problemNotFound.exists).ok('problemNotFound element does not exist.')

        .selectText(this.problemSearchBox)
        .typeText(this.problemSearchBox, 'Display flickers')
        .expect(this.problemListItem.exists).ok('problemListItem element does not exist.')
        .click(this.problemListItem);

        await t.expect(await this.problemCategory.getStyleProperty("background-color")).eql("rgb(39, 49, 66)", "The corresponding Problem Category button has NOT been selected.")
        .expect(await this.problem.getStyleProperty("background-color")).eql("rgb(39, 49, 66)", "The corresponding Problem button has NOT been selected.");
        
        await t.typeText(this.problemDescription, this.parameters.problemDescription)
        .click(this.nextButton);
    }

    async selectProblem(){
        await t.click(this.problemCategory)
        .click(this.problem)
        .typeText(this.problemDescription, this.parameters.problemDescription)
        .click(this.nextButton);
    }

    //Verifying text content
    async verifyTextContent(){
        log.info(await this.textContent01.innerText);
        log.info(await this.textContent02.innerText);

        await t.expect(await this.textContent01.innerText).eql(this.parameters.problemPage_Text01, "problemPage_Text01 is empty or NOT equal.")
        .expect(await this.textContent02.innerText).eql(this.parameters.problemPage_Text02, "problemPage_Text02 is empty or NOT equal.");
    }

}