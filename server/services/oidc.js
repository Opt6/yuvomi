/**
 * Modul: OIDC-Client
 * Zweck: OpenID-Connect-Client-Singleton, konfiguriert via Umgebungsvariablen.
 *        getClient() führt Discovery durch und cached den Client für die Laufzeit.
 *        resetClient() wird in Tests verwendet um den Cache zu leeren.
 */
import { Issuer } from 'openid-client';

let _client = null;

/**
 * Gibt true zurück wenn alle vier OIDC-Umgebungsvariablen gesetzt sind.
 * @returns {boolean}
 */
export function isOidcEnabled() {
  return !!(
    process.env.OIDC_ISSUER &&
    process.env.OIDC_CLIENT_ID &&
    process.env.OIDC_CLIENT_SECRET &&
    process.env.OIDC_REDIRECT_URI
  );
}

/**
 * Gibt den initialisierten OIDC-Client zurück (Discovery bei erstem Aufruf).
 * Gibt null zurück wenn OIDC nicht konfiguriert ist.
 * @returns {Promise<import('openid-client').Client|null>}
 */
export async function getClient() {
  if (!isOidcEnabled()) return null;
  if (_client) return _client;

  const issuer = await Issuer.discover(process.env.OIDC_ISSUER);
  _client = new issuer.Client({
    client_id:      process.env.OIDC_CLIENT_ID,
    client_secret:  process.env.OIDC_CLIENT_SECRET,
    redirect_uris:  [process.env.OIDC_REDIRECT_URI],
    response_types: ['code'],
  });

  return _client;
}

/**
 * Leert den Client-Cache. Nur für Tests.
 */
export function resetClient() {
  _client = null;
}
