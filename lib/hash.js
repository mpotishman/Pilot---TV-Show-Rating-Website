// lib/hash.js
import crypto from "crypto";

export function hashUserPassword(password) {
  // 16-byte salt, hex encoded
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, 64);
  return `${derivedKey.toString("hex")}:${salt}`;
}

export function verifyPassword(suppliedPassword, storedPassword) {
  // defensive checks
  if (!storedPassword || typeof storedPassword !== "string") return false;

  const parts = storedPassword.split(":");
  if (parts.length !== 2) return false;

  const [storedHashHex, salt] = parts;
  if (!salt) return false;

  const storedHashBuf = Buffer.from(storedHashHex, "hex");
  const suppliedHashBuf = crypto.scryptSync(suppliedPassword, salt, 64);

  // timing-safe comparison
  if (storedHashBuf.length !== suppliedHashBuf.length) return false;
  return crypto.timingSafeEqual(storedHashBuf, suppliedHashBuf);
}
