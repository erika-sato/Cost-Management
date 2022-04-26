import Message from "../layout/Message"
import {useLocation} from 'react-router-dom'
import styles from './Projects.module.css'
import Container from '../layout/Container'
import LinkButton from '../layout/LinkButton'
import ProjectCard from "../project/ProjectCard"
import {useState, useEffect} from 'react'
import Loading from "../layout/Loading"

function Projects () {

const [projects, setProjects] = useState([])
const [removeLoading, setRemoveLoading] = useState(false)
const [projectMessage, setProjectMessage] = useState('')

const location = useLocation()    //por meio desse hook, consigo acessar a msg que está em Message.jsx
let message = ''            
if (location.state) {               //se tiver algo no location state, verifico se existe message, então acesso o message e atribuo valor à essa variável
    message = location.state.message
}

useEffect(() => {
  setTimeout(() => {
    fetch('http://localhost:5000/projects', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    })
    .then((resp) => resp.json())
    .then((data) => {
       console.log(data);
        setProjects(data)
        setRemoveLoading(true)

    })
    .catch((err) => console.log(err))
  }, 300) //colocando setTimeOut somente para verificarmos funcionamento do Loading
}, [])

function removeProject(id) {
    fetch(`http://localhost:5000/projects/${id}`, {
    method: 'DELETE',
    headers: {
        'Content-Type': 'application/json',
    }, 
})
.then((resp) => resp.json())
.then(() => {
    setProjects(projects.filter((project) => project.id !== id))     //filter vai percorrer pelos projetos, e eliminar apenas aquele que possui o id desejado.
    setProjectMessage('Projeto removido com sucesso!')
})
.catch((err) => console.log(err))
}

    return (
        <div className={styles.project_container}>   
            <div className={styles.title_container}>
        <h1>Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
            </div>
        {message && <Message type="success" msg={message} />} {/*Se o message está preenchido, imprimo esta msg dinâmica, e se veio desta maneira, sempre será success*/}
        {projectMessage && <Message type="success" msg={projectMessage} />}
        <Container customClass="start">
            {projects.length > 0 &&                /*verificando se existe algum projeto && se sim, faremos map, transformando o dado em project, e faremos o loop */
            projects.map((project) => (
                <ProjectCard 
                name={project.name}
                id={project.id}
                budget={project.budget}
                category={project.category.name}
                key={project.id} 
                handleRemove={removeProject}
                />
            )
            )}

        {!removeLoading && <Loading />}
        {removeLoading && projects.length === 0 && (
            <p>Não há projetos cadastrados!</p>
        )}

        </Container>
        </div>
    )
}

export default Projects