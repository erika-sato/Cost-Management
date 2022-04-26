import styles from './Project.module.css'
import {useParams} from 'react-router-dom'  //hook usado para pegar id que veio pela URL
import {useState, useEffect} from 'react'
import Loading from '../layout/Loading'
import Container from '../layout/Container'
import ProjectForm from '../project/ProjectForm'
import Message from '../layout/Message'
import ServiceForm from '../service/ServiceForm'
import {parse, v4 as uuidv4} from 'uuid'
import ServiceCard from '../service/ServiceCard'

function Project () {
    const {id} = useParams()
    const [project, setProject] = useState([])
    const [services, setServices] = useState([])
    const [showProjectForm, setShowProjectForm] = useState(false)
    const [showServiceForm, setShowServiceForm] = useState(false)
    const [message, setMessage] = useState()
    const [type, setType] = useState()          //tipo da mensagem a ser exibida

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)
            setServices(data.services)
        })
        .catch((err) => console.log(err))
        }, 300)
        
      }, [id])

      function editPost(project) {
        setMessage('')            //corrigindo um bug, que mostrava a msg de sucesso na atualização apenas 1x. agora aparecerá toda vez que realizarmos atualizações mesmo que repetidas vezes

        //budget validation 
        if(project.budget < project.cost) {
           setMessage('O orçamento não pode ser menor que o custo do projeto!')
           setType('error')
           return false      //dar stop nessa fç, pois neste caso o projeto não pode ser atualizado pq terá problemas
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',                               //PATCH só altera(atualiza) o que realmente mudar, ao contrário de UPDATE
            headers: {
                'Content-Type': 'application/json',        //para se comunicar em json com a API
            },
            body: JSON.stringify(project),                 //enviando o projeto como texto para atualizar o projeto
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(data)                               //alterando os dados do projetos com os dados que vieram para atualizá-lo
            setShowProjectForm(false)                       //esconder formuláio, já que terminei a edição
            setMessage('Projeto atualizado!')
            setType('success')
        })
        .catch((err) => console.log(err))
      }

      function createService(project) {                  //fç que fará um update nos projetos com a inserção de serviços
        setMessage('')
        //last service
        const lastService = project.services[ project.services.length -1 ]
      
        lastService.id = uuidv4()  //gera um id
       
        const lastServiceCost = lastService.cost  //custo do ultimo serviço
       
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost)  //newCost é o custo atual do projeto somado ao custo do ultimo serviço adicionado, resultando no valor total atualizado
       
        //maximum value validation
        if(newCost > parseFloat(project.budget)) {
            setMessage('Orçamento ultrapassado, verifique o valor do serviço')
            setType('error') //retorna um erro
            project.services.pop()  //remove o serviço de dentro do objeto do projeto. Isso evita que, caso um novo serviço seja inserido, este serviço errado seja inserido juntamente
            return false       //termina essa execução
        }

        // add service cost to project total cost
        project.cost = newCost   //valor atualizado do projeto

        //update project
        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(project)
        })
        .then((resp) => resp.json())
        .then((data) => {
            setShowServiceForm(false)
        })
        .catch((err) => console.log(err))

        }

      function removeService(id, cost) {
        setMessage('')
        const servicesUpdated = project.services.filter(             //atualização dos Serviços no front-end. O filter passará por todos os serviços e excluir apenas o que possui id igual ao que o usuário selecionou para exclusão
            (service) => service.id !== id
        )
        const projectUpdated = project                              //o projeto atualizado será igual ao project do state
        projectUpdated.services = servicesUpdated                   //atualizando o objeto com a remoção, de forma a enviá-lo corretamente depois para o back-end
        projectUpdated.cost = parseFloat(projectUpdated.cost) - parseFloat(cost)   //reduzindo o custo do Serviço do custo disponível do Projeto
    
        fetch(`http://localhost:5000/projects/${projectUpdated.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(projectUpdated)       //ou seja, o Projeto atualizado contém um serviço a menos (que excluí com auxílio do filter), e o custo atualizado
        })
        .then((resp) => resp.json())
        .then((data) => {
            setProject(projectUpdated)
            setServices(servicesUpdated)
            setMessage('Serviço removido com sucesso!')
        })
        .catch((err) => console.log(err))
    
    }


      function toggleProjectForm() {
        setShowProjectForm(!showProjectForm)
      }
    
      function toggleServiceForm() {
        setShowServiceForm(!showServiceForm)
      }

    return (
         <>
         {project.name ? (
            <div className={styles.project_details}>
            <Container customClass="column">
                {message && <Message type={type} msg={message} /> }
                <div className={styles.details_container}>
                    <h1>Projeto: {project.name}</h1>
                    <button className={styles.btn} onClick={toggleProjectForm}>
                        {!showProjectForm ? 'Editar projeto' : 'Fechar'}
                    </button>
                    {!showProjectForm ? (
                        <div className={styles.project_info}>

                            <p>
                                <span>Categoria:</span> {project.category.name}  {/*Acessando o nome da categoria que está no objeto armazenado no db.json */}
                            </p>
                        
                            <p>
                                <span>Total de Orçamento:</span> R${project.budget}
                            </p>
                            <p>
                                <span>Total Utilizado:</span> R${project.cost}
                            </p>
                        </div>

                        ) : (
                          <div className={styles.project_info}>
                              <ProjectForm 
                              handleSubmit={editPost} 
                              btnText="Concluir edição" 
                              projectData={project} />
                         </div>
                    )}
                </div>
                <div className={styles.service_form_container}>
                            <h2>Adicione um serviço:</h2>
                            <button className={styles.btn} onClick={toggleServiceForm}>
                                {!showServiceForm ? 'Adicionar serviço' : 'Fechar'}
                            </button>
                <div className={styles.project_info}>
                    {showServiceForm && (
                        <ServiceForm                     //propriedades passadas aqui para o Form que está em ServiceForm.jsx
                        handleSubmit={createService}
                        btnText="Adicionar serviço"
                        projectData={project}
                        />
                    )}
                </div>
                </div>
                <h2>Serviços</h2>
                <Container customClass="start">
                  {services.length > 0 &&
                  services.map((service) => (
                      <ServiceCard 
                        id={service.id}
                        name={service.name}
                        cost={service.cost}
                        description={service.description}
                        key={service.id}
                        handleRemove={removeService}
                      />
                  ))

                  }
                  {services.length === 0 && <p>Não há serviços cadastrados.</p>}
                </Container>
            </Container>
        </div>
         ) : (
     <Loading />
         )}   
         </>
    )  
}

export default Project