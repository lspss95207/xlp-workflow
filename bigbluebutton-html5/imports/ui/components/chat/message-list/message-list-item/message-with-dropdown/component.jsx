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

import logger from '/imports/startup/client/logger';
import emitter from '/imports/ui/components/tag/events';
import Tag from '/imports/ui/components/tag/component';

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
        data-test="addReply"
        label="回复"
        key={this.actionsKey[0]}
        onClick={() => {
          const {
            messageId, rowIndex, text, tags,
          } = this.props;
          const id = `msg#${messageId}#${String(rowIndex)}`;
          const label = text.length > 13 ? `${text.slice(0, 10)}...` : text;
          const description = 'Reply';
          const type = 'reply';
          emitter.emit('insertTag', {
            id, label, description, type,
          });
          tags.map((x) => {
            const { type } = x;
            if (type !== 'reply') {
              emitter.emit('insertTag', x);
            }
          });
        }}
      />,
      <DropdownListItem
        data-test="addSubtopic"
        label="添加子话题"
        key={this.actionsKey[1]}
        onClick={() => {
          const {
            messageId, rowIndex, text, tags,
          } = this.props;
          const id = `msg#${messageId}#${String(rowIndex)}`;
          const label = text.length > 13 ? `${text.slice(0, 10)}...` : text;
          const description = 'Subtopic';
          const type = 'topic';
          emitter.emit('insertTag', {
            id, label, description, type,
          });
          tags.map((x) => {
            const { type } = x;
            if (type !== 'reply') {
              emitter.emit('insertTag', x);
            }
          });
        }}
      />,
      <DropdownListItem
        data-test="addMindmap"
        label="添加至心智圖"
        key={this.actionsKey[2]}
        onClick={() => {
          const {
            messageId, rowIndex, text, tags,
          } = this.props;
          // const id = 'msg#' + messageId + '#' + String(rowIndex);
          // const label = text.length > 13 ? text.slice(0, 10) + '...' : text;
          // const description = 'Subtopic';
          // const type = 'topic';
          // emitter.emit('insertTag', { id, label, description, type });
          // tags.map(x => {
          //   const { type } = x;
          //   if (type !== 'reply') {~
          //     emitter.emit('insertTag', x);
          //   }
          // });
          emitter.emit('createShape', text);
        }}
      />,
    ]);
  }

  render() {
    const { isMenuOpen } = this.state;
    const availableActions = this.getAvailableActions();

    const messageProps = this.props;

    return (
      <Dropdown
        isOpen={isMenuOpen}
        onShow={this.onActionsShow}
        onHide={this.onActionsHide}
      >
        <DropdownTrigger tabIndex={0}>
          <div style={{ border: isMenuOpen ? '1px solid pink' : 'none' }} key={isMenuOpen}>
            <Message {...messageProps} />
            {messageProps.tags.map(x => (<Tag {...x} removable={false} key={x.id} />))}
          </div>
        </DropdownTrigger>
        <DropdownContent placement="bottom right">
          <DropdownList>{availableActions}</DropdownList>
        </DropdownContent>
      </Dropdown>
    );
  }
}

export default withModalMounter(injectIntl(MessageWithDropdown));
