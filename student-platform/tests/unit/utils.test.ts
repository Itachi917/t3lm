
import { describe, it } from 'node:test';
import assert from 'node:assert';
import { cn } from '../../lib/utils.ts';

describe('Utility Tests', () => {
  it('should merge tailwind classes correctly', () => {
    const result = cn('bg-red-500', 'bg-blue-500');
    // twMerge handles conflicts, so last one wins
    assert.strictEqual(result, 'bg-blue-500');
  });

  it('should handle conditional classes', () => {
    const result = cn('text-white', false && 'bg-red-500', 'p-4');
    assert.strictEqual(result, 'text-white p-4');
  });
});
