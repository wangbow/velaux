import React, { Component } from 'react';
import G6 from '@antv/g6';
import './index.less';
class Topology extends Component {
  renderInfo() {
    // 我们用 insert-css 演示引入自定义样式
    // 推荐将样式添加到自己的样式文件中
    // 若拷贝官方代码，别忘了 npm install insert-css

    const data = {
      nodes: [
        {
          id: '1',
          dataType: 'alps',
          name: 'pig-ui',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '2',
          dataType: 'alps',
          name: 'pig-gateway',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '3',
          dataType: 'alps',
          name: 'user-server',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '4',
          dataType: 'sql',
          name: 'app-server',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '5',
          dataType: 'sql',
          name: 'trial-server',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '6',
          dataType: 'feature_etl',
          name: 'reds-mysql',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '7',
          dataType: 'feature_etl',
          name: 'redis',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
        {
          id: '8',
          dataType: 'feature_extractor',
          name: 'oss-stronge',
          conf: [
            {
              label: 'conf',
              value: 'pai_graph.conf',
            },
            {
              label: 'dot',
              value: 'pai_graph.dot',
            },
            {
              label: 'init',
              value: 'init.rc',
            },
          ],
        },
      ],
      edges: [
        {
          source: '1',
          target: '2',
        },
        {
          source: '2',
          target: '3',
        },
        {
          source: '2',
          target: '4',
        },
        {
          source: '2',
          target: '5',
        },
        {
          source: '3',
          target: '6',
        },
        {
          source: '4',
          target: '6',
        },
        {
          source: '4',
          target: '7',
        },
        {
          source: '5',
          target: '7',
        },
        {
          source: '5',
          target: '8',
        },
      ],
    };

    G6.registerNode(
      'sql',
      {
        drawShape(cfg, group) {
          const rect = group.addShape('rect', {
            attrs: {
              x: -75,
              y: -25,
              width: 150,
              height: 50,
              radius: 10,
              stroke: '#5B8FF9',
              fill: '#C6E5FF',
              lineWidth: 3,
            },
            name: 'rect-shape',
          });
          if (cfg.name) {
            group.addShape('text', {
              attrs: {
                text: cfg.name,
                x: 0,
                y: 0,
                fill: '#00287E',
                fontSize: 14,
                textAlign: 'center',
                textBaseline: 'middle',
                fontWeight: 'bold',
              },
              name: 'text-shape',
            });
          }
          return rect;
        },
      },
      'single-node',
    );
    const rootEle = document.getElementById('root');
    const container = document.getElementById('test');
    const width = container.scrollWidth;
    const height = rootEle.clientHeight - 420 || 380;
    const graph = new G6.Graph({
      container: 'test',
      width,
      height,
      layout: {
        type: 'dagre',
        nodesepFunc: (d) => {
          return 50;
        },
        ranksep: 20,
        controlPoints: true,
      },
      defaultNode: {
        type: 'sql',
      },
      defaultEdge: {
        type: 'polyline',
        style: {
          radius: 20,
          offset: 45,
          endArrow: true,
          lineWidth: 2,
          stroke: '#C2C8D5',
        },
      },
      nodeStateStyles: {
        selected: {
          stroke: '#d9d9d9',
          fill: '#5394ef',
        },
      },
      modes: {
        default: [
          'drag-canvas',
          'zoom-canvas',
          'click-select',
          {
            type: 'tooltip',
            formatText(model) {
              return model.name;
              // const cfg = model.conf;
              // const text = [];
              // cfg.forEach((row) => {
              //   text.push(row.label + ':' + row.value + '<br>');
              // });
              // return text.join('\n');
            },
            offset: 30,
          },
        ],
      },
      fitView: true,
    });
    graph.data(data);
    graph.render();

    if (typeof window !== 'undefined')
      window.onresize = () => {
        if (!graph || graph.get('destroyed')) return;
        if (!container || !container.scrollWidth || !container.scrollHeight) return;
        graph.changeSize(container.scrollWidth, container.scrollHeight);
      };
  }

  componentDidMount() {
    this.renderInfo();
  }
  render() {
    return (
      <div>
        <div id="test" style={{ height: '100%' }}>
          {' '}
        </div>
      </div>
    );
  }
}

export default Topology;
