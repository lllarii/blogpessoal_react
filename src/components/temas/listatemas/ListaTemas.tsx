/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import CardTemas from "../cardtemas/CardTemas";
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../../context/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
import { DNA, RotatingLines } from "react-loader-spinner";
import { ToastAlerta } from "../../../utils/ToastAlerta";

function ListaTemas() {

  const navigate = useNavigate(); 
  const [temas, setTemas] = useState<Tema[]>([]) 
  const [temasFiltrados, setTemasFiltrados] = useState<Tema[]>([]); 
  const [descricaob, setDescricaob] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(false) 
  const [botaoBuscar, setbotaoBuscar] = useState<boolean>(false)
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
      ToastAlerta('Você precisa estar logado!', 'info')
      navigate('/')  
    }
  }, [token])

  useEffect(() => {
    buscarTemas()
  }, []) 

  async function buscarPorDescricao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true) 
    console.log(descricaob);


    try {
      if (descricaob.length > 0) {
        await buscar(`/temas/descricao/${descricaob}`, setTemasFiltrados, { //adiciona termo pesquisado ao url e coloca resultado no set
          headers: { Authorization: token },
        });

      } else {
        setTemasFiltrados([])
        await buscar('/temas', setTemas, {
          headers: { Authorization: token },
        });
      }
    }
    catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
    console.log(temasFiltrados);
    setIsLoading(false)
  }

  function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
    setDescricaob(e.target.value);
    console.log(descricaob);
  }

  function botao() {
    setbotaoBuscar(true)
  }

  function voltar() {
    setbotaoBuscar(false)
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
              value={descricaob}
              onChange={(e: ChangeEvent<HTMLInputElement>) => atualizarEstado(e)}
            />
          </div>
          <button
            className="rounded text-slate-100 bg-indigo-400 
                                   hover:bg-indigo-800 w-1/2 py-2 mx-auto flex justify-center"
            type="submit" onClick={botao}>

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

      <div className='w-full m-4'>
        <div className='container mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>

          {botaoBuscar ?
            (
              temasFiltrados.length === 0
                ? <div className='col-span-full text-center justify-center'>
                  <p className='text-black font-bold w-full text-[1.4rem]'>Hmmm... isso aí não tem</p>
                  <button className="rounded text-slate-100 bg-indigo-400 
                                   hover:bg-indigo-800 w-1/8 py-2 my-8 mx-auto flex justify-center" onClick={voltar}>voltar</button>
                </div>
                : temasFiltrados.map((tema) => <CardTemas key={tema.id} tema={tema} />)

            )
            : temas.map((tema) => <CardTemas key={tema.id} tema={tema} />)}


        </div>
      </div>
    </>
  )
}

export default ListaTemas;