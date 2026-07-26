import type { NavigationItem } from '../types/project';

// 站点统一版本号：页面各处展示引用此常量；package.json 与 index.html 需手工保持同步。
export const APP_VERSION = 'V1.1';

export const projectProfile = {
  name: `智能叶菜洁净化包装设备项目展示与询价管理系统 ${APP_VERSION}`,
  shortName: '叶菜洁净一体机',
  subtitle: '基于 5G 物联网与多场景应用的中小型叶菜洁净化加工装备研究与实践',
  positioning: '大学生创新创业训练计划比赛展示系统',
  description:
    '本项目面向生鲜冷链与净菜加工中人工成本高、工序衔接分散、设备大型化难以下沉普及等问题，围绕叶菜去根、清洗、分拣、称重和打捆包装等环节开展中小型洁净化一体加工装备研究。当前页面用于大创比赛展示、本地演示和资料整理，不代表真实商业后台。',
  keywords: ['5G 物联网', '叶菜洁净化', '去根清洗称重包装', '中小型净菜加工', '大创项目'],
};

export const navigationItems: NavigationItem[] = [
  { label: '项目概览', href: '#overview' },
  { label: '痛点方案', href: '#background' },
  { label: '设备结构', href: '#structure' },
  { label: '技术参数', href: '#specs' },
  { label: '团队成果', href: '#team' },
  { label: '预约询价', href: '#contact' },
];
