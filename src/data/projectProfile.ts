import type { NavigationItem } from '../types/project';

export const projectProfile = {
  name: '智能叶菜洁净化包装设备项目展示与询价管理系统 V1.0',
  shortName: '智能叶菜洁净化包装设备',
  subtitle: '面向叶菜采后洁净化与包装衔接场景的设备方案展示平台',
  positioning: '大学生创新创业训练计划比赛展示系统',
  description:
    '本项目围绕叶菜采后处理中的分拣、清洗、沥水与包装衔接问题，展示团队在机械结构设计、样机验证、项目管理和本地演示系统建设方面的阶段性成果。系统用于大创比赛答辩、本地演示和后期软著材料整理，不代表真实商业后台。',
  keywords: ['叶菜洁净化', '采后处理', '包装衔接', '机械样机', '大创项目'],
};

export const navigationItems: NavigationItem[] = [
  { label: '项目概览', href: '#overview' },
  { label: '痛点方案', href: '#background' },
  { label: '设备结构', href: '#structure' },
  { label: '技术参数', href: '#specs' },
  { label: '团队成果', href: '#team' },
  { label: '预约询价', href: '#contact' },
];
