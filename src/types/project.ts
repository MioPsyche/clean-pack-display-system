export type NavigationItem = {
  label: string;
  href: string;
};

export type InfoCard = {
  title: string;
  description: string;
  tag?: string;
};

export type TimelineItem = {
  phase: string;
  title: string;
  description: string;
};

export type TechSpec = {
  name: string;
  value: string;
  note?: string;
};

export type TeamMember = {
  name: string;
  role: string;
  responsibility: string;
};

export type Achievement = {
  type: string;
  title: string;
  status: string;
};
