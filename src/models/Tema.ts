import type Postagem from "./Postagem.ts";

export default interface Tema {
    id: number;
    descricao: string;
    postagem?: Postagem[] | null;
}