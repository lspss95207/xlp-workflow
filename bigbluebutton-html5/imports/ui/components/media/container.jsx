import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import Settings from '/imports/ui/services/settings';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import PropTypes from 'prop-types';
import { Session } from 'meteor/session';
import { notify } from '/imports/ui/services/notification';
import VideoService from '/imports/ui/components/video-provider/service';
import getFromUserSettings from '/imports/ui/services/users-settings';
import { withModalMounter } from '/imports/ui/components/modal/service';
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import Media from './component';
import MediaService, { getSwapLayout, shouldEnableSwapLayout } from './service';
import PresentationPodsContainer from '../presentation-pod/container';
import ScreenshareContainer from '../screenshare/container';
import DefaultContent from '../presentation/default-content/component';
import ExternalVideoContainer from '../external-video-player/container';
import Storage from '../../services/storage/session';
import { withDraggableConsumer } from './webcam-draggable-overlay/context';


import { DiagramWrapperContainer } from '../diagram/container';
import { DiagramWrapper } from '../diagram/component';

import BpmnDiagram from '../bpmn/component';
import BpmnDiagramContainer from '../bpmn/container';


const LAYOUT_CONFIG = Meteor.settings.public.layout;
const KURENTO_CONFIG = Meteor.settings.public.kurento;

const propTypes = {
  isScreensharing: PropTypes.bool.isRequired,
  intl: intlShape.isRequired,
};

const intlMessages = defineMessages({
  screenshareStarted: {
    id: 'app.media.screenshare.start',
    description: 'toast to show when a screenshare has started',
  },
  screenshareEnded: {
    id: 'app.media.screenshare.end',
    description: 'toast to show when a screenshare has ended',
  },
  screenshareNotSupported: {
    id: 'app.media.screenshare.notSupported',
    description: 'Error message for screenshare not supported',
  },
  chromeExtensionError: {
    id: 'app.video.chromeExtensionError',
    description: 'Error message for Chrome Extension not installed',
  },
  chromeExtensionErrorLink: {
    id: 'app.video.chromeExtensionErrorLink',
    description: 'Error message for Chrome Extension not installed',
  },
});

class MediaContainer extends Component {
  componentWillMount() {
    document.addEventListener('installChromeExtension', this.installChromeExtension.bind(this));
    document.addEventListener('screenshareNotSupported', this.screenshareNotSupported.bind(this));
  }

  componentWillReceiveProps(nextProps) {
    const {
      isScreensharing,
      intl,
    } = this.props;

    if (isScreensharing !== nextProps.isScreensharing) {
      if (nextProps.isScreensharing) {
        notify(intl.formatMessage(intlMessages.screenshareStarted), 'info', 'desktop');
      } else {
        notify(intl.formatMessage(intlMessages.screenshareEnded), 'info', 'desktop');
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('installChromeExtension', this.installChromeExtension.bind(this));
    document.removeEventListener('screenshareNotSupported', this.screenshareNotSupported.bind(this));
  }

  installChromeExtension() {
    const { intl } = this.props;

    const CHROME_DEFAULT_EXTENSION_LINK = KURENTO_CONFIG.chromeDefaultExtensionLink;
    const CHROME_CUSTOM_EXTENSION_LINK = KURENTO_CONFIG.chromeExtensionLink;
    const CHROME_EXTENSION_LINK = CHROME_CUSTOM_EXTENSION_LINK === 'LINK' ? CHROME_DEFAULT_EXTENSION_LINK : CHROME_CUSTOM_EXTENSION_LINK;

    const chromeErrorElement = (
      <div>
        {intl.formatMessage(intlMessages.chromeExtensionError)}
        {' '}
        <a href={CHROME_EXTENSION_LINK} target="_blank" rel="noopener noreferrer">
          {intl.formatMessage(intlMessages.chromeExtensionErrorLink)}
        </a>
      </div>
    );
    notify(chromeErrorElement, 'error', 'desktop');
  }

  screenshareNotSupported() {
    const { intl } = this.props;
    notify(intl.formatMessage(intlMessages.screenshareNotSupported), 'error', 'desktop');
  }

  render() {
    return <Media {...this.props} />;
  }
}

export default withDraggableConsumer(withModalMounter(withTracker(() => {
  const { dataSaving } = Settings;
  const { viewParticipantsWebcams, viewScreenshare } = dataSaving;
  const hidePresentation = getFromUserSettings('bbb_hide_presentation', LAYOUT_CONFIG.hidePresentation);
  const { current_presentation: hasPresentation } = MediaService.getPresentationInfo();
  const data = {
    children: <DefaultContent />,
    audioModalIsOpen: Session.get('audioModalIsOpen'),
  };

  if (MediaService.shouldShowWhiteboard() && !hidePresentation) {
    data.currentPresentation = MediaService.getPresentationInfo();
    data.children = <PresentationPodsContainer />;
  }

  if (MediaService.shouldShowScreenshare() && (viewScreenshare || MediaService.isUserPresenter())) {
    data.children = <ScreenshareContainer />;
  }

  const usersVideo = VideoService.getVideoStreams();
  data.usersVideo = usersVideo;

  if (MediaService.shouldShowOverlay() && usersVideo.length && viewParticipantsWebcams) {
    data.floatingOverlay = usersVideo.length < 2;
    data.hideOverlay = usersVideo.length === 0;
  }

  data.singleWebcam = (usersVideo.length < 2);

  data.isScreensharing = MediaService.isVideoBroadcasting();
  data.swapLayout = (getSwapLayout() || !hasPresentation) && shouldEnableSwapLayout();
  data.disableVideo = !viewParticipantsWebcams;

  if (data.swapLayout) {
    data.floatingOverlay = true;
    data.hideOverlay = true;
  }

  if (MediaService.shouldShowExternalVideo()) {
    data.children = (
      <ExternalVideoContainer
        isPresenter={MediaService.isUserPresenter()}
      />
    );
  }

  // --------gojs test---------

  // data.children = <DiagramWrapper />;

  // data.children = <DiagramWrapperContainer />;

  //--------------------------


  // -------BPMN.io test-------

  data.children = (
    <BpmnDiagramContainer
      url="http://lspss95207.duckdns.org/bpmn.bpmn"
      onLoading={null}
      onShown={null}
      onError={null}
    />
  );

  // data.children = <DiagramWrapperContainer />;

  //--------------------------

  data.webcamPlacement = Storage.getItem('webcamPlacement');

  MediaContainer.propTypes = propTypes;
  return data;
})(injectIntl(MediaContainer))));
