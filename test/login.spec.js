import { expect, jest, test } from '@jest/globals';

// Prueba filtrado por rol (luchador)
describe('filtroLuchador retorna los campeones con el tags Fighter (rol luchador)', () => {
  // it = el
  it('Debería retornar una función', () => {
    expect(typeof filtroLuchador).toBe('function');
    // expect = espera         toBe = es
  });
});
