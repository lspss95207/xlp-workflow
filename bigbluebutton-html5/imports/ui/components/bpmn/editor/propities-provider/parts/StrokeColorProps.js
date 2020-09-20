'use strict';

import emitter from '/imports/utils/events';

var entryFactory = require('bpmn-js-properties-panel/lib/factory/EntryFactory'),
  getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject,
  getExtension = require('../../lib/util/ModelUtil').getExtension,
  utils = require('bpmn-js-properties-panel/lib/Utils'),
  cmdHelper = require('bpmn-js-properties-panel/lib/helper/CmdHelper');



module.exports = function (group, element, translate, options, eventBus) {

  var description = options && options.description;

  // Id
  group.entries.push(entryFactory.validationAwareTextField({
    id: 'strokeColor',
    label: translate('Stroke Color'),
    description: description && translate(description),
    modelProperty: 'strokeColor',
    getProperty: function (element) {
      var businessObject = getBusinessObject(element);
      var styles = getExtension(businessObject, 'bbb:Styles');
      if (!styles) {
        emitter.emit('createProperty', element.id, 'bbb:Styles');
      }
      styles = getExtension(businessObject, 'bbb:Styles');
      return styles.strokeColor;
    },

    setProperty: function (element, properties) {

      element = element.labelTarget || element;

      console.log(element)
      properties.strokeColor = (properties.strokeColor=="")?"black":properties.strokeColor;
      emitter.emit('setShapeStyles', element.id, {strokeColor: properties.strokeColor});

      // return cmdHelper.updateProperties(element, properties);
    },
    validate: function (element, values) {
      // var idValue = values.id;

      // var bo = getBusinessObject(element);

      // var idError = utils.isIdValid(bo, idValue, translate);

      // return idError ? { id: idError } : {};

      return {};
    }
  }));

};
