import styles from './Container.module.css'

function Container (props) {
    return (
        <div className={`${styles.container} ${styles[props.customClass]}`}>  {/*este segundo styles é da classe vinda das propriedades, enviada quando necessária e chamada*/}
            {props.children}        
        </div>
    )

    }


export default Container

 //props.children irá direcionar onde o conteúdo (que está abrigado dentro do Container)será exibido, ou seja, o Routes e os Links que estão dentro do Container (sendo seus filhos), serão abrigados dentro dessa div
  //portanto deve ser usada toda vez que encapsular algo usando componentes (tags)