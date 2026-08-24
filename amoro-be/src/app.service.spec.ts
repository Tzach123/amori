import { describe, expect, it } from 'vitest';
import { AppService } from './app.service';

describe('AppService', () => {
  it('reports ok status', () => {
    const service = new AppService();
    expect(service.getHealth()).toEqual({ status: 'ok' });
  });
});
