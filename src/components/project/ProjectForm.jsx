import {useState, useEffect} from 'react'

import styles from './ProjectForm.module.css'
import Input from  '../form/Input'
import Select from '../form/Select'
import SubmitButton from '../form/SubmitButton'


function ProjectForm ({handleSubmit, btnText, projectData}) {
    const [categories, setCategories] = useState([])
    const [project, setProject] = useState(projectData || {}) //quando enviar projetos para edição, preciso passar pela pág pai, preciso verificar se esse dados vêm, para reiniciá-los ou não. Estes podem ser dados já passados OU obj vazio 

    useEffect(() => {                                     {/*useEffect para evitar um loop infinito de requisições */}
        fetch('http://localhost:5000/categories', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((resp) => resp.json())             //pegando a resposta e transformando em json
          .then((data) => { setCategories(data)})   //pegando dados em json e colocando no valor do hook de setCategories
          .catch((err) => console.log(err))
    }, [])

    const submit = (e) => {
        e.preventDefault()
       // console.log(project)
        handleSubmit(project)                         //executo o método que for passado pela prop, e passo o project que está cadastrado no formulário como argumento
    }

    function handleChange(e) {
        setProject({...project, [e.target.name]: e.target.value})
        console.log(project)
    }

    function handleCategory(e) {
        setProject({
            ...project, 
            category: {
            id: e.target.value,                                     //criando um objeto de categoria com o id da categoria e o nome dela (linha abaixo)
            name: e.target.options[e.target.selectedIndex].text,  //através do index, consigo saber qual opção foi selecionada, para então acessar o text dela
        },})
    }

    return (
        <form onSubmit={submit} className={styles.form}>
            <Input 
            type="text" 
            text="Nome do projeto" 
            name="name" 
            placeholder="Insira o nome do projeto"
            handleOnChange={handleChange} 
            value={project.name}/>

            <Input
           type="number" 
           text="Orçamento do projeto" 
           name="budget" 
           placeholder="Insira o orçamento total"
           handleOnChange={handleChange}
           value={project.budget} />
            
           
            <Select 
            name="category_id" 
            text="Selecione a categoria" 
            options={categories} 
            handleOnChange={handleCategory}
            value={project.category ? project.category.id :''} />   {/* Se a categoria estiver preenchida, passo o id dela, senão passo vazio */}
           
           <SubmitButton text={btnText}/>  {/*Esse componente pode ter várias utilidades. Nesse caso vou criar um novo projeto, portanto puxei prop de NewProject.jsx */} 
        </form>
    )
}

export default ProjectForm