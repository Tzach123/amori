import { ExecutionContext, HttpException } from '@nestjs/common';
import { describe, expect, it } from 'vitest';
import { RateLimitGuard } from './rate-limit.guard';

function createContext(ip: string): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ ip }),
    }),
  } as unknown as ExecutionContext;
}

describe('RateLimitGuard', () => {
  it('allows requests under the limit', () => {
    const guard = new RateLimitGuard();
    const context = createContext('1.2.3.4');

    for (let i = 0; i < 30; i++) {
      expect(guard.canActivate(context)).toBe(true);
    }
  });

  it('blocks requests once the per-IP limit is exceeded', () => {
    const guard = new RateLimitGuard();
    const context = createContext('5.6.7.8');

    for (let i = 0; i < 30; i++) {
      guard.canActivate(context);
    }

    expect(() => guard.canActivate(context)).toThrow(HttpException);
  });

  it('tracks separate buckets per IP', () => {
    const guard = new RateLimitGuard();
    const contextA = createContext('1.1.1.1');
    const contextB = createContext('2.2.2.2');

    for (let i = 0; i < 30; i++) {
      guard.canActivate(contextA);
    }

    expect(guard.canActivate(contextB)).toBe(true);
  });
});
