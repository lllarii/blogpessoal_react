import { useNavigate } from "react-router-dom";
import CardTemas from "../cardtemas/CardTemas";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import type Tema from "../../../models/Tema";
import { buscar } from "../../../services/Service";
import { DNA } from "react-loader-spinner";

function ListaTemas() {

  const navigate = useNavigate();

  const [temas, setTemas] = useState<Tema[]>([])

  const { usuario, handleLogout } = useContext(AuthContext)
  const token = usuario.token

  async function buscarTemas() {
    try {
      await buscar('/temas', setTemas, {
        headers: { Authorization: token }
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  return (
    <>
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
          {temas.map((tema) => (
            <CardTemas key={tema.id} tema={tema} />
          ))}
        </div>
      </div>
    </>
  )
}

export default ListaTemas;