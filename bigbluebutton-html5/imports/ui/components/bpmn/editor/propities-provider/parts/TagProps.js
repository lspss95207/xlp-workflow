'use strict';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    utils = require('bpmn-js-properties-panel/lib/Utils'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');

module.exports = function(group, element, translate, options) {

  var description = options && options.description;

  // Id
  group.entries.push(entryFactory.validationAwareTextField({
    id: 'tag',
    label: translate('Tag'),
    description: description && translate(description),
    modelProperty: 'tag',
    getProperty: function(element) {
      if(getBusinessObject(element).tags){
        var str = "";
        getBusinessObject(element).tags.forEach(element => {
          str += element.label+" ";
        });
        return str
      }else{
        return null;
      }
    },
    setProperty: function(element, properties) {

      // return cmdHelper.updateProperties(element, properties);
    },
    validate: function(element, values) {
      // var idValue = values.id;

      // var bo = getBusinessObject(element);

      // var idError = utils.isIdValid(bo, idValue, translate);

      // return idError ? { id: idError } : {};

      return {};
    }
  }));

};
