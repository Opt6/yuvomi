// Generator für die TrueNAS-Catalog-Dateien von Oikos.
// Pure Funktionen (unten) sind testbar; runGenerate() macht die fs-Arbeit.

const SEMVER_RE = /^\d+\.\d+\.\d+$/;

export function assertValidSemver(version) {
  if (typeof version !== 'string' || !SEMVER_RE.test(version)) {
    throw new Error(`ungültige semver-Version: ${JSON.stringify(version)}`);
  }
  return version;
}

export function bumpVersion(current, type) {
  const [major, minor, patch] = assertValidSemver(current).split('.').map(Number);
  switch (type) {
    case 'patch': return `${major}.${minor}.${patch + 1}`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'major': return `${major + 1}.0.0`;
    default: throw new Error(`unbekannter bump-Typ: ${JSON.stringify(type)}`);
  }
}

export function substitute(template, vars) {
  let out = template;
  for (const [key, value] of Object.entries(vars)) {
    out = out.split(`{{${key}}}`).join(value);
  }
  const leftover = out.match(/\{\{([^}]+)\}\}/);
  if (leftover) {
    throw new Error(`Platzhalter nicht ersetzt: ${leftover[1]}`);
  }
  return out;
}
