import type { CallToolResult } from "./types.ts";

/** Gate hosts that may appear in loginUrl redirects. */
const ALLOWED_LOGIN_HOSTS = new Set([
  "gate.grok.me",
  "gate.app-builder-testing.com",
]);

export function isAllowedLoginUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "https:" && ALLOWED_LOGIN_HOSTS.has(parsed.hostname);
  } catch {
    return false;
  }
}

export function isLoginRequired(result: CallToolResult): boolean {
  return result.ok === false && result.loginRequired === true;
}

export function isConnectorPending(result: CallToolResult): boolean {
  return result.ok === false && result.pending === true;
}

export function isFramed(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

export function redirectToLoginIfRequired(result: CallToolResult): boolean {
  if (!isLoginRequired(result)) return false;
  const url = result.loginUrl;
  if (!url || !isAllowedLoginUrl(url)) return false;
  if (typeof window === "undefined") return false;
  if (isFramed()) {
    const opened = window.open(url, "_blank");
    if (opened) {
      opened.opener = null;
      return true;
    }
  }
  window.location.assign(url);
  return true;
}
