export type Payee = {
  bank: string;
  account: string;
  name: string;
};

export type Payment = {
  code: string;
  kind: "ticket" | "stay" | "tour";
  ref: string;
  title: string;
  amount: number;
  memo: string;
  status: "pending" | "reported";
  createdAt: string;
};

const KEY = "dfxtrip:payments";
const PAYEE_KEY = "dfxtrip:payee";

export const BANKS = [
  { id: "MB", label: "MB Bank" },
  { id: "VCB", label: "Vietcombank" },
  { id: "ACB", label: "ACB" },
  { id: "ICB", label: "VietinBank" },
  { id: "TCB", label: "Techcombank" },
  { id: "BIDV", label: "BIDV" },
  { id: "VPB", label: "VPBank" },
  { id: "TPB", label: "TPBank" },
] as const;

export function plainText(value: string) {
  return value
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

/** Nội dung chuyển khoản ngắn, không dấu, để ngân hàng không cắt mất mã. */
export function paymentMemo(code: string) {
  const clean = plainText(code).toUpperCase().replace(/[^A-Z0-9]/g, "");
  return `DFX${clean}`.slice(0, 25);
}

export function payeeFromEnv(env?: {
  VITE_VIETQR_BANK?: string;
  VITE_VIETQR_ACCOUNT?: string;
  VITE_VIETQR_NAME?: string;
}) {
  const source = env ?? (import.meta.env as { VITE_VIETQR_BANK?: string; VITE_VIETQR_ACCOUNT?: string; VITE_VIETQR_NAME?: string });
  return {
    bank: String(source?.VITE_VIETQR_BANK ?? "").trim().toUpperCase(),
    account: String(source?.VITE_VIETQR_ACCOUNT ?? "").replace(/\s/g, ""),
    name: String(source?.VITE_VIETQR_NAME ?? "").trim(),
  };
}

export function payeeReady(payee: Payee) {
  return Boolean(payee.bank && payee.account && payee.name);
}

export function vietQrUrl(payee: Payee, amount: number, memo: string) {
  const bank = payee.bank.trim().toUpperCase();
  const account = payee.account.replace(/\s/g, "");
  const name = plainText(payee.name).trim();
  if (!/^[A-Z0-9]{2,15}$/.test(bank) || !/^\d{6,19}$/.test(account) || !name) return "";
  if (!Number.isFinite(amount) || amount <= 0) return "";
  const params = new URLSearchParams({
    amount: String(Math.round(amount)),
    addInfo: memo,
    accountName: name,
  });
  return `https://img.vietqr.io/image/${bank}-${account}-compact2.png?${params}`;
}

export function loadPayee(): Payee {
  const fromEnv = payeeFromEnv();
  if (payeeReady(fromEnv)) return fromEnv;
  if (typeof localStorage === "undefined") return fromEnv;
  try {
    const raw = localStorage.getItem(PAYEE_KEY);
    if (!raw) return fromEnv;
    const saved = JSON.parse(raw) as Partial<Payee>;
    return {
      bank: String(saved.bank ?? "").trim().toUpperCase(),
      account: String(saved.account ?? "").replace(/\s/g, ""),
      name: String(saved.name ?? "").trim(),
    };
  } catch {
    return fromEnv;
  }
}

export function envPayeeLocked() {
  return payeeReady(payeeFromEnv());
}

export function savePayee(payee: Payee) {
  localStorage.setItem(
    PAYEE_KEY,
    JSON.stringify({
      bank: payee.bank.trim().toUpperCase(),
      account: payee.account.replace(/\s/g, ""),
      name: payee.name.trim(),
    }),
  );
}

function read(): Payment[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

export function loadPayments() {
  return read();
}

export function paymentByCode(code: string) {
  return read().find((item) => item.code === code) ?? null;
}

export function paymentByRef(ref: string) {
  return read().find((item) => item.ref === ref) ?? null;
}

export function createPayment(input: { kind: Payment["kind"]; ref: string; title: string; amount: number }) {
  const existing = paymentByRef(input.ref);
  if (existing) return existing;
  const code = `PAY${Date.now().toString().slice(-6)}`;
  const payment: Payment = {
    code,
    kind: input.kind,
    ref: input.ref,
    title: input.title,
    amount: input.amount,
    memo: paymentMemo(code),
    status: "pending",
    createdAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([payment, ...read()]));
  return payment;
}

export function markReported(code: string) {
  const next = read().map((item) => (item.code === code ? { ...item, status: "reported" as const } : item));
  localStorage.setItem(KEY, JSON.stringify(next));
  return next.find((item) => item.code === code) ?? null;
}
