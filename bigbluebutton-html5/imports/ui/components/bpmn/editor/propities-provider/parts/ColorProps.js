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
    id: 'color',
    label: translate('Color'),
    description: description && translate(description),
    modelProperty: 'color',
    getProperty: function (element) {
      var businessObject = getBusinessObject(element);
      emitter.emit('createShapeProperty', element.id, 'bbb:Styles');
      var styles = getExtension(businessObject, 'bbb:Styles');

      return styles.color;
    },
    setProperty: function (element, properties) {

      element = element.labelTarget || element;

      properties.color = (properties.color=="")?"white":properties.color;

      emitter.emit('setShapeStyles', element.id, {color: properties.color});

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
