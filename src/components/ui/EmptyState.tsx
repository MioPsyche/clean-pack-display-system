import type { ReactNode } from 'react';

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-carbon/15 bg-white/78 p-10 text-center shadow-panel-soft backdrop-blur">
      <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl border border-aqua/20 bg-aqua/10">
        <span className="h-2.5 w-2.5 rounded-full bg-aqua" aria-hidden="true" />
      </div>
      <p className="font-display text-2xl font-semibold tracking-[-0.03em] text-carbon">{title}</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-steel">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>
  );
}
