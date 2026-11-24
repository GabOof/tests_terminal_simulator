import { mkdirSync, writeFileSync } from "node:fs";
import { InterpretadorComandos } from "../js/interpretadorComandos.js";
import { SistemaArquivos } from "../js/sistemaArquivos.js";

function novoAmbiente() {
    const sistema = new SistemaArquivos();
    return { sistema, interpretador: new InterpretadorComandos(sistema) };
}

function arquivoComLinhas(sistema) {
    sistema.atual.arquivos["notas.txt"] = {
        nome: "notas.txt",
        conteudo: "a\nb\nc",
        tamanho: 5,
    };
}

const casos = [
    {
        id: "DD-01",
        requisito: "Exibir primeiras linhas (head)",
        esperado: "a\nb",
        executar: ({ sistema, interpretador }) => {
            arquivoComLinhas(sistema);
            return interpretador.executa("head notas.txt 2");
        },
    },
    {
        id: "DD-02",
        requisito: "Exibir últimas linhas (tail)",
        esperado: "b\nc",
        executar: ({ sistema, interpretador }) => {
            arquivoComLinhas(sistema);
            return interpretador.executa("tail notas.txt 2");
        },
    },
    {
        id: "DD-03",
        requisito: "Contar linhas, palavras e caracteres (wc)",
        esperado: "Linhas: 3\nPalavras: 3\nCaracteres: 5",
        executar: ({ sistema, interpretador }) => {
            arquivoComLinhas(sistema);
            return interpretador.executa("wc notas.txt");
        },
    },
    {
        id: "DD-04",
        requisito: "Renomear arquivo sem perdê-lo",
        esperado: "arquivo preservado",
        executar: ({ sistema, interpretador }) => {
            interpretador.executa("touch teste.txt");
            interpretador.executa("rename teste.txt teste.txt");
            return sistema.atual.arquivos["teste.txt"] ? "arquivo preservado" : "arquivo perdido";
        },
    },
    {
        id: "DD-05",
        requisito: "rmdir deve remover somente o nome solicitado",
        esperado: "a removido; b preservado",
        executar: ({ sistema, interpretador }) => {
            interpretador.executa("mkdir a");
            interpretador.executa("mkdir b");
            interpretador.executa("rmdir a");
            return (
                `a ${sistema.atual.filho.a ? "preservado" : "removido"}; ` +
                `b ${sistema.atual.filho.b ? "preservado" : "removido"}`
            );
        },
    },
    {
        id: "DD-06",
        requisito: "Arquivo vazio deve conter zero palavras (wc)",
        esperado: "Palavras: 0",
        executar: ({ interpretador }) => {
            interpretador.executa("touch vazio.txt");
            const resposta = interpretador.executa("wc vazio.txt");
            return resposta.split("\n").find((linha) => linha.startsWith("Palavras: "));
        },
    },

    {
        id: "CTRL-01",
        requisito: "Criar pasta e navegar",
        esperado: "~/teste",
        executar: ({ interpretador }) => {
            interpretador.executa("mkdir teste");
            return interpretador.executa("cd teste");
        },
    },
    {
        id: "CTRL-02",
        requisito: "Criar arquivo vazio e ler",
        esperado: "",
        executar: ({ interpretador }) => {
            interpretador.executa("touch vazio.txt");
            return interpretador.executa("cat vazio.txt");
        },
    },
];

const resultados = casos.map((caso) => {
    let obtido;
    try {
        obtido = caso.executar(novoAmbiente());
    } catch (erro) {
        obtido = `${erro.name}: ${erro.message}`;
    }
    const conforme = obtido === caso.esperado;
    const status = conforme ? "CONFORME" : "DIVERGENTE";
    console.log(`${caso.id} | ${status} | ${caso.requisito}`);
    if (!conforme) {
        console.log(`  Esperado: ${JSON.stringify(caso.esperado)}`);
        console.log(`  Obtido:   ${JSON.stringify(obtido)}`);
    }
    return { id: caso.id, requisito: caso.requisito, esperado: caso.esperado, obtido, status };
});

const divergentes = resultados.filter((r) => r.status === "DIVERGENTE" && r.id.startsWith("DD-"));
const resumo = {
    data: new Date().toISOString(),
    total_casos: resultados.length,
    casos_divergentes: divergentes.length,
    observacao:
        "Uma divergência é candidata a defeito. Confirme o requisito e a causa antes de contabilizá-la como defeito único.",
    resultados,
};
mkdirSync("docs", { recursive: true });
writeFileSync("docs/diagnostico-defeitos.json", JSON.stringify(resumo, null, 2) + "\n");
console.log(
    `\nDiagnóstico: ${resultados.length} casos; ${divergentes.length} divergências candidatas a defeitos.`
);
console.log("Relatório salvo em docs/diagnostico-defeitos.json");
