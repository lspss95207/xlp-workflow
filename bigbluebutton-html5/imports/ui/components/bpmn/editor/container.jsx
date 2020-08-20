import React from 'react';
import PropTypes from 'prop-types';
import { withTracker } from 'meteor/react-meteor-data';
import ErrorBoundary from '/imports/ui/components/error-boundary/component';
import FallbackPresentation from '/imports/ui/components/fallback-errors/fallback-presentation/component';
// import PresentationPodService from './service';
import BpmnDiagramEditor from './component';

// PresentationPods component will be the place to go once we have the presentation pods designs
// it should give each PresentationAreaContainer some space
// which it will fill with the uploaded presentation

export default BpmnDiagramViewerContainer = ({ ...props }) => (
  // <ErrorBoundary Fallback={FallbackPresentation}>
  <BpmnDiagramEditor {...props} />
  // </ErrorBoundary>
);

// const BpmnDiagramContainer = ({ DiagramWrapperPodIds, ...props }) => {
//   if (DiagramWrapperIds && DiagramWrapperIds.length > 0) {
//     return (
//       <ErrorBoundary Fallback={FallbackPresentation}>
//         <BpmnDiagram presentationPodIds={DiagramWrapperIds} {...props} />
//       </ErrorBoundary>
//     );
//   }

//   return null;
// };

// export default withTracker(() => ({
//   presentationPodIds: PresentationPodService.getPresentationPodIds()
// }))(PresentationPodsContainer);

// DiagramWrapperContainer.propTypes = {
//     DiagramWrapperPodIds: PropTypes.arrayOf(PropTypes.shape({
//     podId: PropTypes.string.isRequired,
//   })).isRequired,
// };
