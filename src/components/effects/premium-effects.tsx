import React from 'react';
import { cn } from '../../lib/utils';

export function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden="true">
      <span className="orb orb-one" />
      <span className="orb orb-two" />
      <span className="orb orb-three" />
      <span className="grid-glow" />
    </div>
  );
}

export function SpotlightCard({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('spotlight-card', className)}>{children}</div>;
}

export function BentoShell({ className, children }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bento-shell', className)}>{children}</div>;
}
