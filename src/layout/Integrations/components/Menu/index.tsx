import React, { Component } from 'react';
import { Icon, Grid } from '@b-design/ui';
import helmImg from '../../../../assets/helm.png';
import dockerImg from '../../../../assets/docker.png';
import gitImg from '../../../../assets/git.png';
import ssoImg from '../../../../assets/sso.png';
import terraformImg from '../../../../assets/terraform.png';
import './index.less';

type Props = {
  activeId: string;
  history: {
    push: (path: string, state?: {}) => {};
  };
};
type State = {};
class Menu extends Component<Props, State> {
  handleClick = (link: string) => {
    this.props.history.push(link);
  };
  getMenuItem = () => {
    const { Row, Col } = Grid;
    const { activeId } = this.props;
    const data = [
      {
        id: 'helm',
        img: helmImg,
        link: '/integrations/helm',
        description: 'Helm Registries',
        iconType: 'arrow-right',
      },
      {
        id: 'docker',
        img: dockerImg,
        link: '/integrations/docker',
        description: 'Docker Registries',
        iconType: 'arrow-right',
      },
      {
        id: 'terraform',
        img: terraformImg,
        link: '/integrations/terraform',
        description: 'Terraform Providers',
        iconType: 'arrow-right',
      },
      {
        id: 'sso',
        img: ssoImg,
        link: '/integrations/sso',
        description: 'SSO Providers',
        iconType: 'arrow-right',
      },
      {
        id: 'git',
        img: gitImg,
        link: '/integrations/git',
        description: 'Git Accounts',
        iconType: 'arrow-right',
      },
    ];

    const result = (data || []).map((item) => {
      const isActive = activeId === item.id ? 'active-menu-item' : '';
      return (
        <li key={item.id}>
          <Row
            className={`menu-item-wrapper ${isActive}`}
            onClick={() => {
              this.handleClick(item.link);
            }}
          >
            <Col span="8">
              <img src={item.img} className="menu-item-img" />
            </Col>
            <Col span="14">
              <div className="menu-item-description">{item.description}</div>
            </Col>
            <Col span="2">
              <div className="menu-item-icon">
                <Icon type={item.iconType} />
              </div>
            </Col>
          </Row>
        </li>
      );
    });
    return result;
  };

  render() {
    const menuItem = this.getMenuItem();
    return (
      <div className="menu-content">
        <ul>{menuItem}</ul>
      </div>
    );
  }
}

export default Menu;
