import React, { Component } from 'react';
import { DiagramMakerComponents } from 'diagram-maker';
import './index.less';
import { If } from 'tsx-control-statements/components';
import { Button, Dialog } from '@alifd/next';
import { Balloon } from '@b-design/ui';
import { resumeApplicationWorkflowRecord, rollbackApplicationWorkflowRecord, terminateApplicationWorkflowRecord } from '../../../api/application';
import './index.less';

type Props = {
  id: string;
  typeId?: string;
  workflowId: string;
  selected?: boolean;
  data?: any;
  workflowName: string;
  isWorkflowRecord: boolean;
  updateChange: (isWorkflowRecord: boolean) => void;
};

type State = {
  isWorkflowRecord: boolean
};

class WorkFlowNode extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    console.log('constructor')
    this.state = {
      isWorkflowRecord: false,
    };
  }

  componentDidMount() {
    const ele = document.querySelectorAll('.next-overlay-wrapper') || [];
    ele.forEach((item:any)=> {
      item.style.display = 'none'
    })
    this.setState({
      isWorkflowRecord: false
    },()=>{
      this.setState({
        isWorkflowRecord:true
      })
    })

  }

  onResumeApplicationWorkflowRecord = () => {
    const { data = {}, workflowId, workflowName } = this.props;
    const params = {
      appName: workflowId,
      workflowName: workflowName,
      record: data
    }
    // this.setState({
    //   isWorkflowRecord:false
    // })

    resumeApplicationWorkflowRecord(params).then((re) => {
      if (re) {
        this.setState({
          isWorkflowRecord: false
        })
      }
    });
  }

  onRollbackApplicationWorkflowRecord = () => {
    const { data = {}, workflowId, workflowName } = this.props;
    const params = {
      appName: workflowId,
      workflowName: workflowName,
      record: data
    }
    rollbackApplicationWorkflowRecord(params).then((re) => {
      if (re) {
        this.setState({
          isWorkflowRecord: false
        })
      }
    });

  }

  onTerminateApplicationWorkflowRecord = () => {
    const { data = {}, workflowId, workflowName } = this.props;
    const params = {
      appName: workflowId,
      workflowName: workflowName,
      record: data
    }
    terminateApplicationWorkflowRecord(params).then((re) => {
      if (re) {
        this.setState({
          isWorkflowRecord: false
        })
      }
    });

  }

  renderNormal() {
    const { data = {}, selected, id, workflowId, typeId } = this.props;
    const status = [
      { name: 'succeeded', value: 'success' },
      { name: 'failed', value: 'red' },
      { name: 'stopped', value: '#ccc' },
      { name: 'running', value: 'blue' }
    ]
    const find = status.find(item => item.name === data.phase);
    return (
      <div
        className={selected ? `workflow-node-container active ${find?.value} shanshan` : `workflow-node-container ${find?.value} shanshan`}
        id={id}
        workflow-id={workflowId}
      >
        {data.alias || data.name || '点击编辑'}
        <div
          data-event-target="true"
          data-dropzone="true"
          data-type={DiagramMakerComponents.NODE_CONNECTOR}
          data-id={id}
        />
        <div
          data-event-target="true"
          data-draggable="true"
          data-type={DiagramMakerComponents.NODE_CONNECTOR}
          data-id={id}
        />
      </div>
    )
  }

  onClose = () => {
    this.setState({
      isWorkflowRecord: false
    })
  }

  renderUi() {
    const { data = {} } = this.props;
    const { isWorkflowRecord } = this.state;
    console.log('render iio')
    data.suspend = 'suspend';
    console.log('Balloon', isWorkflowRecord)
    console.log('data', data)
    const visible = this.props.data.phase === 'running' ? true:false;
    console.log('visible',visible)

    const getStyle = isWorkflowRecord === false ? 'none' : 'block';
    if (visible) {
      return (
        <Balloon
          // style={{ 'display': `${getStyle}` }}
          popupStyle={{ background: '#fff', color: '#000' }}
          visible={visible && isWorkflowRecord}
          cache={true}
          trigger={<div>{this.renderNormal()}</div>}
          closable={false}
          align="b"
        >
          <div>
            <h3>需求您的审核后继续执行</h3>
            <hr />
            <h4>您希望继续执行还是进行回滚?</h4>
            <Button className='margin-left-10' onClick={this.onRollbackApplicationWorkflowRecord}>回滚</Button>
            <Button className='margin-left-10' onClick={this.onResumeApplicationWorkflowRecord}>继续</Button>
            <Button className='margin-left-10' onClick={this.onTerminateApplicationWorkflowRecord}>终止</Button>
          </div>
        </Balloon>
      )
    } else {
      return this.renderNormal();
    }
  }

  render() {
    const { data = {}, selected, id, workflowId, typeId } = this.props;
    let success = data.phase === "succeeded" ? 'success' : 'fail';
    console.log('work lofwdata', this.props)

    // const dd = (
    //   <div
    //     className={selected ? `workflow-node-container active ${success}` : `workflow-node-container ${success}`}
    //     id={id}
    //     workflow-id={workflowId}
    //   >
    //     {data.alias || data.name || '点击编辑'}
    //     <div
    //       data-event-target="true"
    //       data-dropzone="true"
    //       data-type={DiagramMakerComponents.NODE_CONNECTOR}
    //       data-id={id}
    //     />
    //     <div
    //       data-event-target="true"
    //       data-draggable="true"
    //       data-type={DiagramMakerComponents.NODE_CONNECTOR}
    //       data-id={id}
    //     />
    //   </div>
    // )
    return (
      <React.Fragment>
        <If condition={typeId !== 'switch'}>
          {
            this.renderUi()
          }

          {/* <Balloon visible={true} trigger={<div>{dd}</div>} closable={false} align="b">
            <div>
              <h3>需求您的审核后继续执行</h3>
              <hr />
              <h4>您希望继续执行还是进行回滚?</h4>
              <Button onClick={this.onRollbackApplicationWorkflowRecord}>回滚</Button>
              <Button onClick={this.onResumeApplicationWorkflowRecord}>继续</Button>
              <Button onClick={this.onTerminateApplicationWorkflowRecord}>终止</Button>
            </div>
          </Balloon> */}


        </If>
        <If condition={typeId === 'switch'}>
          <div
            className={
              selected
                ? 'workflow-node-container workflow-switch-node-container active'
                : 'workflow-node-container workflow-switch-node-container'
            }
            id={id}
            workflow-id={workflowId}
          >
            <div className="rhombus-container" />
            <div className="content shanshan"> {data.text || '点击编辑'}</div>
            <div
              className="start-connector"
              data-event-target="true"
              data-dropzone="true"
              data-type={DiagramMakerComponents.NODE_CONNECTOR}
              data-id={id}
            />
            <div
              className="end-connector"
              data-event-target="true"
              data-draggable="true"
              data-type={DiagramMakerComponents.NODE_CONNECTOR}
              data-id={id}
            />
          </div>
        </If>
      </React.Fragment>
    );
  }
}

export default WorkFlowNode;
