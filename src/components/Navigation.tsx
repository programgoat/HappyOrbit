'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trash2, PlusCircle, Star, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/detox', label: 'リセット', Icon: Trash2 },
  { href: '/charge', label: 'チャージ', Icon: PlusCircle, primary: true },
  { href: '/galaxy', label: 'ギャラクシー', Icon: Star },
  { href: '/calendar', label: 'カレンダー', Icon: Calendar },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass border-t border-white/10">
      <div className="flex items-end justify-around px-2 py-2 max-w-lg mx-auto">
        {NAV_ITEMS.map(({ href, label, Icon, primary }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-all duration-200',
                primary
                  ? cn(
                      'relative -top-3 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-purple-500/40 px-4 py-3',
                      isActive && 'from-indigo-400 to-purple-500 shadow-purple-400/60'
                    )
                  : cn(
                      'text-white/40 hover:text-white/70',
                      isActive && 'text-white'
                    )
              )}
            >
              <Icon
                size={primary ? 24 : 20}
                className={cn(
                  primary ? 'text-white' : '',
                  isActive && !primary && 'drop-shadow-[0_0_6px_rgba(255,255,255,0.8)]'
                )}
                strokeWidth={isActive && !primary ? 2.5 : 1.5}
              />
              <span
                className={cn(
                  'text-[10px] font-medium leading-none',
                  primary ? 'text-white/90' : '',
                  isActive && !primary && 'text-white'
                )}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
