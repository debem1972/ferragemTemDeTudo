import { createHash, timingSafeEqual } from 'node:crypto';

function hashPassword(password) {
  return createHash('sha256').update(password).digest('hex');
}

export function verifyPassword(password, storedHash) {
  const incomingHash = Buffer.from(hashPassword(password));
  const savedHash = Buffer.from(storedHash || '');

  if (incomingHash.length !== savedHash.length) {
    return false;
  }

  return timingSafeEqual(incomingHash, savedHash);
}

export function createPasswordHash(password) {
  return hashPassword(password);
}
