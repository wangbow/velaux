import React, { Component, Fragment } from 'react';
import { getIntegrations } from '../../../../api/integration';
import { IntegrationBase } from '../../../../interface/integration';
import { getComponentDefinitions } from '../../../../api/application';
import { Table, Button, Pagination } from '@b-design/ui';
import Translation from '../../../../components/Translation';
import locale from '../../../../utils/locale';
import CreateIntegration from '../CreateIntegrationDialog';
import { If } from 'tsx-control-statements/components';
import './index.less';

type Props = {
  activeId: string;
};

type State = {
  activeId: string;
  list: IntegrationBase[];
  total: number;
  page: number;
  pageSize: number;
  visible: boolean;
  isEditIntegration: boolean;
  editIntegrationItem: IntegrationBase;
  isLoading: boolean;
  componentDefinitions: [];
};

class List extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      list: [],
      total: 0,
      activeId: props.activeId || '',
      page: 0,
      pageSize: 10,
      visible: false,
      isEditIntegration: false,
      editIntegrationItem: { name: '', project: '', createTime: '', updateTime: '', type: '' },
      isLoading: false,
      componentDefinitions: [],
    };
  }
  componentDidMount() {
    this.listIntegrations();
    this.onGetComponentDefinitions();
  }

  listIntegrations() {
    const { activeId } = this.state;
    if (!activeId) {
      return;
    }
    this.setState({ isLoading: true });
    getIntegrations({ activeId })
      .then((res) => {
        const { data } = res;
        this.setState({
          list: data.list,
          total: data.total,
        });
      })
      .catch(() => {})
      .finally(() => {
        this.setState({ isLoading: false });
      });
  }

  onGetComponentDefinitions = async () => {
    getComponentDefinitions().then((res) => {
      if (res) {
        this.setState({
          componentDefinitions: res && res.definitions,
        });
      }
    });
  };

  onEdit = (record: IntegrationBase) => {
    this.setState({
      visible: true,
      isEditIntegration: true,
      editIntegrationItem: record,
    });
  };
  //Todo
  onDelete = () => {};
  //Todo
  onCreate = () => {
    this.setState({ visible: false });
  };

  onClose = () => {
    this.setState({ visible: false });
  };

  handleClickCreate = () => {
    this.setState({
      visible: true,
      isEditIntegration: false,
    });
  };

  handleChange = (page: number) => {
    this.setState(
      {
        page,
        pageSize: 10,
      },
      () => {
        this.listIntegrations();
      },
    );
  };

  render() {
    const columns = [
      {
        key: 'name',
        title: <Translation>Name</Translation>,
        dataIndex: 'name',
        cell: (v: string) => {
          return <span>{v}</span>;
        },
      },
      {
        key: 'project',
        title: <Translation>Project</Translation>,
        dataIndex: 'project',
        cell: (v: string) => {
          return <span>{v}</span>;
        },
      },
      {
        key: 'createTime',
        title: <Translation>Create Time</Translation>,
        dataIndex: 'createTime',
        cell: (v: string) => {
          return <span>{v}</span>;
        },
      },
      {
        key: 'updateTime',
        title: <Translation>Update Time</Translation>,
        dataIndex: 'updateTime',
        cell: (v: string) => {
          return <span>{v}</span>;
        },
      },
      {
        key: 'operation',
        title: <Translation>Actions</Translation>,
        dataIndex: 'operation',
        cell: (v: string, i: number, record: IntegrationBase) => {
          return (
            <Fragment>
              <Button
                text
                size={'medium'}
                ghost={true}
                component={'a'}
                onClick={() => {
                  this.onEdit(record);
                }}
              >
                <Translation>Edit</Translation>
              </Button>

              <Button
                text
                size={'medium'}
                ghost={true}
                component={'a'}
                onClick={() => {
                  this.onDelete();
                }}
              >
                <Translation>Delete</Translation>
              </Button>
            </Fragment>
          );
        },
      },
    ];

    const { Column } = Table;
    const {
      list,
      visible,
      isEditIntegration,
      editIntegrationItem,
      total,
      pageSize,
      page,
      isLoading,
      componentDefinitions,
    } = this.state;

    return (
      <div className="list-content">
        <div className="create-btn">
          <Button type="primary" onClick={this.handleClickCreate}>
            <Translation>New</Translation>
          </Button>
        </div>
        <Table locale={locale.Table} dataSource={list} hasBorder={false} loading={isLoading}>
          {columns && columns.map((col, key) => <Column {...col} key={key} align={'left'} />)}
        </Table>

        <Pagination
          className="margin-top-20 text-align-right"
          total={total}
          locale={locale.Pagination}
          size="medium"
          pageSize={pageSize}
          current={page}
          onChange={this.handleChange}
        />

        <If condition={visible}>
          <CreateIntegration
            visible={visible}
            componentDefinitions={componentDefinitions}
            isEditIntegration={isEditIntegration}
            editIntegrationItem={editIntegrationItem}
            onCreate={this.onCreate}
            onClose={this.onClose}
          />
        </If>
      </div>
    );
  }
}

export default List;
