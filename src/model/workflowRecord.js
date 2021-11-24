import _ from 'lodash';
import { listWorkFlow, createWorkFlow, updateWorkFlow } from '../api/workflows';
import { getApplicationWorkflowRecord } from '../api/application';


const WORKFLOW_TEMPLATE = {
  appName: '',
  name: '',
  alias: '',
  description: '',
  option: {
    enable: true,
    default: true,
    edit: true,
  },
  data: {
    nodes: {},
    edges: {},
  },
};
export default {
  namespace: 'workflowRecord',
  state: {
    workflowList: [],
    isWorkflowRecord:false
  },
  reducers: {
    updateWorkflow(state, { type, payload }) {
      const { workflowList,isWorkflowRecord } = payload;
      return {
        ...state,
        workflowList,
      };
    },
    updateDialogVisable(state, { type, payload }) {
      const { isWorkflowRecord } = payload;
      return {
        ...state,
        isWorkflowRecord
      };
    },
  },
  effects: {
    *getWrokflowRecord(action, { call, put }) {
      const result = yield call(getApplicationWorkflowRecord, action.payload);
      const dd  = {
        "records": [
         {
          "name": "prod-20211122095007137",
          "namespace": "default",
          "startTime": "2021-11-22T09:50:07.157081551Z",
          "status": "running",
          "steps": [
           {
            "id": "ximr7kou8w",
            "name": "helm-target",
            "type": "deploy2env",
            "phase": "running",
            "message": "wait healthy",
            "reason": "Wait",
            "firstExecuteTime": "2021-11-22T09:50:11Z",
            "lastExecuteTime": "2021-11-23T05:23:57Z"
           },
           {
            "id": "ximr7kou8w2",
            "name": "qaaaaaahelm-target",
            "type": "deploy2env",
            "phase": "runningww",
            "message": "wait healthy",
            "reason": "Wait",
            "firstExecuteTime": "2021-11-22T09:50:11Z",
            "lastExecuteTime": "2021-11-23T05:23:57Z"
           }
          ]
         }
        ],
        "total": 1
       }

      yield put({
        type: 'updateWorkflow',
        payload: {
          workflowList: transData(result && result.records),
        },
      });
    },

    *updateDialogVisable(action, { call, put, select }){
      yield put({
        type: 'updateDialogVisable',
        payload: {
          isWorkflowRecord:action.payload.isWorkflowRecord
        },
      });
    },

    *removeWorkflow(action, { call, put, select }) {
      const { name } = action.payload;
      let { workflowList } = yield select((state) => state.workflow);
      workflowList = workflowList.filter((workflow) => workflow.name !== name);
      yield put({ type: 'updateWorkflow', payload: { workflowList } });
    },

    *setEditView(action, { call, put, select }) {
      const { name, edit, workFlowDefinitions } = action.payload;

      let { workflowList } = yield select((state) => state.workflow);

      workflowList = workflowList.map((workflow) => {
        if (workflow.name === name) {
          workflow.option.edit = edit;
          workflow.workFlowDefinitions = workFlowDefinitions;
        }
        return workflow;
      });
      yield put({ type: 'updateWorkflow', payload: { workflowList } });
    },

    *addWrokflow(action, { call, put, select }) {
      let { workflowList } = yield select((state) => state.workflow);
      const { appName } = action.payload;
      const newData = _.cloneDeepWith(WORKFLOW_TEMPLATE);
      const name = `app${workflowList.length + 1}`;
      newData.appName = appName;
      newData.name = name;
      newData.alias = name;
      newData.description = 'app description';
      workflowList = workflowList.concat([newData]);
      yield put({ type: 'updateWorkflow', payload: { workflowList } });
    },

    *saveWorkflow(action, { call, put, select }) {
      const originWorkflow = action.payload;
      (originWorkflow.option || {}).edit = false;
      const {
        alias,
        appName,
        name,
        description,
        envName = 'pod',
        option = {},
        data,
      } = originWorkflow;
      const workflow = { alias, appName, name, description, envName };
      workflow.enable = option.enable;
      workflow.default = option.default;
      const { nodes, edges } = data;
      const steps = Object.keys(nodes).map((key) => {
        let dependsOn = [];
        return nodes[key].consumerData;
      });
      workflow.steps = steps;
      yield call(createWorkFlow, workflow);
      if (action.callback) {
        action.callback();
      }
    },

    *updateRecordWorkflowList(action, { call, put }) {
      yield put({
        type: 'updateWorkflow',
        payload: {
          workflowList: transData(action.payload.workflows),
        },
      });
     
    },
  },
};

function transData(workflowList = []) {
  const newData = _.cloneDeep(workflowList);
  if (newData && newData.length != 0) {
    newData.forEach((key) => {
      const nodes = {};
      const edges = {};
      let position = 10;
      key.steps &&
        key.steps.forEach((item, index, array) => {
          if(index>0){
            position += 130;
          }
          edges[item.name] = {};
          edges[item.name]['dest'] = key.steps && key.steps[index + 1] && key.steps[index + 1].name;
          edges[item.name]['diagramMakerData'] = {
            selected: false,
          };
          edges[item.name]['id'] = item.name;
          edges[item.name]['src'] = key.steps && key.steps[index] && key.steps[index].name;

          nodes[item.name] = {};
          nodes[item.name]['id'] = item.name;
          nodes[item.name]['typeId'] = item.type;
          nodes[item.name]['consumerData'] = {
            alias: item.alias || '',
            dependsOn: null,
            description: item.description || '',
            name: item.name || '',
            properties: item.properties || '',
            type: item.type || '',
            phase: item.phase || ''
          };
          nodes[item.name]['diagramMakerData'] = {
            position: {
              x: position,
              y: 30,
            },
            size: {
              width: 100,
              height: 40,
            },
            selected: false,
          };
        });
      key['envName'] = key.envName;
      key['option'] = {
        edit: false,
        enable: false,
        default: key.default,
      };
      key['data'] = {
        edges: edges,
        nodes: nodes,
      };
    });
    return newData;
  } else {
    return [];
  }
}
