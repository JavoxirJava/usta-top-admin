"use client";

import { Navigation } from "./Navigation";
import { usePathname } from "next/navigation";

export default function NavigationWrapper() {
    const pathname = usePathname();
    const hideNavOnAuth = ["/login", "/register", "/admin"];
    const showNav = !hideNavOnAuth.some((path) => pathname.startsWith(path));

    if (!showNav) return null;

    return <Navigation />;
}
