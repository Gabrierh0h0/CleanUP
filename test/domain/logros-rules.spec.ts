/**
 * TEST UNITARIO — Capa de Dominio: LogrosRules
 * Demuestra que las reglas de negocio son testeables de forma aislada,
 * sin necesidad de Firebase ni de ninguna capa externa.
 */
import { LogrosRules } from '../../src/domain/rules/logros.rules';
import { LogroModel } from '../../src/domain/models/logro.model';

describe('LogrosRules (Dominio)', () => {
  const logros = [
    new LogroModel({ id: 'logro-1', nombre: 'Explorador', puntos: 50, requiredMissions: ['m1', 'm2'] }),
    new LogroModel({ id: 'logro-2', nombre: 'Veterano', puntos: 100, requiredMissions: ['m1', 'm2', 'm3'] }),
    new LogroModel({ id: 'logro-3', nombre: 'Leyenda', puntos: 200, requiredMissions: [] }),
  ];

  it('debe desbloquear logro cuando se completan todas sus misiones requeridas', () => {
    const completed = ['m1', 'm2'];
    const alreadyHave = [];
    const nuevos = LogrosRules.calculateNewUnlocks(logros, completed, alreadyHave);
    expect(nuevos.map((l) => l.id)).toContain('logro-1');
  });

  it('NO debe desbloquear logro si faltan misiones requeridas', () => {
    const completed = ['m1'];
    const alreadyHave = [];
    const nuevos = LogrosRules.calculateNewUnlocks(logros, completed, alreadyHave);
    expect(nuevos).toHaveLength(0);
  });

  it('NO debe desbloquear logro ya desbloqueado anteriormente', () => {
    const completed = ['m1', 'm2'];
    const alreadyHave = ['logro-1'];
    const nuevos = LogrosRules.calculateNewUnlocks(logros, completed, alreadyHave);
    expect(nuevos.map((l) => l.id)).not.toContain('logro-1');
  });

  it('NO debe desbloquear logro sin misiones requeridas definidas', () => {
    const completed = ['m1', 'm2', 'm3'];
    const alreadyHave = [];
    const nuevos = LogrosRules.calculateNewUnlocks(logros, completed, alreadyHave);
    expect(nuevos.map((l) => l.id)).not.toContain('logro-3');
  });

  it('debe sumar correctamente los puntos de logros desbloqueados', () => {
    const total = LogrosRules.sumPoints([logros[0], logros[1]]);
    expect(total).toBe(150);
  });
});
