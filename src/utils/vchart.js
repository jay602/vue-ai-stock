/* eslint-disable  */
import { timestampToTime, getColonTimeFromDate, dateToWeek } from '@/utils/date'
import { parseLargeNumber } from '@/utils/number'

// 按需加载F2 - 参考链接[https://www.yuque.com/antv/f2/require-on-demand]
const F2 = require('@antv/f2/lib/core'); // 必须引入 - 核心
require('@antv/f2/lib/geom/line'); // 只加载折线图
require('@antv/f2/lib/geom/area'); // 只加载面积图
require('@antv/f2/lib/geom/interval'); // 只加载柱状图
require('@antv/f2/lib/coord/polar'); // 极坐标
require('@antv/f2/lib/geom/adjust/stack'); // 只加载层叠类型
require('@antv/f2/lib/scale/time-cat'); // 加载 timeCat 类型的度量
require('@antv/f2/lib/component/guide/text'); // 只加载 Guide.Text 组件
require('@antv/f2/lib/component/guide/line'); // 只加载 Guide.Line 组件

const Tooltip = require('@antv/f2/lib/plugin/tooltip'); // 加载插件 Tooltip
const Guide = require('@antv/f2/lib/plugin/guide'); // 加载插件 Guide
const Animation = require('@antv/f2/lib/animation/detail'); // 精细的动画模块（包含入场、更新以及销毁动画）
const Legend = require('@antv/f2/lib/plugin/legend');// 加载插件 Legend

F2.Chart.plugins.register(Legend); // 注册插件 Legend
F2.Chart.plugins.register(Tooltip); // 注册插件 Tooltip
F2.Chart.plugins.register(Guide); // 注册插件 Guide
F2.Chart.plugins.register(Animation); // 注册插件 Animation

// 关闭 F2 的体验改进计划打点请求
F2.track(false)
F2.Global.shape.line.lineWidth = 1

// 十大买入卖出经纪商 格式化数字
function numberToMoney(n, isPositive) {
  const num = String(Math.floor(n * 100) / 100).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return isPositive ? '+' + num : '-' + num
}

// 从指定的两个时间获取相隔分钟数
function getMinBetTime(start, end) {
  const start_arr = start.split(':')
  const end_arr = end.split(':')
  const start_res = start_arr[0] * 60 + start_arr[1] * 1
  const end_res = end_arr[0] * 60 + end_arr[1] * 1
  return end_res - start_res
}

// 涨跌颜色定义
const FAIR_COLOR = '#c7c7c7' // 持平
const RISE_COLOR = '#f54343' // 上涨
const FALL_COLOR = '#1aae52' // 下跌
const TREND_COLORS = [FALL_COLOR, FAIR_COLOR, RISE_COLOR]

const RATIO_COLOR = '#ff8d1e'
const CLOSE_COLOR = '#8391b4'

