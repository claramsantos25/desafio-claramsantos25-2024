class RecintosZoo {
    constructor() {
        this.animais = {
            "LEAO": { tamanho: 3, bioma: ["savana"] },
            "LEOPARDO": { tamanho: 2, bioma: ["savana"] },
            "CROCODILO": { tamanho: 3, bioma: ["rio"] },
            "MACACO": { tamanho: 1, bioma: ["savana", "floresta"] },
            "GAZELA": { tamanho: 2, bioma: ["savana"] },
            "HIPOPOTAMO": { tamanho: 4, bioma: ["savana", "rio"] }
        };

        this.recintos = [
            { numero: 1, bioma: "savana", tamanhoTotal: 10, animais: [{ especie: "MACACO", quantidade: 3 }] },
            { numero: 2, bioma: "floresta", tamanhoTotal: 5, animais: [] },
            { numero: 3, bioma: "savana e rio", tamanhoTotal: 7, animais: [{ especie: "GAZELA", quantidade: 1 }] },
            { numero: 4, bioma: "rio", tamanhoTotal: 8, animais: [] },
            { numero: 5, bioma: "savana", tamanhoTotal: 9, animais: [{ especie: "LEAO", quantidade: 1 }] }
        ];
    }

    analisaRecintos(animal, quantidade) {
        if (!this.animais[animal]) {
            return { erro: "Animal inválido" };
        }
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida" };
        }

        const { tamanho, bioma } = this.animais[animal];
        let recintosViaveis = [];

        for (let recinto of this.recintos) {
            const biomaCompativel = bioma.includes(recinto.bioma) ||
                                   (recinto.bioma === "savana e rio" && bioma.includes("savana") && bioma.includes("rio")) || (recinto.bioma === "savana e rio" && bioma.includes("savana")) ||(recinto.bioma === "savana e rio" && bioma.includes("rio"));
            if (!biomaCompativel) continue;

            let espacoOcupado = recinto.animais.reduce((total, { especie, quantidade }) => {
                return total + (this.animais[especie].tamanho * quantidade);
            }, 0);

            // Considera espaço extra se houver mais de uma espécie
            const outrasEspecies = recinto.animais.some(({ especie }) => especie !== animal);
            if (outrasEspecies) {
                espacoOcupado += 1; // Adicionar espaço extra se houver outras espécies
            }

            const espacoNecessario = tamanho * quantidade;
            const espacoDisponivel = recinto.tamanhoTotal - espacoOcupado;

            // Verifica se há espaço suficiente
            if (espacoNecessario > espacoDisponivel) continue;

            // Verifica a restrição de convivência
            const animaisNoRecinto = recinto.animais.map(a => a.especie);
            const possuiMacacosOuGazelas = animaisNoRecinto.some(e => e === "MACACO" || e === "GAZELA");
            const possuiCarnivoros = animaisNoRecinto.some(e => ["LEAO", "LEOPARDO", "CROCODILO"].includes(e));

            // Ajustado para permitir macacos no recinto 3
            if ((animal === "MACACO" || animal === "GAZELA") && possuiCarnivoros) continue;
            if (["LEAO", "LEOPARDO", "CROCODILO"].includes(animal) && possuiMacacosOuGazelas) continue;

            if (animal === "HIPOPOTAMO" && recinto.bioma !== "savana e rio" && outrasEspecies) continue;

            if (animal === "MACACO" && quantidade === 1 && !outrasEspecies && animaisNoRecinto.length === 0) continue;

            recintosViaveis.push({
                numero: recinto.numero,
                espacoLivre: espacoDisponivel - espacoNecessario,
                espacoTotal: recinto.tamanhoTotal
            });
        }

        if (recintosViaveis.length === 0) {
            return { erro: "Não há recinto viável" };
        }

        recintosViaveis.sort((a, b) => a.numero - b.numero);

        return {
            recintosViaveis: recintosViaveis.map(r => `Recinto ${r.numero} (espaço livre: ${r.espacoLivre} total: ${r.espacoTotal})`)
        };
    }
}

export { RecintosZoo as RecintosZoo };