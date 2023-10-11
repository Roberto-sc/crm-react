import { useNavigate,Form, useActionData,redirect } from "react-router-dom"
import Formulario from "../components/Formulario";
import Error from "../components/Error";
import {agregarCliente} from "../data/clientes"

export async function action({request}){
  
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

  await agregarCliente(datos)



  return redirect('/');

}

function NuevoCliente() {

  const errores = useActionData();
  

  const navigate = useNavigate();
  return (
    <>
          <h1 className="text-4xl font-black text-blue-900"> Nuevo Cliente</h1>
          <p className="mt-3"> Llena todos los campos para registrar un nuevo cliente </p>

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
              <Formulario/>

              <input
              type="submit"
              className="bg-blue-800 mt-5 w-full p-3 uppercase text-white text-lg font-bold"
              value="Registrar Cliente"
              />

            </Form>

          </div>

    </>
  )
}

export default NuevoCliente