import React, { PureComponent } from 'react';
import { styles } from './styles.scss';
import emitter from '/imports/utils/events';

class Tag extends PureComponent {
  constructor(props) {
    super(props);

    var { id, label, description, type } = props;
    if (!id) throw "Must give tag id!";
    if (-1 === ['reply', 'topic', 'hashtag', null].findIndex(x => (x === type))) throw "Wrong tag type!";

  }

  render() {
    const {
      id, label, description, removable, type
    } = this.props;
    return (
      <span className={styles.inlineTag}>
        {label}
        {removable ?
          (<button
            className={styles.tagRemoveButton}
            onClick={(e) => {
              e.preventDefault();
              emitter.emit('removeTag', this.props);
            }}
          >
            {"\u00d7"}
          </button>)
          : null
        }
      </span >
    );
  }
}

export default Tag;
