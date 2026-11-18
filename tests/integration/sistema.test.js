import { beforeEach, describe, expect, it } from 'vitest';
import { SistemaArquivos } from '../../js/sistemaArquivos.js';
import { InterpretadorComandos } from '../../js/interpretadorComandos.js';

// Aqui, testamos uma sequência de comandos usando várias classes juntas.
describe('Integração Bottom-up do sistema de arquivos', () => {
  let interpretador;

  beforeEach(() => {
    interpretador = new InterpretadorComandos(new SistemaArquivos());
  });

  it('TI-01: cria pasta e entra nela', () => {
    expect(interpretador.executa('mkdir projetos')).toBe('Diretório criado.');
    expect(interpretador.executa('cd projetos')).toBe('~/projetos');
    expect(interpretador.executa('pwd')).toBe('~/projetos');
  });

  it('TI-02: cria, escreve e lê um arquivo', () => {
    expect(interpretador.executa('touch notas.txt')).toBe('Arquivo criado.');
    expect(interpretador.executa('echo Ola mundo > notas.txt')).toBe('Conteúdo escrito.');
    expect(interpretador.executa('cat notas.txt')).toBe('Ola mundo');
  });

  it('TI-03: remove arquivo e verifica a árvore', () => {
    interpretador.executa('mkdir testes');
    interpretador.executa('cd testes');
    interpretador.executa('touch apagar.txt');
    expect(interpretador.executa('rm apagar.txt')).toBe('Arquivo removido.');
    const arvore = interpretador.executa('tree');
    expect(arvore).toContain('testes');
    expect(arvore).not.toContain('apagar.txt');
  });
});
