import React from 'react';

import emitter from '/imports/utils/events';

import BpmnJS from '../bpmn-js/dist/bpmn-navigated-viewer.development.js';
import Modeler from '../bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from './propities-provider';
import bbbModdleDescriptor from '../descriptors/bbb'
import colorPickerModule from './addition-modules/color-picker';


import '../bpmn-js/dist/assets/diagram-js.css';
import '../bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import '../bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
import 'bpmn-js-properties-panel/dist/assets/bpmn-js-properties-panel.css'

import { styles } from './styles.scss';


export default class BpmnDiagramEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.containerRef = React.createRef();
    this.panelRef = React.createRef();
  }

  componentDidMount() {
    const {
      url,
      diagramXML,
    } = this.props;

    const container = this.containerRef.current;
    const panel = this.panelRef.current;

    this.bpmnModeler = new Modeler({
      container,
      propertiesPanel: {
        parent: panel
      },
      additionalModules: [
        propertiesPanelModule,
        propertiesProviderModule,
        colorPickerModule
      ],
      moddleExtensions: {
        bbb: bbbModdleDescriptor
      }
    });

    this.bpmnModeler.on('import.done', (event) => {
      const {
        error,
        warnings,
      } = event;

      if (error) {
        return this.handleError(error);
      }

      this.bpmnModeler.get('canvas').zoom('fit-viewport');

      return this.handleShown(warnings);
    });

    this.addListeners();

    if (url) {
      return this.fetchDiagram(url);
    }

    if (diagramXML) {
      return this.displayDiagram(diagramXML);
    }

    const XML = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"  id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.1.0" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
      <bpmn2:process id="Process_1" isExecutable="false">
        <bpmn2:startEvent id="StartEvent_1" name="StartEvent_1" />
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
        </bpmndi:BPMNPlane>
      </bpmndi:BPMNDiagram>
    </bpmn2:definitions>`;
    return this.displayDiagram(XML);
  }

  componentWillUnmount() {
    this.bpmnModeler.destroy();
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      props,
      state,
    } = this;

    if (props.url !== prevProps.url) {
      return this.fetchDiagram(props.url);
    }

    const currentXML = props.diagramXML || state.diagramXML;

    const previousXML = prevProps.diagramXML || prevState.diagramXML;

    if (currentXML && currentXML !== previousXML) {
      return this.displayDiagram(currentXML);
    }
  }


  addListeners() {

    this.createShapeListener = emitter.on('createShape', (message, tags, style={color: 'white', strokeColor: 'black'}) => {
      const modeler = this.bpmnModeler;
      // (1) Get the modules
      const bpmnFactory = modeler.get('bpmnFactory');
      const elementFactory = modeler.get('elementFactory');
      const elementRegistry = modeler.get('elementRegistry');
      const modeling = modeler.get('modeling');
      const moddle = modeler.get('moddle');

      // (2) Get the existing process and the start event
      const process = elementRegistry.get('Process_1');
      const startEvent = elementRegistry.get('StartEvent_1');

      // (3) Create a service task shape
      const element = elementFactory.createShape({ type: 'bpmn:Task' });
      modeling.updateProperties(element, { name: message });


      // (4) Add the new service task shape to the diagram using `createShape` to connect it to an existing
      // shape
      
      modeling.createShape(element, { x: 400, y: 100 }, process);


      emitter.emit('setShapeStyles', element.id, style);
      emitter.emit('setShapeTags', element.id, tags);

      console.log(element)

      //for test
      modeler.saveXML({ format: true }, function(err, xml) {
        console.log(xml)
      });
      
    });

    this.setShapeTagsListener =  emitter.on('setShapeTags', (elementID, tags) => {
      //TODO modify for tag object
      const modeler = this.bpmnModeler;
      const elementRegistry = modeler.get('elementRegistry');
      const element = elementRegistry.get(elementID);
      const eventBus = modeler.get('eventBus');
      const moddle = modeler.get('moddle');

      var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
      var getExtension = require('./lib/util/ModelUtil').getExtension;

      var businessObject = getBusinessObject(element);

      console.log(businessObject)

      businessObject.tags = [];

      console.log(businessObject.tags)
      tags.forEach((element) => {
        var tag = moddle.create('bbb:Tag',{
          id: element.id,
          label: element.label,
          description: element.description,
          removable: element.removable,
          type: element.type
        })
        console.log(tag);
        businessObject.tags.push(tag);
      });
    });

    this.createShapePropertyListener = emitter.on('createShapeProperty', (elementID, propertyName) => {
      const modeler = this.bpmnModeler;
      const elementRegistry = modeler.get('elementRegistry');
      const element = elementRegistry.get(elementID);
      const eventBus = modeler.get('eventBus');
      const moddle = modeler.get('moddle');

      var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
      var getExtension = require('./lib/util/ModelUtil').getExtension;

      var businessObject = getBusinessObject(element);
      var property = getExtension(businessObject, propertyName);
      if (!property) {
        property = moddle.create(propertyName);
        businessObject.extensionElements = businessObject.extensionElements || moddle.create('bpmn:ExtensionElements');
        businessObject.extensionElements.get('values').push(property);
      }
    });


    this.setShapeStylesListener = emitter.on('setShapeStyles', (elementID, style) => {
      const modeler = this.bpmnModeler;
      const elementRegistry = modeler.get('elementRegistry');
      const element = elementRegistry.get(elementID);
      const eventBus = modeler.get('eventBus');

      var getBusinessObject = require('bpmn-js/lib/util/ModelUtil').getBusinessObject;
      var getExtension = require('./lib/util/ModelUtil').getExtension;

      var businessObject = getBusinessObject(element);
      emitter.emit('createShapeProperty', elementID, 'bbb:Styles');
      var styles = getExtension(businessObject, 'bbb:Styles');
      console.log(styles)


      if(style.color){
        styles.color = style.color;
      }
      if(style.strokeColor){
        styles.strokeColor = style.strokeColor;
      }
      


      eventBus.fire('element.changed', { element: element });
    });



  }


  displayDiagram(diagramXML) {
    this.bpmnModeler.importXML(diagramXML);
  }

  fetchDiagram(url) {
    this.handleLoading();

    fetch(url)
      .then(response => response.text())
      .then(text => this.setState({ diagramXML: text }))
      .catch(err => this.handleError(err));
  }

  handleLoading() {
    const { onLoading } = this.props;

    if (onLoading) {
      onLoading();
    }
  }

  handleError(err) {
    const { onError } = this.props;

    if (onError) {
      onError(err);
    }
  }

  handleShown(warnings) {
    const { onShown } = this.props;

    if (onShown) {
      onShown(warnings);
    }
  }

  render() {
    return (
      <div className={styles.content+" "+styles.withDiagram}>
        <div
          className={styles.bpmnComponent}
          ref={this.containerRef}
        >
        </div>
        <div
          className={styles.propertiesPanelParent}
          ref={this.panelRef}
        >
        </div>
      </div>
    );
  }
}
