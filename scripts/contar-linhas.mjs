// Conta linhas físicas dos arquivos JavaScript do projeto
// O número inclui comentários e linhas em branco
import { readFileSync, readdirSync } from "node:fs";
let total = 0;
for (const nome of readdirSync("js").filter((n) => n.endsWith(".js"))) {
    const conteudo = readFileSync(`js/${nome}`, "utf8");
    const linhas = conteudo.split(/\r?\n/).length - (conteudo.endsWith("\n") ? 1 : 0);
    total += linhas;
    console.log(`${nome}: ${linhas} linhas físicas`);
}
console.log(`TOTAL: ${total} linhas físicas = ${(total / 1000).toFixed(3)} KLOC`);
console.log("Densidade de defeitos = defeitos confirmados / KLOC");
