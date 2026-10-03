import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { describe, it } from "node:test";
import { NextRequest } from "next/server";
import { getRedirectUrl, unstable_doesMiddlewareMatch } from "next/experimental/testing/server";
import { config, proxy } from "../proxy";
import {
  HANDOFF_QUERY_PARAM,
  SESSION_COOKIE,
  SESSION_TTL_SECONDS,
  acceptHandoff,
  verifySessionToken,
} from "./launchpad-handoff";

const SECRET = "handoff-test-secret";
const HOST = "helora-two.vercel.app";

function referenceSign(payload: Record<string, unknown>, secret: string): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", Buffer.from(secret, "utf8"))
    .update(body)
    .digest("base64url");
  return `${body}.${signature}`;
}

function handoffPayload(now: number, overrides: Record<string, unknown> = {}) {
  return {
    typ: "handoff",
    aud: HOST,
    exp: Math.floor(now / 1000) + 60,
    nonce: "abc123",
    ...overrides,
  };
}

function headersFor(host = HOST, proto = "https"): Headers {
  const headers = new Headers();
  headers.set("x-forwarded-host", host);
  headers.set("x-forwarded-proto", proto);
  headers.set("host", "helora-deployment.vercel.app");
  return headers;
}

describe("launchpad handoff", () => {
  const now = Date.parse("2026-10-03T06:00:00Z");

  it("accepts a valid token and returns a session without the query param", async () => {
    const token = referenceSign(handoffPayload(now), SECRET);
    const url = new URL(
      `https://helora-deployment.vercel.app/dentists?ref=pad&${HANDOFF_QUERY_PARAM}=${token}`,
    );
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url,
      headers: headersFor(),
      now,
    });

    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    const location = new URL(result.location);
    assert.equal(location.origin, `https://${HOST}`);
    assert.equal(location.pathname, "/dentists");
    assert.equal(location.searchParams.get("ref"), "pad");
    assert.equal(location.searchParams.has(HANDOFF_QUERY_PARAM), false);
    assert.equal(result.location.includes(token), false);
    assert.equal(result.secure, true);
    assert.ok(result.sessionToken);
    assert.notEqual(result.sessionToken, token);
    assert.equal(await verifySessionToken(result.sessionToken!, SECRET, now), true);
  });

  it("rejects an expired token without a session", async () => {
    const token = referenceSign(
      handoffPayload(now, { exp: Math.floor(now / 1000) - 1 }),
      SECRET,
    );
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url: new URL(`https://${HOST}/?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
    assert.equal(new URL(result.location).searchParams.has(HANDOFF_QUERY_PARAM), false);
  });

  it("rejects a token that expires at the current instant", async () => {
    const token = referenceSign(
      handoffPayload(now, { exp: Math.floor(now / 1000) }),
      SECRET,
    );
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url: new URL(`https://${HOST}/?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
  });

  it("rejects a wrong audience", async () => {
    const token = referenceSign(
      handoffPayload(now, { aud: "personalfinance-dusky.vercel.app" }),
      SECRET,
    );
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url: new URL(`https://${HOST}/templates?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
    assert.equal(new URL(result.location).pathname, "/templates");
  });

  it("rejects a bad signature", async () => {
    const token = referenceSign(handoffPayload(now), SECRET);
    const broken = `${token.slice(0, -1)}${token.endsWith("a") ? "b" : "a"}`;
    const result = await acceptHandoff({
      token: broken,
      secret: SECRET,
      url: new URL(`https://${HOST}/?${HANDOFF_QUERY_PARAM}=${encodeURIComponent(broken)}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
  });

  it("rejects a token signed with a different secret", async () => {
    const token = referenceSign(handoffPayload(now), "other-secret");
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url: new URL(`https://${HOST}/?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
  });

  it("rejects a session token presented as a handoff", async () => {
    const token = referenceSign(
      { typ: "session", exp: Math.floor(now / 1000) + 60, nonce: "n" },
      SECRET,
    );
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url: new URL(`https://${HOST}/?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
  });

  it("rejects when the secret is missing and does not keep the token", async () => {
    const token = referenceSign(handoffPayload(now), SECRET);
    const result = await acceptHandoff({
      token,
      secret: null,
      url: new URL(`https://${HOST}/hotels?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.equal(result.sessionToken, null);
    assert.equal(new URL(result.location).search, "");
  });

  it("leaves the request unchanged when the token is missing", async () => {
    const result = await acceptHandoff({
      token: null,
      secret: SECRET,
      url: new URL(`https://${HOST}/demo`),
      headers: headersFor(),
      now,
    });
    assert.deepEqual(result, { action: "continue" });
  });

  it("accepts a handoff that has no nonce", async () => {
    const token = referenceSign(
      {
        typ: "handoff",
        aud: HOST,
        exp: Math.floor(now / 1000) + 30,
      },
      SECRET,
    );
    const result = await acceptHandoff({
      token,
      secret: SECRET,
      url: new URL(`https://${HOST}/?${HANDOFF_QUERY_PARAM}=${token}`),
      headers: headersFor(),
      now,
    });
    assert.equal(result.action, "redirect");
    if (result.action !== "redirect") return;
    assert.ok(result.sessionToken);
  });
});

describe("proxy", () => {
  const now = Date.parse("2026-10-03T06:00:00Z");

  it("runs only when the handoff query parameter is present", () => {
    const matcher = config.matcher[0];
    assert.equal(matcher.has[0]?.key, HANDOFF_QUERY_PARAM);
    assert.equal(
      unstable_doesMiddlewareMatch({
        config,
        url: `https://${HOST}/?${HANDOFF_QUERY_PARAM}=token`,
      }),
      true,
    );
    assert.equal(
      unstable_doesMiddlewareMatch({
        config,
        url: `https://${HOST}/dentists?ref=1&${HANDOFF_QUERY_PARAM}=token`,
      }),
      true,
    );
    assert.equal(
      unstable_doesMiddlewareMatch({
        config,
        url: `https://${HOST}/`,
      }),
      false,
    );
    assert.equal(
      unstable_doesMiddlewareMatch({
        config,
        url: `https://${HOST}/_next/static/chunk.js?${HANDOFF_QUERY_PARAM}=token`,
      }),
      false,
    );
  });

  it("sets the logged-in session and strips the token", async () => {
    const previous = process.env.LAUNCHPAD_PASSWORD;
    process.env.LAUNCHPAD_PASSWORD = SECRET;
    try {
      const token = referenceSign(handoffPayload(Date.now()), SECRET);
      const request = new NextRequest(
        `https://${HOST}/?${HANDOFF_QUERY_PARAM}=${encodeURIComponent(token)}&ref=pad`,
      );
      const response = await proxy(request);
      const location = getRedirectUrl(response);
      assert.ok(location);
      const landed = new URL(location!);
      assert.equal(landed.searchParams.has(HANDOFF_QUERY_PARAM), false);
      assert.equal(landed.searchParams.get("ref"), "pad");
      assert.equal(landed.origin, `https://${HOST}`);
      assert.equal(response.status, 302);
      const setCookie = response.headers.get("set-cookie") ?? "";
      assert.match(setCookie, new RegExp(`${SESSION_COOKIE}=`));
      assert.match(setCookie, /HttpOnly/i);
      assert.match(setCookie, /Secure/i);
      assert.match(setCookie, /SameSite=Lax/i);
      assert.match(setCookie, new RegExp(`Max-Age=${SESSION_TTL_SECONDS}`));
      assert.equal(setCookie.includes(token), false);
      const cookie = response.cookies.get(SESSION_COOKIE);
      assert.ok(cookie);
      assert.equal(await verifySessionToken(cookie!.value, SECRET, Date.now()), true);
    } finally {
      if (previous === undefined) delete process.env.LAUNCHPAD_PASSWORD;
      else process.env.LAUNCHPAD_PASSWORD = previous;
    }
  });

  it("does not replace an existing session for an expired, wrong-audience, or bad signature", async () => {
    const previous = process.env.LAUNCHPAD_PASSWORD;
    process.env.LAUNCHPAD_PASSWORD = SECRET;
    try {
      const cases = [
        referenceSign(handoffPayload(now, { exp: 1 }), SECRET),
        referenceSign(handoffPayload(Date.now(), { aud: "other.example" }), SECRET),
        `${referenceSign(handoffPayload(Date.now()), SECRET)}x`,
      ];
      for (const token of cases) {
        const request = new NextRequest(
          `https://${HOST}/hotels?${HANDOFF_QUERY_PARAM}=${encodeURIComponent(token)}`,
          { headers: { cookie: `${SESSION_COOKIE}=already-logged-in` } },
        );
        const response = await proxy(request);
        const location = getRedirectUrl(response);
        assert.ok(location);
        assert.equal(new URL(location!).searchParams.has(HANDOFF_QUERY_PARAM), false);
        assert.equal(response.headers.get("set-cookie"), null);
        assert.equal(response.cookies.get(SESSION_COOKIE), undefined);
      }
    } finally {
      if (previous === undefined) delete process.env.LAUNCHPAD_PASSWORD;
      else process.env.LAUNCHPAD_PASSWORD = previous;
    }
  });

  it("does not change the session when the password is unset", async () => {
    const previous = process.env.LAUNCHPAD_PASSWORD;
    delete process.env.LAUNCHPAD_PASSWORD;
    try {
      const token = referenceSign(handoffPayload(Date.now()), SECRET);
      const request = new NextRequest(
        `https://${HOST}/?${HANDOFF_QUERY_PARAM}=${encodeURIComponent(token)}`,
        { headers: { cookie: `${SESSION_COOKIE}=already-logged-in` } },
      );
      const response = await proxy(request);
      assert.equal(response.headers.get("set-cookie"), null);
      const location = getRedirectUrl(response);
      assert.ok(location);
      assert.equal(new URL(location!).search, "");
    } finally {
      if (previous === undefined) delete process.env.LAUNCHPAD_PASSWORD;
      else process.env.LAUNCHPAD_PASSWORD = previous;
    }
  });

  it("passes through when there is no token", async () => {
    const request = new NextRequest(`https://${HOST}/demo`);
    const response = await proxy(request);
    assert.equal(getRedirectUrl(response), null);
    assert.equal(response.headers.get("set-cookie"), null);
  });
});
