/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate, useParams } from "react-router-dom";
import CardTemas from "../cardtemas/CardTemas";
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../../context/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
import { DNA, RotatingLines } from "react-loader-spinner";

function ListaTemas() {

  const navigate = useNavigate();

  const [temas, setTemas] = useState<Tema[]>([])

  const [descricaob, setDescricaob] = useState<Tema>({} as Tema)
  const [isLoading, setIsLoading] = useState<boolean>(false)

const [botao, setBotao] = useState(false);

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  async function buscarTemas() {
    try {
      await buscar('/temas', setTemas, {
        headers: { Authorization: token }
      })

    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  useEffect(() => {
    if (token === '') {
      alert('Você precisa estar logado!')
      navigate('/')
    }
  }, [token])

  useEffect(() => {
    buscarTemas()
  }, [temas.length])

  const { busca } = useParams<{ busca: string }>();

  async function buscarPorDescricao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    try {
      await buscar(`/temas/descricao/${busca}`, setDescricaob, {
        headers: { Authorization: token }
      })
      if (setDescricaob.length === 0) {
        <p>Hmmm... isso aí não tem</p>
      }
    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }

    setIsLoading(false)
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setDescricaob({
      ...descricaob,
      [e.target.name]: e.target.value
    })
  }


  return (
    <>
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
          <button onClick={() => setBotao(true)}
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


      {CardTemas.length === 0 && (
        <DNA
          visible={true}
          height="200"
          width="200"
          ariaLabel="dna-loading"
          wrapperStyle={{}}
          wrapperClass="dna-wrapper mx-auto"
        />
      )}

      if (botao) 
        <div className='w-full m-4'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {descricaob.map((descricaob) => (
            <CardTemas key={descricaob.id} tema={descricaob} />
          ))}
        </div>
      </div>

      <div className='w-full m-4'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {temas.map((tema) => (
            <CardTemas key={tema.id} tema={tema} />
          ))}

        </div>
      </div>
    </>
  )
}

export default ListaTemas;