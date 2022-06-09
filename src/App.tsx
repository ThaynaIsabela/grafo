import React, { useState } from 'react';
import modelo from './assets/modelo.png';
import './App.css';
import { Vertice, Aresta } from './grafo';

interface Desdobramento {
    caminho: string;
    peso: number;
    ultimoVertice: Vertice;
    fechado: boolean;
}

function calculaRota(inicio: Vertice, caminhos: Vertice[] = [], pesoAcumulado: number = 0): Desdobramento[] {
    const verticesPercorridos = [...caminhos, inicio];
    const desdobramentos: Desdobramento[] = [];

    inicio.arestas.forEach((aresta) => {
        if (!caminhos.includes(aresta.vertice)) {
            // console.log('Testando caminho: ', inicio.nome, aresta.vertice.nome, aresta.peso);
            const pesoAcumuladoPercorrido = pesoAcumulado + aresta.peso;
            const subCaminho = calculaRota(aresta.vertice, verticesPercorridos, pesoAcumuladoPercorrido);
            desdobramentos.push(...subCaminho);
        }
    });

    // achei a ponta, ou seja, o ultimo vertice (antes de voltar ao inicio)
    if (desdobramentos.length === 0) {
        const caminho = verticesPercorridos.map((vertice) => vertice.nome).join(',');
        return [
            {
                caminho,
                peso: pesoAcumulado,
                ultimoVertice: inicio,
                fechado: false,
            },
        ];
    }

    // neste caso estamos no vertice inicial (com a soma de todos os resultados)
    if (pesoAcumulado === 0) {
        return desdobramentos.map((subCaminho) => {
            const arestaFinal = subCaminho.ultimoVertice.arestas.find((aresta) => aresta.vertice === inicio) as Aresta;
            return {
                caminho: arestaFinal ? `${subCaminho.caminho},${inicio.nome}` : subCaminho.caminho,
                peso: arestaFinal ? subCaminho.peso + arestaFinal.peso : subCaminho.peso,
                ultimoVertice: subCaminho.ultimoVertice,
                fechado: typeof arestaFinal === 'object',
            };
        });
    }

    // caminhos intermediarios (construindo um caminho)
    return desdobramentos.map((subCaminho) => ({
        caminho: subCaminho.caminho,
        peso: subCaminho.peso,
        ultimoVertice: subCaminho.ultimoVertice,
        fechado: false,
    }));
}

function App() {
    const [caminho, setCaminho] = useState<null | Desdobramento>(null);

    const resolver = () => {
        const A = new Vertice('A');
        const B = new Vertice('B');
        const C = new Vertice('C');
        const D = new Vertice('D');

        A.criarAresta(25, B);
        A.criarAresta(10, C);
        A.criarAresta(15, D);
        B.criarAresta(10, C);
        B.criarAresta(45, D);
        C.criarAresta(5, D);

        // ponto de partida da solucao é o Vertice "A" (poderia ser outro)
        const caminhos = calculaRota(A);
        caminhos.sort((a, b) => {
            if (a.peso > b.peso) return 1;
            if (a.peso < b.peso) return -1;
            return 0;
        });

        const caminhosCompletos = caminhos.filter((caminho) => caminho.fechado === true);
        if (caminhosCompletos.length > 0)
            setCaminho(caminhosCompletos[0]);

        console.log('Todos os caminhos:', caminhos);
        console.log('Apenas os caminhos completos:', caminhosCompletos);
    };

    return (
        <div className="App">
            <p>Modelo do grafo a ser resolvido:</p>
            <img src={modelo} className="App-logo" alt="logo" />
            <button className="btnResolver" onClick={() => resolver()}>
                Resolver!
            </button>
            {caminho && (
                <p>
                    Melhor caminho: {caminho.caminho}, com peso: {caminho.peso}
                </p>
            )}
        </div>
    );
}

export default App;
