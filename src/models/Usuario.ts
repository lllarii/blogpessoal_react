import type Postagem from "./Postagem.ts";

export default interface Usuario {
  id: number;
  nome: string;
  usuario: string;
  senha: string;
  foto: string;
  postagem?: Postagem[] | null;
}