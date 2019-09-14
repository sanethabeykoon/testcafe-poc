import {Selector} from 'testcafe';

export function webFlowSpec(){

      var wfSpec = {};

      wfSpec.getElement = function(element) {
        return Selector(element);
      }

      wfSpec.getElementWithText = function(element, text) {
        return Selector(element).withText(text);
      }

      wfSpec.getChildElementWithText = function(parentElement, childElement, text) {
        return Selector(parentElement)
              .child(childElement)
              .withText(text);
      }

      wfSpec.getElementWithExactText = function(element, exactText){
        return Selector(element).withExactText(exactText);
      }
            
      wfSpec.getNthElement = function(element, index) {
        return Selector(element).nth(index);
      }
      
      wfSpec.getElementWithAttribute = function(element, attributeName, attributeValue) {
        return Selector(element).withAttribute(attributeName, attributeValue);
      }

      wfSpec.getElementWithFilter = function(element, filter){
        return Selector(element).filter(filter);
      }

      wfSpec.getNextSibling = function(element, text, sibling){
        return Selector(Selector(element).withText(text)).nextSibling(sibling);
      }

      wfSpec.getDate = function(){
        return Selector('div').filter('.react-datepicker__week').nth(0).child(0);
      }

      return wfSpec;

}