"use client"

import { cn } from "@/lib/utils"
import Link from "next/link";
import { useParams, usePathname } from "next/navigation"

export function MainNav({
    className,
    ...props
}: React.HTMLAttributes<HTMLElement>)  {
    const pathname = usePathname();
    const params = useParams();
    const routes = [
        {
            href: `/${params.teamId}`,
            label: 'Übersicht',
            active: pathname === `/${params.teamId}`,
        },
        {
            href: `/${params.teamId}/settings`,
            label: 'Einstellungen',
            active: pathname === `/${params.teamId}/settings`,
        },
        {
            href: `/${params.teamId}/employees`,
            label: 'Mitarbeiter',
            active: pathname === `/${params.teamId}/employees`,
        }
    ]

    return (
       <nav
       className={cn("flex items-center ml-3 space-x-4 lg:space-x-6", className)}
       >
            {routes.map((route) => (
                <Link 
                key={route.href}
                href={route.href}
                className={cn("text-sm hover:bg-gray-100 p-3 rounded-lg font-medium transition-colors hover:text-primary",
                    route.active 
                    ? "text-black dark:text-white" 
                    : "text-muted-foreground")}
                >
                    {route.label}
                </Link>
                )
        )}
       </nav>
    )
}