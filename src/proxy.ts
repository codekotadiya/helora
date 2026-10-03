import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  HANDOFF_QUERY_PARAM,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  acceptHandoff,
  readLaunchpadSecret,
} from "./lib/launchpad-handoff";

export async function proxy(request: NextRequest) {
  const token = request.nextUrl.searchParams.get(HANDOFF_QUERY_PARAM);
  const decision = await acceptHandoff({
    token,
    secret: readLaunchpadSecret(process.env),
    url: request.nextUrl,
    headers: request.headers,
  });

  if (decision.action === "continue") {
    return NextResponse.next();
  }

  const response = NextResponse.redirect(decision.location, 302);
  response.headers.set("cache-control", "no-store, private");
  response.headers.set("referrer-policy", "no-referrer");

  if (decision.sessionToken) {
    response.cookies.set({
      name: SESSION_COOKIE,
      value: decision.sessionToken,
      httpOnly: true,
      secure: decision.secure,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
    });
  }

  return response;
}

export const config = {
  matcher: [
    {
      source: "/((?!_next/static|_next/image).*)",
      has: [{ type: "query", key: "launchpad_token" }],
    },
  ],
};
