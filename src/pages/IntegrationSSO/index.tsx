import React, { Component } from 'react';
import List from './components/List';

type Props = {
  activeId: string;
};
class IntegrationSSO extends Component<Props> {
  render() {
    const { activeId } = this.props;
    return <List activeId={activeId} />;
  }
}

export default IntegrationSSO;
