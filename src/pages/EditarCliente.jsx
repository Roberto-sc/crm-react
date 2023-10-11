import { obtenerCliente,actualizarCliente } from "../data/clientes"
import { useNavigate,Form,useLoaderData,useActionData,redirect} from "react-router-dom"
import Formulario from "../components/Formulario";
import Error from "../components/Error";



export async function loader({params}){
   
    const cliente = await obtenerCliente(params.clienteId)

    if(Object.values(cliente).length === 0){
        throw new Response('',{
            status:404,
            statusText: 'No hay resultados'
        })
    }

    return cliente
}

export async function action(request,params){

  const formData = await request.formData()
  
  const datos = Object.fromEntries(formData)
 
  const email = formData.get('email');

  
  //Validacion

  const errores = []

  if(Object.values(datos).includes('')){
      errores.push('Todos los campos son obligatorios')
  }
  let regex = new RegExp("([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\"\(\[\]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(\.[!#-'*+/-9=?A-Z^-~-]+)*|\[[\t -Z^-~]*])");

  if(!regex.test(email)){
    errores.push('El Email no es válido')
  }
  //retornar con errores
  if(Object.keys(errores).length){
    return errores;
  }


  //Actualizar el cliente
  await actualizarCliente(params.clienteID,datos)

  return redirect('/');
}

function EditarCliente() {

  const navigate = useNavigate();
  const cliente = useLoaderData();
  const errores = useActionData()

  console.log(errores)

  return (
    <>
          <h1 className="text-4xl font-black text-blue-900"> Ediar Cliente</h1>
          <p className="mt-3"> Acontinuación podrás modificiar los datos de un cliente </p>

          <div className="flex justify-end">
            <button className="bg-blue-800 uppercase font-bold text-white px-3 py-1"
            onClick={() => navigate(-1)}>
              Volver
            </button>
          </div>


          <div className="bg-white shadow rounded-md md:w-3/4 mx-auto px-5 py-10 mt-20">

            {errores?.length && errores.map((error,i) => 
            <Error key={i}>
              {error}
            </Error>
                
            
            )
            
            }
            
            <Form
              method='post'
              noValidate
            >
              <Formulario
                cliente={cliente}
              />

              <input
              type="submit"
              className="bg-blue-800 mt-5 w-full p-3 uppercase text-white text-lg font-bold"
              value="Actualizar Cliente"
              />

            </Form>

          </div>

    </>
  )
}

export default EditarCliente