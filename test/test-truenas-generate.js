import { test } from 'node:test';
import assert from 'node:assert/strict';
import { assertValidSemver, bumpVersion, substitute } from '../tools/truenas/generate.mjs';

test('assertValidSemver akzeptiert gültiges semver', () => {
  assert.equal(assertValidSemver('0.60.11'), '0.60.11');
  assert.equal(assertValidSemver('1.0.0'), '1.0.0');
});

test('assertValidSemver wirft bei ungültiger Version', () => {
  assert.throws(() => assertValidSemver('1.2'), /ungültige semver/i);
  assert.throws(() => assertValidSemver('v1.2.3'), /ungültige semver/i);
  assert.throws(() => assertValidSemver(''), /ungültige semver/i);
});

test('bumpVersion: patch erhöht die letzte Stelle', () => {
  assert.equal(bumpVersion('1.0.0', 'patch'), '1.0.1');
  assert.equal(bumpVersion('1.2.9', 'patch'), '1.2.10');
});

test('bumpVersion: minor erhöht die mittlere Stelle und nullt patch', () => {
  assert.equal(bumpVersion('1.0.5', 'minor'), '1.1.0');
});

test('bumpVersion: major erhöht die erste Stelle und nullt rest', () => {
  assert.equal(bumpVersion('1.4.5', 'major'), '2.0.0');
});

test('bumpVersion wirft bei unbekanntem Typ', () => {
  assert.throws(() => bumpVersion('1.0.0', 'huge'), /unbekannter bump/i);
});

test('substitute ersetzt alle bekannten Platzhalter', () => {
  const out = substitute('a={{X}} b={{Y}} c={{X}}', { X: '1', Y: '2' });
  assert.equal(out, 'a=1 b=2 c=1');
});

test('substitute wirft, wenn ein {{...}}-Platzhalter übrig bleibt', () => {
  assert.throws(() => substitute('a={{X}} b={{Z}}', { X: '1' }), /nicht ersetzt.*Z/i);
});
