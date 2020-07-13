import React, { PureComponent } from 'react';
import { defineMessages, injectIntl, intlShape } from 'react-intl';
import cx from 'classnames';

class Tag extends PureComponent {
  constructor(props) {
    super(props);

    var { id, label, description } = props;
    if (!id) throw "Must give tag id!";
    label = label || 'no label';
    description = description || 'no description';

    this.state = {
      id, label, description
    };
  }

  // kialan: todo: apply css
  render() {
    return (
      <div classname={this.state.id}>
        {this.state.label}
      </div>
    );
  }
}

export default Tag;
