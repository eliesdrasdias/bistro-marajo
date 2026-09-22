import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

interface PratoJson {
  nome: string;
  descricao: string;
  preco: number;
  turno: string[];
  categoria: string;
  imagem: string;
  pratoDoDia: boolean;
}

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL ?? "",
});
const prisma = new PrismaClient({ adapter });

const diretorioAtual = dirname(fileURLToPath(import.meta.url));
const caminhoDosDados = resolve(
  diretorioAtual,
  "../../frontend/js/dados.json",
);

function ehPratoJson(valor: unknown): valor is PratoJson {
  if (typeof valor !== "object" || valor === null) {
    return false;
  }

  const prato = valor as Record<string, unknown>;

  return (
    typeof prato.nome === "string" &&
    typeof prato.descricao === "string" &&
    typeof prato.preco === "number" &&
    Number.isFinite(prato.preco) &&
    Array.isArray(prato.turno) &&
    prato.turno.every((turno) => typeof turno === "string") &&
    typeof prato.categoria === "string" &&
    typeof prato.imagem === "string" &&
    typeof prato.pratoDoDia === "boolean"
  );
}

function carregarPratos(): PratoJson[] {
  const conteudo = readFileSync(caminhoDosDados, "utf8");
  const dados: unknown = JSON.parse(conteudo);

  if (!Array.isArray(dados) || !dados.every(ehPratoJson)) {
    throw new Error(`O arquivo ${caminhoDosDados} possui um formato inválido.`);
  }

  return dados;
}

function agruparPorCategoria(pratos: PratoJson[]): Map<string, PratoJson[]> {
  const grupos = new Map<string, PratoJson[]>();

  for (const prato of pratos) {
    const pratosDaCategoria = grupos.get(prato.categoria) ?? [];
    pratosDaCategoria.push(prato);
    grupos.set(prato.categoria, pratosDaCategoria);
  }

  return grupos;
}

async function main(): Promise<void> {
  if (!process.env.DATABASE_URL) {
    throw new Error("A variável de ambiente DATABASE_URL não foi definida.");
  }

  const pratos = carregarPratos();
  const pratosPorCategoria = agruparPorCategoria(pratos);

  await prisma.$transaction(async (tx) => {
    // A tabela dependente deve ser limpa antes da tabela pai por causa da FK.
    await tx.prato.deleteMany();
    await tx.categoria.deleteMany();

    for (const [nome, pratosDaCategoria] of pratosPorCategoria) {
      await tx.categoria.create({
        data: {
          nome,
          pratos: {
            create: pratosDaCategoria.map((prato) => ({
              nome: prato.nome,
              descricao: prato.descricao,
              preco: prato.preco,
              turnos: prato.turno,
              imagem: prato.imagem,
              pratoDoDia: prato.pratoDoDia,
            })),
          },
        },
      });
    }
  });

  console.log(
    `Seed concluído: ${pratosPorCategoria.size} categorias e ${pratos.length} pratos inseridos.`,
  );
}

main()
  .catch((erro: unknown) => {
    console.error("Erro ao popular o banco de dados:", erro);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
