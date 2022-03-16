import React, { Component } from 'react';
import List from './components/List';

type Props = {
  activeId: string;
};
class IntegrationDocker extends Component<Props> {
  render() {
    const { activeId } = this.props;
    return <List activeId={activeId} />;
  }
}

export default IntegrationDocker;
