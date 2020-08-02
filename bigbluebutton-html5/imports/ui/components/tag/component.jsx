import React, { PureComponent } from 'react';
import { styles } from './styles.scss';
import emitter from '/imports/ui/components/tag/events';;

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

  render() {
    const {
      removable,
    } = this.props;
    return (
      <span className={styles.inlineTag}>
        {this.state.label}
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
