import ProjectForm from '../project/ProjectForm'
import styles from './NewProject.module.css'
import {useNavigate} from 'react-router-dom'

function NewProject () {
    const navigate = useNavigate()

    function createPost(project) {
        //initialize cost and services. Neste caso fica aqui, mas num caso real, colocaria no back-end
        project.cost = 0
        project.services = []       
        
        fetch("http://localhost:5000/projects" , {
            method: 'POST',                          /*Farei envio de formulário */
            headers: {
                'Content-type' : 'application/json',
            },

            body: JSON.stringify(project),            //Mandar os dados para servidor, colocando-os no body, no formato string, por meio do POST, fazendo a rota do localhost:5000

        })
        .then((resp) => resp.json())
        .then((data) => {
            console.log(data)
            navigate('/projects', {state:{message: 'Projeto criado com sucesso!'}})
        })  
        
    }

    return (
        <div className={styles.newproject_container}>
            <h1>Criar Projeto</h1>
            <p>Crie seu projeto para depois adicionar os serviços</p>
            <ProjectForm handleSubmit={createPost} btnText="Criar Projeto"/>   {/*handleSubmit: usada para tratar o envio do formulário e capturar os dados preenchidos */}
        </div>
    )
}

export default NewProject