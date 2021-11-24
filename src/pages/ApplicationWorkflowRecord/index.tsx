import React, { Component } from 'react';
import _ from 'lodash';
import { If } from 'tsx-control-statements/components';
import { Button } from '@b-design/ui';
import { connect } from 'dva';
import WrokflowComponent from './workflow-component';
import { WorkFlowData } from './entity';
import { getWorkFlowDefinitions } from '../../api/workflows';
import {
  ApplicationDetail,
} from '../../interface/application';

import './index.less';

type Props = {
  workflowList: Array<WorkFlowData>;
  dispatch: ({ }) => {};
  match: {
    params: {
      appName: string;
    };
  };
  history: {
    push: (path: string, state: {}) => {};
  };
  applicationDetail?: ApplicationDetail;

};

type State = {
  appName: string;
  workFlowDefinitions: [];
  isWorkflowRecord:boolean;
};

@connect((store: any) => {
  return { ...store.workflowRecord };
})
class Workflow extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    const { params } = this.props.match;
    this.state = {
      appName: params.appName || '',
      workFlowDefinitions: [],
      isWorkflowRecord:false,
    };
  }

  componentDidMount() {
    this.loadworkflowRecord();
    // console.log('componentDidMount',this.state.isWorkflowRecord)
    // this.setState({isWorkflowRecord:true})
  }

  // componentWillReceiveProps(nextProps:any){
    
  // }

  // componentWillUnmount() {
  //   console.log('componentWillUnmount',this.state.isWorkflowRecord)
  //   this.setState({isWorkflowRecord:false},()=>{
  //     console.log('componentWillUnmountcallback',this.state.isWorkflowRecord)
  //   })
  // }

  onGetWorkflow = () => {
    this.props.dispatch({
      type: 'workflowRecord/getWrokflowList',
      payload: {
        appName: this.state.appName,
      },
    });
  };

  onGetWorkFlowdefinitions = async () => {
    getWorkFlowDefinitions().then((res: any) => {
      if (res) {
        this.setState({
          workFlowDefinitions: res && res.definitions,
        });
      }
    });
  };

  loadworkflowRecord = async () => {
    const { applicationDetail } = this.props;
    if (applicationDetail && applicationDetail.name) {
      this.props.dispatch({
        type: 'workflowRecord/getWrokflowRecord',
        payload: {
          appName: this.state.appName,
        },
      });

    }
  };

  addWrokflow = () => { };

  render() {
    const { workflowList, dispatch } = this.props;
    return (
      <div style={{ height: '100%' }} className="workflow-wraper">
        <If condition={workflowList.length > 0}>
          <React.Fragment>
            {workflowList.map((workflow: WorkFlowData) => (
              <WrokflowComponent
                key={workflow.name}
                appName={this.state.appName}
                data={workflow}
                workFlowDefinitions={this.state.workFlowDefinitions}
                getWorkflow={this.onGetWorkflow}
                isWorkflowRecord={this.state.isWorkflowRecord || false}
                dispatch={dispatch}
              />
            ))}
          </React.Fragment>
        </If>
      </div>
    );
  }
}

export default Workflow;
