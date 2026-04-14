'use client';

import { useSidebar } from './SidebarContext';

export default function MainContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { open } = useSidebar();
  return (
    <main
      className={`px-8 py-8 pt-6 transition-[margin] duration-300 ease-in-out ${open ? 'ml-60' : 'ml-0'}`}
    >
      <div className="mx-auto max-w-2xl">{children}</div>
    </main>
  );
}
