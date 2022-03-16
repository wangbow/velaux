import React, { Component } from 'react';
import { Grid } from '@b-design/ui';
import Title from '../../components/ListTitle';
import Menu from './components/Menu';
import './index.less';

type Props = {
  history: {
    push: (path: string, state?: {}) => {};
  };
  activeId: string;
};

type State = {};

class IntegrationsLayout extends Component<Props, State> {
  render() {
    const { Row, Col } = Grid;
    const { history, activeId } = this.props;
    return (
      <div className="integrations-wrapper">
        <Title
          title={'Integrations'}
          subTitle={'Integration with external systems and configuration management.'}
        />
        <Row>
          <Col span="7">
            <Menu activeId={activeId} history={history} />
          </Col>
          <Col span="17">{this.props.children}</Col>
        </Row>
      </div>
    );
  }
}

export default IntegrationsLayout;
