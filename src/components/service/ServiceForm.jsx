import styles from '../project/ProjectForm.module.css'
import {useState} from 'react'
import Input from '../form/Input'
import SubmitButton from '../form/SubmitButton'

//Adição de serviços nos projetos. Propriedades passadas no Project.jsx

function ServiceForm({handleSubmit, btnText, projectData}) {
   const [service, setService] = useState({})

   function submit(e) {
    e.preventDefault()
    projectData.services.push(service) //posso ter mais de um serviço em cada projeto, serão inseridos serviços alterando o objeto original do projeto
    handleSubmit(projectData)           //manipulo os dados do pojeto, adicionando serviços, e por fim coloco o projeto todo onde será lidado, no createService() de Project.jsx
}

   function handleChange(e) {
    setService({...service, [e.target.name]: e.target.value})  //para preencher o serviço: spread para pegar o objeto atual; e.target.name vai se tornar um dos "name"; o e.target.value vai virar um valor quando altera-se o handleChange
   }
   
    return(
        <form onSubmit={submit} className={styles.form}>
            <Input
                type="text"
                text="Nome do serviço"
                name="name"
                placeholder="Insira o nome do serviço"
                handleOnChange={handleChange}
            />

            <Input
                type="number"
                text="Custo do serviço"
                name="cost"
                placeholder="Insira o valor total"
                handleOnChange={handleChange}
            />

            <Input
                type="text"
                text="Descrição do serviço"
                name="description"
                placeholder="Descreva o serviço"
                handleOnChange={handleChange}
            />

            <SubmitButton text={btnText} />

        </form>
    )
}

export default ServiceForm