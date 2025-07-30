import { Link } from "react-router-dom";

function CardTemas() {
  return (
    <div className='rounded-2xl overflow-hidden'>
      <h2 className='py-2 px-6 bg-indigo-800 text-white font-bold'>Tema</h2>
      <p className='p-8 text-3x1 bg-slate-200'>Descrição</p>
      <div className='flex'>
        <Link to=''
        className='w-full bg-indigo-400 hover:bg-indigo-800  text-white flex items-center justify-center py-2'>
          <button>Editar</button>
        </Link>

        <Link to=''
        className='w-full bg-red-400 hover:bg-red-800 text-white flex items-center justify-center py-2' >
          <button>Deletar</button>
        </Link>
      </div>
    </div>
  )
}

export default CardTemas