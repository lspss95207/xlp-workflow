'use strict';

import emitter from '/imports/ui/components/tag/events';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
    getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
    utils = require('bpmn-js-properties-panel/lib/Utils'),
    cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');


module.exports = function(group, element, translate, options, eventBus) {

  var description = options && options.description;

  // Id
  group.entries.push(entryFactory.validationAwareTextField({
    id: 'color',
    label: translate('Color'),
    description: description && translate(description),
    modelProperty: 'color',
    getProperty: function(element) {
      return getBusinessObject(element).color;
    },
    setProperty: function(element, properties) {

      element = element.labelTarget || element;

      if(properties.color){
        // getBusinessObject(element).color = properties.color;
        console.log(element)
        emitter.emit('updateShapeColor', element.id, properties.color);
      }

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
