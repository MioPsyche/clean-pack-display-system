// 仅供首页展示使用，不改变后台项目说明或业务数据。
export const heroCopy = {
  englishName: 'Integrated Leaf and Vegetable Cleaning Machine',
  subtitle: '基于 5G 物联网与多场景应用的中小型叶菜洁净化加工装备',
  description:
    '本项目面向生鲜冷链与净菜加工中人工成本高、工序衔接分散、设备大型化难以下沉普及等问题，围绕叶菜去根、清洗、分拣、称重和打捆包装等环节开展中小型洁净化一体加工装备研究。研发了一台供中小型场景使用的叶菜洁净一体机。',
  positioning: '面向中小型使用场景的叶菜洁净化',
};

export const heroImages = [
  { src: '/images/hero-machine.webp', alt: '叶菜洁净一体机整体模型图' },
  { src: '/images/machine-exploded_1.webp', alt: '叶菜洁净一体机爆炸图' },
  { src: '/images/structure-detail.webp', alt: '叶菜洁净一体机结构细节图' },
];

export type ShowcaseVideo = {
  title: string;
  src?: string;
  poster?: string;
  placeholder: string;
};

// 获得真实素材后填写 src（例如 /videos/structure.mp4）和可选 poster。
// 不配置虚构视频地址，不用示意动画代替实物测试。
export const structureVideos: ShowcaseVideo[] = [
  { title: '整体结构布局', placeholder: '视频待提供' },
  { title: '机械传动系统', placeholder: '视频待提供' },
  { title: '控制与检测预留', placeholder: '视频待提供' },
];

export const prototypeVideo: ShowcaseVideo = {
  title: '实物测试',
  placeholder: '实物测试视频待拍摄',
};
