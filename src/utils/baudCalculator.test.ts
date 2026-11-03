import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateBaudRate,
  calculateTimerDelay,
  getStandardBaudTable,
  getCommonBaudDerivations
} from './baudCalculator';

test('11.0592 MHz at 9600 baud with SMOD=0 gives TH1=FDH with 0.00% error', () => {
  const result = calculateBaudRate(11059200, 9600, 0);
  assert.equal(result.th1Decimal, 253);
  assert.equal(result.th1Hex, 'FDH');
  assert.equal(result.exactReloadCount, 3);
  assert.equal(result.roundedReloadCount, 3);
  assert.equal(result.actualBaud, 9600);
  assert.equal(Math.round(result.errorPercentage * 100) / 100, 0);
  assert.equal(result.isReliable, true);
});

test('11.0592 MHz at 4800 baud gives TH1=FAH (250) with 0% error', () => {
  const result = calculateBaudRate(11059200, 4800, 0);
  assert.equal(result.th1Decimal, 250);
  assert.equal(result.th1Hex, 'FAH');
  assert.equal(result.exactReloadCount, 6);
  assert.equal(result.actualBaud, 4800);
  assert.equal(result.errorPercentage, 0);
});

test('11.0592 MHz at 19200 baud with SMOD=1 gives TH1=FDH with 0% error', () => {
  const result = calculateBaudRate(11059200, 19200, 1);
  assert.equal(result.th1Decimal, 253);
  assert.equal(result.th1Hex, 'FDH');
  assert.equal(result.actualBaud, 19200);
  assert.equal(result.errorPercentage, 0);
});

test('12.0 MHz at 9600 baud gives high error > 8%', () => {
  const result = calculateBaudRate(12000000, 9600, 0);
  // Reload count = 12000000 / (384 * 9600) = 3.2552 -> rounded to 3
  assert.equal(result.roundedReloadCount, 3);
  assert.equal(result.isReliable, false);
  assert.ok(result.errorPercentage > 8);
});

test('Timer 0 Mode 1 delay for 5 ms at 12 MHz gives EC78H count', () => {
  const result = calculateTimerDelay(12000000, 5, 1);
  assert.equal(result.requiredTicks, 5000);
  assert.equal(result.initialCount, 60536);
  assert.equal(result.thHex, '0ECH');
  assert.equal(result.tlHex, '78H');
  assert.equal(result.isOverflow, false);
});

test('Standard baud table provides valid entries', () => {
  const table = getStandardBaudTable();
  assert.ok(table.length >= 10);
  assert.equal(table[0].baud, 9600);
});

test('getCommonBaudDerivations provides full pedagogical derivations for all common rates', () => {
  const derivations = getCommonBaudDerivations();
  assert.equal(derivations.length, 6);

  // Check 9600 baud derivation
  const b9600 = derivations.find((d) => d.presetKey === '9600');
  assert.ok(b9600);
  assert.equal(b9600.th1Hex, 'FDH');
  assert.equal(b9600.reloadCount, 3);
  assert.equal(b9600.errorPercentage, 0.0);
  assert.equal(b9600.steps.length, 6);

  // Check 19200 baud SMOD=1
  const b19200 = derivations.find((d) => d.presetKey === '19200');
  assert.ok(b19200);
  assert.equal(b19200.smod, 1);
  assert.equal(b19200.actualBaud, 19200);

  // Check 12 MHz error derivation
  const b12mhz = derivations.find((d) => d.presetKey === '12mhz');
  assert.ok(b12mhz);
  assert.equal(b12mhz.isReliable, false);
  assert.ok(b12mhz.errorPercentage > 8.5);
});

