import type { Achievement } from '../types/project';
import { APP_VERSION } from './projectProfile';

export const achievements: Achievement[] = [
  {
    type: '竞赛进展',
    title: '第十二届机械结构创新设计大赛全国决赛',
    status: '现阶段',
  },
  {
    type: '大创项目',
    title: '基于 5G 物联网与多场景应用的叶菜洁净一体机研究与实践',
    status: '资料整理中',
  },
  {
    type: '设备方案',
    title: '自动上料、去根、清洗、分拣、称重、打捆包装一体化流程方案',
    status: '方案展示中',
  },
  {
    type: '机械创新',
    title: '无电机纯机械重力碰撞自动卸料系统与双级复合流体力学清洗模组',
    status: '文档已记录',
  },
  {
    type: '检测控制',
    title: '凸面圆柱透镜机器视觉检测光路与切根电机闭环控制方案',
    status: '参数待补充',
  },
  {
    type: '软件系统',
    title: `智能叶菜洁净化包装设备项目展示与询价管理系统 ${APP_VERSION}`,
    status: '本地演示版',
  },
];
