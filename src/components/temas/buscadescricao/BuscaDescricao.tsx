/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
import { RotatingLines } from "react-loader-spinner";
import { AuthContext } from "../../../context/AuthContext";



function BuscaDescricao() {

  const navigate = useNavigate();

  const [descricao, setDescricao] = useState<Tema>({} as Tema)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  const { busca } = useParams<{ busca: string }>();

  async function buscarPorDescricao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await buscar(`/temas/${busca}`, setDescricao, {
        headers: { Authorization: token }
      })
      if (setDescricao.length === 0) {
        <p>Hmmm... isso aí não tem</p>
      }
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }

    setIsLoading(false)
  }

  useEffect(() => {
    if (token === '') {
      alert('Você precisa estar logado!')
      navigate('/')
    }
  }, [token])


  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setDescricao({
      ...descricao,
      [e.target.name]: e.target.value
    })
  }


  return (
    <div className="container flex flex-col items-center justify-center mx-auto">
      <h1 className="text-4xl text-center my-8">
        Galeria de temas
      </h1>

      <form className="w-1/2 flex flex-col gap-4" onSubmit={buscarPorDescricao}>
        <div className="flex flex-col gap-2">
          <label htmlFor="descricao">Descrição do Tema</label>
          <input
            type="text"
            placeholder="Descreva aqui seu tema"
            name='descricao'
            className="border-2 border-slate-700 rounded p-2"
            value={busca}
            onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
          />
        </div>
        <button
          className="rounded text-slate-100 bg-indigo-400 
                               hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center"
          type="submit">
          {isLoading ?
            <RotatingLines
              strokeColor="white"
              strokeWidth="5"
              animationDuration="0.75"
              width="24"
              visible={true}
            /> :
            <span>Buscar</span>

          }
        </button>
      </form>
    </div>
  );
}

export default BuscaDescricao;