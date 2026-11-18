import { beforeEach, describe, expect, it } from "vitest";
import { InterpretadorComandos } from "../../js/interpretadorComandos.js";
import { SistemaArquivos } from "../../js/sistemaArquivos.js";

// Cada teste recebe um sistema vazio, para não depender de outro teste.
describe("Testes de unidade do interpretador", () => {
    let sistema;
    let interpretador;

    beforeEach(() => {
        sistema = new SistemaArquivos();
        interpretador = new InterpretadorComandos(sistema);
    });

    it("TU-01: cria um diretório", () => {
        expect(interpretador.mkdir("documentos")).toBe("Diretório criado.");
        expect(sistema.raiz.filho.documentos).toBeDefined();
    });

    it("TU-02: impede diretório repetido", () => {
        interpretador.mkdir("documentos");
        expect(interpretador.mkdir("documentos")).toBe("Diretório já existe.");
    });

    it("TU-03: cria arquivo vazio", () => {
        expect(interpretador.touch("notas.txt")).toBe("Arquivo criado.");
        expect(sistema.raiz.arquivos["notas.txt"].conteudo).toBe("");
    });

    it("TU-04: informa quando diretório não existe", () => {
        expect(interpretador.cd("inexistente")).toBe("Diretório inexistente.");
        expect(sistema.atual).toBe(sistema.raiz);
    });

    it("TU-05: mostra o caminho completo", () => {
        interpretador.mkdir("aulas");
        interpretador.cd("aulas");
        interpretador.mkdir("qualidade");
        interpretador.cd("qualidade");
        expect(interpretador.pwd()).toBe("~/aulas/qualidade");
    });
});
