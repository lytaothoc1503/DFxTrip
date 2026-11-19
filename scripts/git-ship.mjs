import { execFileSync } from "node:child_process";

function git(args) {
  return execFileSync("git", args, { encoding: "utf8" });
}

const message = process.argv.slice(2).join(" ").trim() || "Cập nhật";

git(["add", "-A"]);

const previewPath = "src/lib/auth/preview.ts";
let preview = "";
try {
  preview = git(["show", `:${previewPath}`]);
} catch {
  preview = "";
}
if (/PREVIEW_CLIENT_SECRET\s*=\s*\r?\n\s*"[0-9a-f]{16,}"/.test(preview)) {
  console.error("Chặn đẩy vì src/lib/auth/preview.ts đang chứa khóa xem trước.");
  process.exit(1);
}

if (!git(["status", "--porcelain"]).trim()) {
  console.log("Không có thay đổi để đẩy.");
  process.exit(0);
}

git(["commit", "-m", message]);
git(["-c", "credential.helper=", "-c", "credential.helper=!sh scripts/git-credential-gh.sh", "push", "-u", "origin", "HEAD"]);
console.log("Đã đẩy lên origin.");
