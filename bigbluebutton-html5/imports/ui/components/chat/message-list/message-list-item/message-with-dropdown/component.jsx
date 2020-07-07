import React, { PureComponent } from 'react';
import { defineMessages, injectIntl } from 'react-intl';
import { withModalMounter } from '/imports/ui/components/modal/service';
import _ from 'lodash';
import Dropdown from '/imports/ui/components/dropdown/component';
import DropdownTrigger from '/imports/ui/components/dropdown/trigger/component';
import DropdownContent from '/imports/ui/components/dropdown/content/component';
import DropdownList from '/imports/ui/components/dropdown/list/component';
import DropdownListItem from '/imports/ui/components/dropdown/list/item/component';

import Message from '../message/component';

// import logger from '/imports/startup/client/logger';
// import {
//   List, AutoSizer, CellMeasurer, CellMeasurerCache,
// } from 'react-virtualized';

const intlMessages = defineMessages({
  save: {
    id: 'app.chat.dropdown.save',
    description: 'Clear button label',
  },
  copy: {
    id: 'app.chat.dropdown.copy',
    description: 'Copy button label',
  },
  options: {
    id: 'app.chat.dropdown.options',
    description: 'Chat Options',
  },
});

class MessageWithDropdown extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      isMenuOpen: false,
    };

    this.onActionsShow = this.onActionsShow.bind(this);
    this.onActionsHide = this.onActionsHide.bind(this);
    this.actionsKey = [
      _.uniqueId('action-item-'),
      _.uniqueId('action-item-'),
    ];
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  onActionsShow() {
    this.setState({
      isMenuOpen: true,
    });
  }

  onActionsHide() {
    this.setState({
      isMenuOpen: false,
    });
  }

  getAvailableActions() {
    const { intl } = this.props;

    const saveIcon = 'download';
    const copyIcon = 'copy';

    return _.compact([
      <DropdownListItem
        data-test="chatSave"
        icon={saveIcon}
        label={intl.formatMessage(intlMessages.save)}
        key={this.actionsKey[0]}
        onClick={() => { }}
      />,
      <DropdownListItem
        data-test="chatCopy"
        icon={copyIcon}
        label={intl.formatMessage(intlMessages.copy)}
        key={this.actionsKey[1]}
      />,
    ]);
  }

  render() {
    const { isMenuOpen } = this.state;
    const availableActions = this.getAvailableActions();

    const messageProps = isMenuOpen ? { ...this.props, text: '@' + this.props.text } : this.props;

    return (
      <Dropdown
        isOpen={isMenuOpen}
        onShow={this.onActionsShow}
        onHide={this.onActionsHide}
      >
        <DropdownTrigger tabIndex={0}>
          <div>
            <Message {...messageProps} />
          </div>
        </DropdownTrigger>
        <DropdownContent placement="bottom right">
          <DropdownList>{availableActions}</DropdownList>
        </DropdownContent>
      </Dropdown >
    );
  }
}

export default withModalMounter(injectIntl(MessageWithDropdown));;
