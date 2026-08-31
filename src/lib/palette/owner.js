// Owner detection for the command palette. No backend: "owner mode" is just a
// flag in localStorage, set once per device by typing the passphrase into the
// palette. Random visitors never have it and only ever see the public menu.
//
// The homelab service list is loaded dynamically (see CommandPalette.svelte) so
// it never sits in the main JS bundle. The real gate is still Tailscale: the
// service URLs only resolve inside the owner's tailnet.

const KEY = 'porto_owner';

// Change this to rotate access. Anyone who already unlocked stays unlocked
// (their localStorage flag persists) until they clear site data.
const PASSPHRASE = 'sudo';

export function isOwner() {
  try {
    return localStorage.getItem(KEY) === '1';
  } catch {
    return false;
  }
}

/** @param {string} input @returns {boolean} true if it matched and unlocked */
export function unlock(input) {
  if (input.trim().toLowerCase() !== PASSPHRASE) return false;
  try {
    localStorage.setItem(KEY, '1');
  } catch {
    /* private mode: session-only, handled by caller state */
  }
  return true;
}

export function lock() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}
