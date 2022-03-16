import React from 'react';
import { Grid, Form, Input, Field, Button, Select } from '@b-design/ui';
import DrawerWithFooter from '../../../../components/Drawer';
import { checkName } from '../../../../utils/common';
import Translation from '../../../../components/Translation';
import { Link } from 'dva/router';
import locale from '../../../../utils/locale';
import UISchema from '../../../../components/UISchema';
import { transComponentDefinitions } from '../../../../utils/utils';
import { IntegrationBase } from '../../../../interface/integration';
import type { Rule } from '@alifd/field';
import type { DefinitionDetail } from '../../../../interface/application';
import { detailComponentDefinition } from '../../../../api/application';
import i18n from '../../../../i18n';

type Props = {
  visible: boolean;
  isEditIntegration: boolean;
  componentDefinitions: [];
  editIntegrationItem: IntegrationBase;
  onCreate: () => void;
  onClose: () => void;
};

type State = {
  loading: boolean;
  definitionDetail?: DefinitionDetail;
  definitionLoading: boolean;
};

class CreateIntegration extends React.Component<Props, State> {
  field: Field;
  uiSchemaRef: React.RefObject<UISchema>;
  constructor(props: Props) {
    super(props);
    this.field = new Field(this);
    this.state = {
      loading: false,
      definitionLoading: true,
    };
    this.uiSchemaRef = React.createRef();
  }

  componentDidMount() {
    const { isEditIntegration, editIntegrationItem } = this.props;
    if (isEditIntegration && editIntegrationItem) {
      const { name, alias, project, description, type } = editIntegrationItem;
      this.field.setValues({
        name,
        alias,
        project,
        description,
      });
      if (type) {
        this.onDetailsComponentDefinition(type);
      }
    } else {
      const getInitComponentType: string = this.field.getValue('componentType') || '';
      this.onDetailsComponentDefinition(getInitComponentType);
    }
  }

  onDetailsComponentDefinition = (value: string, callback?: () => void) => {
    detailComponentDefinition({ name: value })
      .then((re) => {
        if (re) {
          this.setState({ definitionDetail: re });
          if (callback) {
            callback();
          }
        }
      })
      .catch();
  };

  onClose = () => {
    this.props.onClose();
  };
  //Todo
  onCreate = () => {
    this.props.onCreate();
  };

  getTitle = () => {
    const { isEditIntegration } = this.props;
    if (isEditIntegration) {
      return <Translation>Edit Helm Registries</Translation>;
    } else {
      return <Translation>New Helm Registries</Translation>;
    }
  };

  render() {
    const init = this.field.init;
    const { Row, Col } = Grid;
    const FormItem = Form.Item;
    const formItemLayout = {
      labelCol: {
        fixedSpan: 6,
      },
      wrapperCol: {
        span: 20,
      },
    };
    const { loading, definitionDetail } = this.state;
    const buttons = [
      <Button type="secondary" onClick={this.onClose} style={{ marginRight: '16px' }}>
        <Translation>Cancel</Translation>
      </Button>,
      <Button type="primary" onClick={this.onCreate} loading={loading}>
        <Translation>Create</Translation>
      </Button>,
    ];

    const projectList = [
      {
        label: 'project1',
        value: 'project1',
      },
      {
        label: 'project2',
        value: 'project2',
      },
    ];

    const validator = (rule: Rule, value: any, callback: (error?: string) => void) => {
      this.uiSchemaRef.current?.validate(callback);
    };

    const { isEditIntegration, componentDefinitions } = this.props;

    return (
      <React.Fragment>
        <DrawerWithFooter
          title={this.getTitle()}
          placement="right"
          width={800}
          onClose={this.onClose}
          extButtons={buttons}
        >
          <Form {...formItemLayout} field={this.field}>
            <Row>
              <Col span={12} style={{ padding: '0 8px' }}>
                <FormItem
                  label={<Translation>Name</Translation>}
                  labelTextAlign="left"
                  required={true}
                >
                  <Input
                    name="name"
                    placeholder={i18n.t('Please enter').toString()}
                    maxLength={32}
                    {...init('name', {
                      rules: [
                        {
                          required: false,
                          pattern: checkName,
                          message: <Translation>Please enter a valid name</Translation>,
                        },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
              <Col span={12} style={{ padding: '0 8px' }}>
                <FormItem label={<Translation>Alias</Translation>}>
                  <Input
                    name="alias"
                    placeholder={i18n.t('Please enter').toString()}
                    {...init('alias', {
                      rules: [
                        {
                          minLength: 2,
                          maxLength: 64,
                          message: 'Enter a string of 2 to 64 characters.',
                        },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={12} style={{ padding: '0 8px' }}>
                <FormItem label={<Translation>Project</Translation>}>
                  <Select
                    locale={locale.Select}
                    mode="single"
                    size="large"
                    placeholder={i18n.t('Please enter').toString()}
                    dataSource={projectList}
                    className="project-item"
                    {...init('project', {
                      rules: [
                        {
                          required: false,
                          message: <Translation>Please enter a valid user password</Translation>,
                        },
                      ],
                    })}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24} style={{ padding: '0 8px' }}>
                <FormItem label={<Translation>Description</Translation>}>
                  <Input
                    name="description"
                    placeholder={i18n.t('Please enter').toString()}
                    {...init('description')}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <FormItem
                  label={
                    <Translation className="font-size-14 font-weight-bold color333">
                      Type
                    </Translation>
                  }
                  required={true}
                  help={
                    <span>
                      <Translation>Get more component type?</Translation>
                      <Link to="/addons">
                        <Translation>Go to enable addon</Translation>
                      </Link>
                    </span>
                  }
                >
                  <Select
                    locale={locale.Select}
                    showSearch
                    disabled={isEditIntegration ? true : false}
                    className="select"
                    {...init(`componentType`, {
                      initValue: 'webservice',
                      rules: [
                        {
                          required: true,
                          message: i18n.t('Please select'),
                        },
                      ],
                    })}
                    dataSource={transComponentDefinitions(componentDefinitions)}
                    onChange={(item: string) => {
                      this.onDetailsComponentDefinition(item, () => {
                        this.field.setValue('componentType', item);
                      });
                    }}
                  />
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span="24">
                <FormItem required={true}>
                  <UISchema
                    {...init(`properties`, {
                      rules: [
                        {
                          validator: validator,
                          message: 'Please check app deploy properties',
                        },
                      ],
                    })}
                    uiSchema={definitionDetail && definitionDetail.uiSchema}
                    ref={this.uiSchemaRef}
                    mode="new"
                  />
                </FormItem>
              </Col>
            </Row>
          </Form>
        </DrawerWithFooter>
      </React.Fragment>
    );
  }
}

export default CreateIntegration;
