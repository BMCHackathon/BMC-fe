'use client';

import { Dock, DockIcon } from '@/components/ui/dock';
import { buttonVariants } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Home, LogOut, Pencil, User } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BottomDock() {

  const DATA = {
    navbar: [
          {
            href: '/',
            icon: Home,
            label: 'Home',
          },
          {
              href: "/chat",
              icon: User,
              label: "Chat",
          },
            {
                href: "/upload",
                icon: Pencil,
                label: "Upload",
            },
            {
                href: "/logout",
                icon: LogOut,
                label: "Logout",

        }
      
    ],
  };

  const pathName = usePathname();

  return (
    <div
      className={`pointer-events-none fixed inset-x-0 bottom-20 z-30 mx-auto mb-4 flex origin-bottom h-full max-h-14 ${
        pathName === '/onboarding' && 'hidden'
      }`}
    >
      <div className="fixed bottom-0 inset-x-0 h-16 w-full bg-background to-transparent backdrop-blur-lg [-webkit-mask-image:linear-gradient(to_top,black,transparent)]"></div>
      <Dock className="z-50 pointer-events-auto relative mx-auto flex min-h-full h-full items-center px-1 bg-background [box-shadow:0_0_0_1px_rgba(0,0,0,.03),0_2px_4px_rgba(0,0,0,.05),0_12px_24px_rgba(0,0,0,.05)] transform-gpu bg-[#9333EA] ">
        {DATA.navbar.map((item) => (
          <DockIcon key={item.href}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link
                  href={item.href}
                  className={cn(
                    buttonVariants({
                      variant: 'ghost',
                      size: 'icon',
                    }),
                    'size-10'
                  )}
                  onClick={item.onclick}
                >
                  <item.icon className="size-4" color='white' />
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          </DockIcon>
        ))}
      </Dock>
    </div>
  );
}