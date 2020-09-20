import inherits from 'inherits';

import {
  attr as svgAttr
} from 'tiny-svg';

import BpmnRenderer from '../../../bpmn-js/lib/draw/BpmnRenderer';

import {
  is
} from '../../../bpmn-js/lib/util/ModelUtil';

var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
var getExtension = require('../../lib/util/ModelUtil').getExtension;



export default function ColoredRenderer(
    config, eventBus, styles,
    pathMap, canvas, textRenderer) {

  BpmnRenderer.call(
    this,
    config, eventBus, styles,
    pathMap, canvas, textRenderer,
    1400
  );

  this.canRender = function(element) {
    var businessObject = getBusinessObject(element);
    var styles = getExtension(businessObject, 'bbb:Styles');
    return is(element, 'bpmn:BaseElement') && styles;
  };

  this.drawShape = function(parent, shape) {

    var bpmnShape = this.drawBpmnShape(parent, shape);

    var businessObject = getBusinessObject(shape);
    var styles = getExtension(businessObject, 'bbb:Styles');
    
    const color = styles.color ?? "white";
    const strokeColor = styles.strokeColor ?? "black";


    svgAttr(bpmnShape, { fill: color, stroke: strokeColor});

    eventBus.fire('element.changed', { element: bpmnShape });

    return bpmnShape;
  };
}

inherits(ColoredRenderer, BpmnRenderer);

ColoredRenderer.prototype.drawBpmnShape = BpmnRenderer.prototype.drawShape;


ColoredRenderer.$inject = [
  'config.bpmnRenderer',
  'eventBus',
  'styles',
  'pathMap',
  'canvas',
  'textRenderer'
];