import styles from './Message.module.css'
import {useState, useEffect} from 'react'

function Message ({type, msg}) {           /*type: mensagem de sucesso, erro*/
    
const [visible, setVisible] = useState(false)    //fazer com que a msg suma de acordo com determinada condição (neste caso, 3s após sua exibição)

useEffect(() => {

    if(!msg) {
        setVisible(false)
        return
    }

    setVisible(true)

    const timer = setTimeout(() =>{
        setVisible(false)
    }, 3000)

    return () => clearTimeout(timer)

}, [msg])

//uso de Fragments para criar uma condicional
return (
        <>
            {visible && (
                <div className={`${styles.message} ${styles[type]}`}>{msg}</div>
            )}
        </>
    )
}

export default Message