'use strict';


var inherits = require('inherits');

var PropertiesActivator = require('bpmn-js-properties-panel/lib/PropertiesActivator.js');

var processProps = require('./parts/ProcessProps'),
    eventProps = require('./parts/EventProps'),
    linkProps = require('./parts/LinkProps'),
    documentationProps = require('./parts/DocumentationProps'),
    idProps = require('./parts/IdProps'),
    tagProps = require('./parts/TagProps'),
    colorProps = require('./parts/ColorProps'),
    strokeColorProps = require('./parts/StrokeColorProps'),
    nameProps = require('./parts/NameProps'),
    executableProps = require('./parts/ExecutableProps');

function createGeneralTabGroups(
    element, canvas, bpmnFactory,
    elementRegistry, translate) {

  var generalGroup = {
    id: 'general',
    label: translate('General'),
    entries: []
  };

  idProps(generalGroup, element, translate);
  nameProps(generalGroup, element, bpmnFactory, canvas, translate);
  processProps(generalGroup, element, translate);
  executableProps(generalGroup, element, translate);

  var detailsGroup = {
    id: 'details',
    label: translate('Details'),
    entries: []
  };
  linkProps(detailsGroup, element, translate);
  eventProps(detailsGroup, element, bpmnFactory, elementRegistry, translate);

  var documentationGroup = {
    id: 'documentation',
    label: translate('Documentation'),
    entries: []
  };

  documentationProps(documentationGroup, element, bpmnFactory, translate);

  return [
    generalGroup,
    detailsGroup,
    documentationGroup
  ];

}

function createBBBTabGroups(element, canvas, bpmnFactory, elementRegistry, translate, eventBus) {

  // Create a group called "BBB".
  var BBBGroup = {
    id: 'bbb',
    label: 'BBB',
    entries: []
  };
  // Add the spell props to the black magic group.
  tagProps(BBBGroup, element, translate);
  colorProps(BBBGroup, element, translate, eventBus);
  strokeColorProps(BBBGroup, element, translate, eventBus);

  return [
    BBBGroup
  ];
}




function BpmnPropertiesProvider(
    eventBus, canvas, bpmnFactory, elementRegistry, translate) {

  PropertiesActivator.call(this, eventBus);

  this.getTabs = function(element) {

    var generalTab = {
      id: 'general',
      label: translate('General'),
      groups: createGeneralTabGroups(
        element, canvas, bpmnFactory, elementRegistry, translate)
    };

    var bbbTab = {
      id: 'bbb',
      label: 'BBB',
      groups: createBBBTabGroups(element, canvas, bpmnFactory, elementRegistry, translate, eventBus)
    };

    return [
      generalTab,
      bbbTab
    ];
  };
}

BpmnPropertiesProvider.$inject = [
  'eventBus',
  'canvas',
  'bpmnFactory',
  'elementRegistry',
  'translate'
];

inherits(BpmnPropertiesProvider, PropertiesActivator);

module.exports = BpmnPropertiesProvider;
