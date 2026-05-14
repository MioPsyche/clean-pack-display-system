import type { TechSpec } from '../types/project';

export const techSpecs: TechSpec[] = [
  {
    name: '设备处理对象',
    value: '叶菜类蔬菜',
    note: '具体适配品类、叶片状态和前处理要求待实测',
  },
  {
    name: '处理能力',
    value: '待实测',
    note: '不填写未经验证的产能、效率或连续运行数据',
  },
  {
    name: '设备尺寸',
    value: 'TODO',
    note: '待完成样机测绘或最终装配尺寸确认后补充',
  },
  {
    name: '供电方式',
    value: 'TODO',
    note: '待电控方案、驱动方式和实验条件确认',
  },
  {
    name: '核心模块',
    value: '进料导向、洁净化处理、沥水、包装衔接',
    note: '模块名称可随 SolidWorks 结构和样机迭代调整',
  },
  {
    name: '材料与接触面',
    value: '待实测',
    note: '后续结合样机材料、食品接触安全要求和清洁便利性补充',
  },
  {
    name: '控制方式',
    value: 'TODO',
    note: '后续按按钮控制、传感器、电机驱动或其他电控方案补充',
  },
  {
    name: '适用场景',
    value: '高校展示、小型净菜处理、合作社验证',
    note: '商业化应用条件和边界需进一步验证',
  },
  {
    name: '样机状态',
    value: 'TODO',
    note: '待补充真实样机照片、调试记录和结构说明',
  },
  {
    name: '测试记录',
    value: '待实测',
    note: '后续可记录清洗效果、沥水效果、运行稳定性等验证结论',
  },
];
