import React from 'react';

import BpmnJS from 'bpmn-js/dist/bpmn-navigated-viewer.production.min.js';
import Modeler from 'bpmn-js/lib/Modeler';
import propertiesPanelModule from 'bpmn-js-properties-panel';
import propertiesProviderModule from 'bpmn-js-properties-panel/lib/provider/bpmn';

import emitter from '/imports/ui/components/tag/events';

import 'bpmn-js/dist/assets/diagram-js.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn.css';
import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';
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
        propertiesProviderModule
      ],
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
    // const XML = `<?xml version="1.0" encoding="UTF-8"?>
    // <definitions xmlns="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" id="sid-38422fae-e03e-43a3-bef4-bd33b32041b2" targetNamespace="http://bpmn.io/bpmn" exporter="bpmn-js (https://demo.bpmn.io)" exporterVersion="7.3.0">
    //   <process id="Process_1" isExecutable="false" />
    //   <bpmndi:BPMNDiagram id="BpmnDiagram_1">
    //     <bpmndi:BPMNPlane id="BpmnPlane_1" bpmnElement="Process_1" />
    //   </bpmndi:BPMNDiagram>
    // </definitions>
    // `;

    const XML = `<?xml version="1.0" encoding="UTF-8"?>
    <bpmn2:definitions xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:bpmn2="http://www.omg.org/spec/BPMN/20100524/MODEL" xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI" xmlns:dc="http://www.omg.org/spec/DD/20100524/DC" id="Definitions_1" targetNamespace="http://bpmn.io/schema/bpmn" exporter="Camunda Modeler" exporterVersion="4.1.0" xsi:schemaLocation="http://www.omg.org/spec/BPMN/20100524/MODEL BPMN20.xsd">
      <bpmn2:process id="Process_1" isExecutable="false">
        <bpmn2:startEvent id="StartEvent_1" name="StartEvent_1" />
      </bpmn2:process>
      <bpmndi:BPMNDiagram id="BPMNDiagram_1">
        <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="Process_1">
          <bpmndi:BPMNShape id="_BPMNShape_StartEvent_2" bpmnElement="StartEvent_1">
            <dc:Bounds x="182" y="82" width="36" height="36" />
            <bpmndi:BPMNLabel>
              <dc:Bounds x="168" y="125" width="64" height="14" />
            </bpmndi:BPMNLabel>
          </bpmndi:BPMNShape>
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
    this.createShapeListener = emitter.on('createShape', (message) => {
      console.log(message);
      // const bpmnFactory = this.bpmnModeler.get('bpmnFactory'),
      //   elementFactory = this.bpmnModeler.get('elementFactory'),
      //   elementRegistry = this.bpmnModeler.get('elementRegistry'),
      // modeling = this.bpmnModeler.get('modeling');

      // const serviceTask = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
      // modeling.appendShape(serviceTask, { x: 400, y: 100 });

      const modeler = this.bpmnModeler;
      // (1) Get the modules
      const bpmnFactory = modeler.get('bpmnFactory');


      const elementFactory = modeler.get('elementFactory');


      const elementRegistry = modeler.get('elementRegistry');


      const modeling = modeler.get('modeling');

      // (2) Get the existing process and the start event
      const process = elementRegistry.get('Process_1');


      const startEvent = elementRegistry.get('StartEvent_1');

      // (3) Create a service task shape
      const serviceTask = elementFactory.createShape({ type: 'bpmn:ServiceTask' });
      modeling.updateProperties(serviceTask, { name: message });

      // (4) Add the new service task shape to the diagram using `appendShape` to connect it to an existing
      // shape
      modeling.appendShape(startEvent, serviceTask, { x: 400, y: 100 }, process);
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
