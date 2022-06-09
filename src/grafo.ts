export interface Aresta {
    peso: number;
    vertice: Vertice;
}

export class Vertice {
    public nome: string;
    public arestas: Aresta[];

    constructor(nome: string) {
        this.nome = nome;
        this.arestas = [];
    }

    criarAresta(peso: number, vertice: Vertice) {
        // cria uma ligacao do A para o B
        this.arestas.push({
            peso,
            vertice,
        });
        // cria uma ligacao igual do B para o A
        vertice.arestas.push({
            peso,
            vertice: this,
        });
    }

}