export default {
  /**
   * 经纪商持股 -- 折线
   */
  renderBrokersLine: options => {
    const { el, data = [], colors = [], chartTips, chartLineCrosshairs } = options

    var chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio,
      padding: ['auto', 15]
    })

    chart.source(data)

    chart.scale({
      date: {
        type: 'timeCat',
        sortable: false,
        tickCount: 4,
        mask: 'MM/DD',
        range: [0, 1]
      },
      holdStockRatio: {
        formatter: function formatter(val) {
          return val.toFixed(2) + '%';
        }
      },
      close: {
        alias: '收盘价',
        formatter: val => val.toFixed(3)
      }
    })

    chart.legend(false);

    // Tooltip 配置 获取当前canvas位置
    var { width } = el.getBoundingClientRect();
    // 操作DOM
    var tooltipEl = chartTips;
    var lineTipEl = chartLineCrosshairs;
    chart.tooltip({
      custom: true,
      crosshairsStyle: {
        lineWidth: 2,
        stroke: '#c6c6c6'
      },
      onChange: function onChange(ev) {
        var items = ev.items;

        // 取出收盘价数据
        var last = items.length - 1
        var { x, y, origin } = items[last];

        // 自定义提示框
        var html = '';

        const { date, open, close, trend, trendClose, upDownScope } = origin
        var time = timestampToTime(date, 'YYYY/MM/DD')
        var week = dateToWeek(date, '周')

        html += `<p class="tips-title">${time} ${week}</p>`;

        html += '<ul>';
        html += `<li><span>开盘价</span><span>${open.toFixed(2)}</span></li>`;
        html += `<li><span>收盘价</span><span style="color: ${TREND_COLORS[trendClose]};">${close.toFixed(2)}</span></li>`;
        html += `<li><span>涨跌幅</span><span style="color: ${TREND_COLORS[trend]};">${upDownScope}%</span></li>`;

        items.forEach((currentData, ind) => {
          var { value, color, origin } = currentData
          var { brokerName } = origin
          if (ind !== last) {
            html += `<li style="color: ${color};"><span>${brokerName}</span><span>${value}</span></li>`;
          }
        })

        html += '</ul>'

        tooltipEl.innerHTML = html

        tooltipEl.style = `opacity: 1; right: 0px; top: 0`
        if (x > width / 2) {
          tooltipEl.style = `opacity: 1; left: 0px; top: 0`
        }

        // 自定义十字线 - 横线
        var canvasWidth = chart.get('width')
        var coord = chart.get('coord');
        var coord_left = coord.x.start;
        var coord_right = canvasWidth - coord.x.end;
        lineTipEl.style = `opacity: 1; left: ${coord_left}px; right: ${coord_right}px; top: ${y - 1}px;`
      },
      onHide: function onHide() {
        tooltipEl.style = 'opacity: 0';
        lineTipEl.style = 'opacity: 0';
      }
    })

    chart.axis('date', {
      line: null,
      label: function label(text, index, total) {
        var textCfg = {}
        if (index === 0) {
          textCfg.textAlign = 'start'
        } else if (index === total - 1) {
          textCfg.textAlign = 'end'
        }
        return textCfg
      }
    })

    chart.axis('holdStockRatio', {
      labelOffset: 0,
      label: {
        top: true,
        textAlign: 'start',
        textBaseline: 'bottom'
      }
    });

    chart.axis('close', {
      grid: null,
      labelOffset: 0,
      label: {
        top: true,
        textAlign: 'end',
        textBaseline: 'bottom'
      }
    });

    chart.line().position('date*holdStockRatio').color('color', val => val);
    chart.line().position('date*close').color(colors[0]);
    chart.render();

    return chart
  },

  /**
   * 十大经纪商 -- 条形
   */
  renderBrokersBar: options => {
    const { el, data = [], colors = '', textColor = '#666', isPositive } = options

    var chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio,
      padding: [15, 30, 'auto', 120]
    })
    chart.source(data)
    chart.coord({
      transposed: true
    })
    chart.scale('value', {
      range: [0, 0.5]
    });

    chart.legend(false);
    chart.tooltip(false);

    chart.axis('name', {
      labelOffset: 106,
      label: function label(text, index, total) {
        var textCfg = {}
        textCfg.textAlign = 'left'
        textCfg.fontSize = '13'

        if (text.length > 6) {
          // 区分中英文，截取显示宽度
          var reg = /[\u4e00-\u9fa5]+/g;
          if (reg.test(text)) {
            textCfg.text = text.substr(0, 6) + '...'
          } else {
            textCfg.text = text.substr(0, 9) + '...'
          }
        } else {
          textCfg.text = text
        }
        return textCfg
      },
      line: null,
      grid: null
    });
    chart.axis('value', false);
    chart.interval().position('name*value').color('name', colors);

    // 绘制文本
    data.map(function (obj) {
      chart.guide().text({
        position: [obj.name, obj.value], // 文本的起始位置，值为原始数据值，支持 callback
        content: numberToMoney(obj.value, isPositive), // 显示的文本内容
        style: {
          textAlign: 'left',
          fill: textColor // 文本颜色
        }, // 文本的图形样式属性
        offsetX: 10, // x 方向的偏移量
        offsetY: -6 // y 方向偏移量
      })
      chart.guide().text({
        position: [obj.name, obj.value], // 文本的起始位置，值为原始数据值，支持 callback
        content: obj.ratio, // 显示的文本内容
        style: {
          textAlign: 'left',
          fill: textColor // 文本颜色
        }, // 文本的图形样式属性
        offsetX: 10, // x 方向的偏移量
        offsetY: 6 // y 方向偏移量
      })
    })
    chart.render()

    return chart
  },

  /**
   * 资金趋势 -- 面积
   */
  renderMoneyArea: options => {
    const { el, data = [], charge = [], min = 0, max, color = '#fc571e', countY = 4 } = options

    const changeData = data.map(item => {
      const { name } = item
      const time = getColonTimeFromDate(new Date(name)).slice(0, 5)
      return Object.assign({}, item, { time })
    })

    var chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio,
      padding: [0, 'auto', 'auto', 15]
    })

    chart.source(changeData)

    // 均分登份 - 刻度减1
    const num = (max - min) / (countY - 1)
    const ticks = new Array(countY).fill('').map((val, ind) => {
      return min + num * ind
    })

    // 获取今天日期 -- 考虑ios系统只识别 斜杠 /
    const today = timestampToTime(+new Date(), 'YYYY/MM/DD')
    // 整段时间点轴
    const timeLine = [];
    // 获取每个时间点
    const timePoint = [];
    const chargeLen = charge.length;
    charge.forEach(val => {
      const [ arr_open, arr_close ] = val.split('-')
      const arr_point = getMinBetTime(arr_open, arr_close)
      // 获取每段时间X轴对应的位置
      const timePrev = Date.parse(today + ' ' + arr_open);

      for (let index = 0; index < arr_point; index++) {
        const temp = new Date(timePrev + index * 60 * 1000)
        const time_item = getColonTimeFromDate(temp).slice(0, 5)
        timeLine.push(time_item)
      }

      timePoint.push(arr_open, arr_close)
    })

    // 自定义的X轴绘制时间点
    let texts = []
    // 若两段绘制
    if (chargeLen === 2) {
      texts = [
        { position: 'min', text: timePoint[0] },
        { position: timePoint[2], text: timePoint[1] + '/' + timePoint[2] },
        { position: 'max', text: timePoint[3] }
      ]
      // 绘制 Guide.Line
      chart.guide().line({
        start: [timePoint[2], 'min'],
        end: [timePoint[2], 'max'],
        style: {
          stroke: '#e8e8e8',
          lineWidth: 1,
          lineCap: 'round'
        }
      });
    } else {
    // 其余情况则按点绘制
      texts = timePoint.map(val => {
        return { position: val, text: val }
      })
    }

    chart.scale({
      time: {
        sortable: false,
        tickCount: chargeLen,
        range: [0, 1],
        values: timeLine
      },
      value: {
        ticks,
        formatter: function formatter(val) {
          var temp = (val / 100).toFixed(2)
          var res = Math.abs(temp) > 0 ? temp + 'M' : val.toFixed(2)
          return res
        }
      }
    })

    chart.tooltip(false)
    chart.axis('value', {
      labelOffset: 0,
      label: function label(text, index, total) {
        var textCfg = {}
        textCfg.top = 'true'
        textCfg.textAlign = 'start'
        if (index === total - 1) {
          textCfg.textBaseline = 'top'
        } else {
          textCfg.textBaseline = 'bottom'
        }
        return textCfg
      }
    });

    chart.axis('time', {
      label: null,
      line: {
        lineDash: [2],
        stroke: '#e8e8e8',
        lineWidth: 1
      },
      grid: {
        lineDash: [2],
        stroke: '#e8e8e8',
        lineWidth: 1
      }
    })

    // 自定义X轴的标签文案
    texts.forEach(function (item, index) {
      chart.guide().text({
        // 位置可以选择实际数值
        // 也可以选实际数值的索引
        // 甚至 min、max、median
        position: [item.position, 'min'],
        content: item.text,
        style: function () {
          var s = {
            textBaseline: 'bottom',
            fill: '#999'
          };

          if (index === 0) {
            s.textAlign = 'left';
          } else if (index === texts.length - 1) {
            s.textAlign = 'right';
          } else {
            s.textAlign = 'center';
          }

          return s;
        }(),
        offsetY: 20
      });
    });

    chart
      .area({
        startOnZero: false // 配置 x 轴基线不为 0
      })
      .position('time*value')
      .color('value', color)
    chart
      .line()
      .position('time*value')
      .color('value', color)
    chart.render()

    return chart
  },

  /**
   * 资金分布 -- 环形
   */
  renderMoneyRing: options => {
    const { el, data = [], colors = '' } = options

    var total = data.reduce(function (a, b) {
      return a + b.value
    }, 0)

    var dataRing = data.map(function (a, b) {
      return { ...a, namekey: 'namekey' }
    })

    var chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio,
      padding: [40, 'auto', 'auto', 'auto']
    })

    chart.source(dataRing)
    chart.coord('polar', {
      transposed: true,
      innerRadius: 0.6,
      radius: 0.85
    })
    chart.axis(false)
    chart.legend(false)
    chart.tooltip(false)
    chart
      .interval()
      .position('namekey*value')
      .color('name', colors)
      .adjust('stack')
      .style({
        lineWidth: 1,
        stroke: '#fff',
        lineJoin: 'round',
        lineCap: 'round'
      })
    chart.render()

    // >>>>>>>>>>>>>>>>>>>>>>>>> labeling <<<<<<<<<<<<<<<<<<<<<<<<<<

    var ANCHOR_OFFSET = 0
    var OFFSET = 15
    var LABEL_OFFSET_X = 10
    var LABEL_OFFSET_Y = 5
    var APPEND_OFFSET = 30
    var LINEHEIGHT = 32
    var coord = chart.get('coord') // 获取坐标系对象
    var center = coord.center // 极坐标圆心坐标
    var r = coord.circleRadius // 极坐标半径
    var canvas = chart.get('canvas')
    var canvasWidth = chart.get('width')
    var canvasHeight = chart.get('height')
    var labelGroup = canvas.addGroup()
    var labels = []

    function getEndPoint(center, angle, r) {
      return {
        x: center.x + r * Math.cos(angle),
        y: center.y + r * Math.sin(angle)
      }
    }

    // 绘制文本以及连接线
    function drawLabel(label) {
      var _data = label._data,
        _anchor = label._anchor,
        _router = label._router,
        fill = label.fill,
        y = label.y

      var labelAttrs = {
        y: y - LABEL_OFFSET_Y,
        fontSize: 13, // 字体大小
        fill: '#000',
        text: ((_data.value / total) * 100).toFixed(2) + '%',
        textBaseline: 'bottom'
      }
      var lastPoint = {
        y: y
      }

      if (label._side === 'left') {
        // 具体文本的位置
        lastPoint.x = APPEND_OFFSET
        labelAttrs.x = APPEND_OFFSET + LABEL_OFFSET_X // 左侧文本左对齐并贴着画布距最左侧边缘 10px
        labelAttrs.textAlign = 'left'
      } else {
        lastPoint.x = canvasWidth - APPEND_OFFSET
        labelAttrs.x = canvasWidth - APPEND_OFFSET - LABEL_OFFSET_X // 右侧文本右对齐并贴着画布距最右侧边缘 10px
        labelAttrs.textAlign = 'right'
      }

      // 绘制文本
      var text = labelGroup.addShape('Text', {
        attrs: labelAttrs
      })
      labels.push(text)

      // 绘制锚点
      labelGroup.addShape('Circle', {
        attrs: {
          x: lastPoint.x,
          y: y,
          r: 2,
          fill: fill
        }
      })
      // 绘制连接线
      var points = void 0
      if (_router.y !== y) {
        // 文本位置做过调整
        points = [
          _anchor,
          {
            x: _router.x,
            y: y
          },
          lastPoint
        ]
      } else {
        points = [_anchor, _router, lastPoint]
      }

      labelGroup.addShape('Polyline', {
        attrs: {
          points: points,
          lineWidth: 1,
          stroke: fill
        }
      })
    }

    function antiCollision(half, isRight) {
      var startY = center.y - r - OFFSET - LINEHEIGHT
      var overlapping = true
      var totalH = canvasHeight
      var i = void 0

      var maxY = 0
      var minY = Number.MIN_VALUE
      var boxes = half.map(function (label) {
        var labelY = label.y
        if (labelY > maxY) {
          maxY = labelY
        }
        if (labelY < minY) {
          minY = labelY
        }
        return {
          size: LINEHEIGHT,
          targets: [labelY - startY]
        }
      })
      if (maxY - startY > totalH) {
        totalH = maxY - startY
      }

      while (overlapping) {
        boxes.forEach(function (box) {
          var target = (Math.min.apply(minY, box.targets) + Math.max.apply(minY, box.targets)) / 2
          box.pos = Math.min(Math.max(minY, target - box.size / 2), totalH - box.size)
        })

        // detect overlapping and join boxes
        overlapping = false
        i = boxes.length
        while (i--) {
          if (i > 0) {
            var previousBox = boxes[i - 1]
            var box = boxes[i]
            if (previousBox.pos + previousBox.size > box.pos) {
              // overlapping
              previousBox.size += box.size
              previousBox.targets = previousBox.targets.concat(box.targets)

              // overflow, shift up
              if (previousBox.pos + previousBox.size > totalH) {
                previousBox.pos = totalH - previousBox.size
              }
              boxes.splice(i, 1) // removing box
              overlapping = true
            }
          }
        }
      }

      // step 4: normalize y and adjust x
      i = 0
      boxes.forEach(function (b) {
        var posInCompositeBox = startY // middle of the label
        b.targets.forEach(function () {
          half[i].y = b.pos + posInCompositeBox + LINEHEIGHT / 2
          posInCompositeBox += LINEHEIGHT
          i++
        })
      })

      // (x - cx)^2 + (y - cy)^2 = totalR^2
      half.forEach(function (label) {
        var rPow2 = label.r * label.r
        var dyPow2 = Math.pow(Math.abs(label.y - center.y), 2)
        if (rPow2 < dyPow2) {
          label.x = center.x
        } else {
          var dx = Math.sqrt(rPow2 - dyPow2)
          if (!isRight) {
            // left
            label.x = center.x - dx
          } else {
            // right
            label.x = center.x + dx
          }
        }
        drawLabel(label)
      })
    }

    function addPieLabel(chart) {
      var halves = [
        [], // left
        [] // right
      ] // 存储左右 labels
      labelGroup && labelGroup.clear()
      var geom = chart.get('geoms')[0]
      // 获取文本的信息
      var shapes = geom.get('container').get('children')
      shapes.forEach(function (shape) {
        var shapeAttrs = shape.attr()
        var origin = shape.get('origin')
        var startAngle = shapeAttrs.startAngle,
          endAngle = shapeAttrs.endAngle

        var middleAngle = (startAngle + endAngle) / 2
        var edgePoint = getEndPoint(center, middleAngle, r + ANCHOR_OFFSET)
        var routerPoint = getEndPoint(center, middleAngle, r + OFFSET)
        var label = {
          _anchor: edgePoint,
          _router: routerPoint,
          _data: origin._origin,
          x: routerPoint.x,
          y: routerPoint.y,
          r: r + OFFSET,
          fill: origin.color // 字体颜色
        }
        // 判断文本的方向
        if (edgePoint.x < center.x) {
          label._side = 'left'
          halves[0].push(label)
        } else {
          label._side = 'right'
          halves[1].push(label)
        }
      })

      var maxCountForOneSide = parseInt(canvasHeight / LINEHEIGHT, 10)

      halves.forEach(function (half, index) {
        // step 2: reduce labels
        if (half.length > maxCountForOneSide) {
          half.sort(function (a, b) {
            return b._percent - a._percent
          })
          half.splice(maxCountForOneSide, half.length - maxCountForOneSide)
        }

        // step 3: distribute position (x and y)
        half.sort(function (a, b) {
          return a.y - b.y
        })
        antiCollision(half, index)
        canvas.draw()
      })
    }

    addPieLabel(chart)

    return chart
  },

  /**
   * 资金分布 -- 柱状
   */
  renderMoneyBar: options => {
    const { el, data = [], colors = '', labelColor = '#999', textColor = '#000' } = options

    var chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio
    })
    chart.source(data)
    chart.legend(false)
    chart.tooltip(false)
    chart.axis('name', {
      label: {
        fontSize: 12,
        fillStyle: labelColor
      }
    })
    chart.axis('value', false)
    chart
      .interval()
      .position('name*value')
      .color('name', colors)

    // 绘制文本
    data.map(function (obj) {
      chart.guide().text({
        position: [obj.name, obj.value],
        content: obj.value,
        style: {
          fill: textColor,
          textAlign: 'center'
        },
        offsetY: -10
      })
    })
    chart.render()

    return chart
  },

  /**
   * 卖空比例 -- 折线 - 含自定义十字线
   */
  renderSellLine: options => {
    const { el, data = [], chartTips, chartLineCrosshairs, chartBarCrosshairs } = options

    var chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio,
      padding: ['auto', 15]
    });

    chart.source(data);

    chart.scale({
      date: {
        type: 'timeCat',
        sortable: false,
        tickCount: 4,
        mask: 'MM/DD',
        range: [0, 1]
      },
      shortSellingStockSumRatio: {
        alias: '卖空比例',
        tickCount: 5,
        formatter: function formatter(val) {
          return val.toFixed(2) + '%';
        }
      },
      close: {
        alias: '收盘价',
        tickCount: 5,
        formatter: function formatter(val) {
          return val.toFixed(3)
        }
      }
    })

    // Tooltip 配置 获取当前canvas位置
    var { width } = el.getBoundingClientRect();
    // 操作DOM
    var tooltipEl = chartTips;
    var lineTipEl = chartLineCrosshairs;
    var barTipEl = chartBarCrosshairs;
    chart.tooltip({
      custom: true,
      crosshairsStyle: {
        lineWidth: 2,
        stroke: '#c6c6c6'
      },
      onChange: function onChange(ev) {
        // 自定义提示框
        var items = ev.items;

        var { x, y, origin } = items[0];
        var { date, trend, trendClose, open, close, upDownScope, shortSellingStockSumRatio, shortSellingStockSum, volume } = origin

        var time = timestampToTime(date, 'YYYY/MM/DD')
        var week = dateToWeek(date, '周')

        var html = '';
        html += `<p class="tips-title">${time} ${week}</p>`;
        html += '<ul>';
        html += `<li><span>卖空比例</span><span>${shortSellingStockSumRatio}%</span></li>`;
        html += `<li><span>卖空股数</span><span>${(shortSellingStockSum / 10000).toFixed(2)}万股</span></li>`;
        html += `<li><span>成交股数</span><span>${(volume / 10000).toFixed(2)}万股</span></li>`;
        html += `<li><span>开盘价</span><span>${open.toFixed(2)}</span></li>`;
        html += `<li><span>收盘价</span><span style="color: ${TREND_COLORS[trendClose]};">${close.toFixed(2)}</span></li>`;
        html += `<li><span>涨跌幅</span><span style="color: ${TREND_COLORS[trend]};">${upDownScope}%</span></li>`;
        html += '</ul>';

        tooltipEl.innerHTML = html;

        tooltipEl.style = 'opacity: 1; right: 0px; top: 0';
        if (x > width / 2) {
          tooltipEl.style = 'opacity: 1; left: 0px; top: 0';
        }
        // 自定义十字线 - 横线
        var canvasWidth = chart.get('width')
        var coord = chart.get('coord');
        var coord_left = coord.x.start;
        var coord_right = canvasWidth - coord.x.end;
        lineTipEl.style = `opacity: 1; left: ${coord_left}px; right: ${coord_right}px; top: ${y - 1}px;`
        // 自定义十字线 - 竖线
        barTipEl.style = `opacity: 1; left: ${x - 1}px;`
      },
      onHide: function onHide() {
        tooltipEl.style = 'opacity: 0';
        lineTipEl.style = 'opacity: 0';
        barTipEl.style = 'opacity: 0;'
      }
    });
    chart.axis('date', {
      line: null,
      label: function label(text, index, total) {
        var textCfg = {}
        if (index === 0) {
          textCfg.textAlign = 'start'
        } else if (index === total - 1) {
          textCfg.textAlign = 'end'
        }
        return textCfg
      }
    });

    chart.axis('shortSellingStockSumRatio', {
      labelOffset: 0,
      label: {
        top: true,
        textAlign: 'start',
        textBaseline: 'bottom'
      }
    });

    chart.axis('close', {
      grid: null,
      labelOffset: 0,
      label: {
        top: true,
        textAlign: 'end',
        textBaseline: 'bottom'
      }
    });

    chart.line().position('date*shortSellingStockSumRatio').color(RATIO_COLOR)
    chart.line().position('date*close').color(CLOSE_COLOR)
    chart.render();

    return chart
  },

  /**
   * 卖空比例 -- 柱状
   */
  renderSellBar: options => {
    let { el, data = [] } = options

    const chart = new F2.Chart({
      el,
      pixelRatio: window.devicePixelRatio
    })

    const MAX_VALUE = parseLargeNumber(Math.max.apply(null, data.map(item => item.shortSellingStockSum)), 2)

    chart.source(data)
    chart.axis(false)

    chart.legend({
      custom: true,
      itemWidth: null,
      position: 'bottom',
      align: 'center',
      items: [
        {
          name: '比例',
          marker: function marker(x, y, r, ctx) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.moveTo(x - r - 1, y);
            ctx.lineTo(x + r + 1, y);
            ctx.stroke();
            ctx.fill();
          },
          fill: RATIO_COLOR
        },
        {
          name: '收盘价',
          marker: function marker(x, y, r, ctx) {
            ctx.lineWidth = 2;
            ctx.strokeStyle = ctx.fillStyle;
            ctx.moveTo(x - r - 1, y);
            ctx.lineTo(x + r + 1, y);
            ctx.stroke();
            ctx.fill();
          },
          fill: CLOSE_COLOR
        },
        {
          name: '净买入股数(涨)',
          marker: 'square',
          fill: RISE_COLOR
        },
        {
          name: '净买入股数(跌)',
          marker: 'square',
          fill: FALL_COLOR
        }
      ]
    })

    chart.scale({
      date: {
        type: 'timeCat',
        sortable: false,
        range: [0, 1]
      }
    })

    chart.guide().text({
      position: ['min', 'max'],
      content: MAX_VALUE + '股',
      style: {
        textBaseline: 'middle',
        textAlign: 'center'
      },
      offsetY: -20,
      offsetX: 30
    })

    chart.tooltip(false)

    chart.interval().position('date*shortSellingStockSum').color('trend', (trend) => TREND_COLORS[trend])
    chart.render()

    return chart
  }
}
