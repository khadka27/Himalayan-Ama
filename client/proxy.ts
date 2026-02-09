import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(req: NextRequest) {
    const token = req.cookies.get("auth_token");
    const url = req.nextUrl.clone();

    if (url.pathname === "/admin/login") {
        if (token) {
            url.pathname = "/admin/dashboard";
            return NextResponse.redirect(url);
        }
        return NextResponse.next();
    }
    if (url.pathname.startsWith("/admin/dashboard") && !token) {
        url.pathname = "/admin/login";
        return NextResponse.redirect(url);
    }
    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*", "/admin/dashboard/:path*"],
};