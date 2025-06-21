import { describe, it, expect } from 'vitest';
import { calculateStrength } from '../PasswordStrengthMeter';

describe('calculateStrength', () => {
  it('detects weak passwords', () => {
    const result = calculateStrength('abc');
    expect(result.score).toBe(25);
    expect(result.strength).toBe('Weak');
  });

  it('scores fairly strong passwords', () => {
    const result = calculateStrength('abcdefgh');
    expect(result.score).toBe(50);
    expect(result.strength).toBe('Fair');
  });

  it('scores good passwords', () => {
    const result = calculateStrength('ABCDEF12');
    expect(result.score).toBe(75);
    expect(result.strength).toBe('Good');
  });

  it('detects strong passwords with specials', () => {
    const result = calculateStrength('Abcdefgh!');
    expect(result.score).toBe(85);
    expect(result.strength).toBe('Strong');
  });

  it('detects strongest passwords', () => {
    const result = calculateStrength('Abcdefgh1');
    expect(result.score).toBe(100);
    expect(result.strength).toBe('Strong');
  });
});
