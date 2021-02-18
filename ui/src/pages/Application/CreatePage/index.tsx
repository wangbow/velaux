import React, { useState } from 'react';
import { StepsForm, ProFormText, ProFormSelect, ProFormCheckbox } from '@ant-design/pro-form';
import ProCard from '@ant-design/pro-card';
import { Button, Form as AntdForm, message } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { useModel } from 'umi';
import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { withTheme } from '@rjsf/core';
// @ts-ignore
import { Theme as AntDTheme } from '@rjsf/antd';
import 'antd/dist/antd.css';

const FormRender = withTheme(AntDTheme);

export type FormProps = {};

const CreateForm: React.FC<FormProps> = (props) => {
  const { listEnvironments, listCapabilities } = useModel('useEnvironments');

  const [capsState, setCapsState] = useState<API.CapabilityType[]>();

  const [chosenCaps, setChosenCaps] = useState<API.CapabilityType[]>([]);

  return (
    <PageContainer>
      <ProCard>
        <StepsForm<API.ApplicationType>
          onFinish={async (value) => {
            console.log('form total', value);
            // handleAdd
            message.success('提交成功');
          }}
          formProps={{
            validateMessages: {
              required: '此项为必填项',
            },
          }}
        >
          <StepsForm.StepForm<{
            name: string;
            desc: string;
            env: string;
          }>
            name="base"
            title="Basic info"
            onFinish={async (value) => {
              console.log('form 1', value);

              const caps = await listCapabilities(value.env);
              setCapsState(caps);
              return true;
            }}
          >
            <ProFormText
              width="md"
              name="name"
              label="Name"
              tooltip="最长为 24 位"
              placeholder="请输入名称"
            />
            <ProFormText width="md" name="desc" label="Description" placeholder="请输入名称" />
            <ProFormSelect
              width="md"
              name="env"
              label="Choose environment"
              request={async () => {
                const environments = await listEnvironments();
                let names: { value: string }[] = [];
                environments.forEach((val) => {
                  names.push({ value: val.name });
                });
                return names;
              }}
            />
          </StepsForm.StepForm>

          <StepsForm.StepForm<{
            capabilities: API.CapabilityType[];
          }>
            name="cap-options"
            title="Capabilities"
            onFinish={async (value) => {
              console.log('form 2', value);
            }}
          >
            <AntdForm.List name="capabilities">
              {(fields, { add, remove }) => (
                <>
                  {fields.map((field, index) => (
                    <ProCard key={field.key} split="vertical">
                      <ProCard>
                        <ProFormSelect
                          width="sm"
                          request={async () => {
                            let names: { value: string }[] = [];
                            capsState?.forEach((val) => {
                              names.push({ value: val.name });
                            });
                            return names;
                          }}
                          name="capabilities"
                          label="Choose capability"
                          fieldProps={{
                            onChange: (capName) => {
                              capsState?.forEach((cap) => {
                                if (cap.name === capName) {
                                  if (chosenCaps.length > index) {
                                    setChosenCaps(
                                      chosenCaps.map((val, i) => {
                                        if (i != index) {
                                          return val;
                                        } else {
                                          return cap;
                                        }
                                      }),
                                    );
                                  } else {
                                    setChosenCaps([...chosenCaps, cap]);
                                  }
                                }
                              });
                            },
                          }}
                        />
                        <MinusCircleOutlined
                          onClick={() => {
                            setChosenCaps(chosenCaps.filter((_, i) => i != index));
                            remove(field.name);
                          }}
                        />
                      </ProCard>
                      <ProCard>
                        {/* <div>{chosenCaps.length > index && chosenCaps[index]}</div> */}
                        <div>
                          {(() => {
                            if (chosenCaps.length > index) {
                              const cap = chosenCaps[index];
                              const schema = JSON.parse(cap.jsonschema);
                              return <FormRender schema={schema} />;
                            }
                            return 'Please select an option';
                          })()}
                        </div>
                      </ProCard>
                    </ProCard>
                  ))}
                  <AntdForm.Item>
                    <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                      Add capability
                    </Button>
                  </AntdForm.Item>
                </>
              )}
            </AntdForm.List>
          </StepsForm.StepForm>

          <StepsForm.StepForm name="release" title="Release strategy">
            <ProFormCheckbox.Group
              name="checkbox"
              label="部署单元"
              options={['部署单元1', '部署单元2', '部署单元3']}
            />
            <ProFormSelect
              label="部署分组策略"
              name="remark"
              rules={[
                {
                  required: true,
                },
              ]}
              initialValue="1"
              options={[
                {
                  value: '1',
                  label: '策略一',
                },
                { value: '2', label: '策略二' },
              ]}
            />
            <ProFormSelect
              label="Pod 调度策略"
              name="remark2"
              initialValue="2"
              options={[
                {
                  value: '1',
                  label: '策略一',
                },
                { value: '2', label: '策略二' },
              ]}
            />
          </StepsForm.StepForm>
        </StepsForm>
      </ProCard>
    </PageContainer>
  );
};

export default CreateForm;
