/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import CardTemas from "../cardtemas/CardTemas";
import { useContext, useEffect, useState, type ChangeEvent } from "react";
import { AuthContext } from "../../../context/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
import { DNA, RotatingLines } from "react-loader-spinner";

function ListaTemas() {

  const navigate = useNavigate(); //uso pra redirecionar usuário se não tiver token

  const [temas, setTemas] = useState<Tema[]>([]) //variável para receber todos os temas
  const [temasFiltrados, setTemasFiltrados] = useState<Tema[]>([]); //variável para receber temas do filtro/barra de busca

  const [descricaob, setDescricaob] = useState<string>(''); //armazena caracteres da busca
  //useParams pra qnd preciso ler url do navegador pra fazer verificação, aqui já to enviando na barra de pesquisa por isso usa o useState

  const [isLoading, setIsLoading] = useState<boolean>(false) //verifica se elementos estão sendo carregados

  //const [botao, setBotao] = useState(false);
  const [botaoBuscar, setbotaoBuscar] = useState<boolean>(false)

  const { usuario, handleLogout } = useContext(AuthContext) //preciso trazer o token do usuario
  const token = usuario.token //armazeno token

  async function buscarTemas() {
    try {
      await buscar('/temas', setTemas, {
        headers: { Authorization: token }
      }) //traz todos os temas do caminho

    } catch (error: any) {
      if (error.toString().includes('401')) {
        handleLogout()
      }
    }
  }

  useEffect(() => {
    if (token === '') {
      alert('Você precisa estar logado!')
      navigate('/')  //efetivamente redireciona usuário q não tiver token, dispara
    }
  }, [token])

  useEffect(() => {
    buscarTemas()
  }, []) //chama função para buscar todos os temas e a diaspara

  // let msg: string = ''
  // const [msg, setMsg] = useState('hidden')

  async function buscarPorDescricao(e: ChangeEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true) //avisa que elementos estão sendo carregados
    console.log(descricaob);
    // if (setDescricaob.length === 0) {
    //   <p>Hmmm... isso aí não tem</p> }

    try {
      if (descricaob.length > 0) {
        await buscar(`/temas/descricao/${descricaob}`, setTemasFiltrados, { //adiciona termo pesquisado ao url e coloca resultado no set
          headers: { Authorization: token },
        });
        // if (temasFiltrados.length === 0) {
        //   setMsg('red');
        // }
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
    setIsLoading(false) //informa que já carregou pro loading sair
  }

  //Versão abaixo funcionaria no forms pq monitora vários campos e precisa salvar o próximo sem perder dados, então vai criando cópias do array e adicionando
  // function atualizarEstado(e: ChangeEvent<HTMLInputElement>) {
  //   setDescricaob({
  //     ...descricaob,
  //     [e.target.name]: e.target.value
  //   })
  // }

  //como aqui é um campo apenas que recebe, já coloco direto:
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


            {/* verifica estado e exibe loading na tela enquanto formulário é enviado */}
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

      {/* exibe loading na tela enquanto temas não chegam */}
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

          {/* fazer o disparo com o botao de busca e colocar um if ternario envolta pra se clicar exibe filtro ou se der erro exibe setMsg
          nao é fazer coisa nova é implementar isso aqui */  }
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