import styles from './LinkButton.module.css'
import { Link } from 'react-router-dom'

function LinkButton ({to, text}) {
    return (
        <Link className={styles.btn} to={to}>
            {text}
        </Link>
    )
}

export default LinkButton

//prop to: para onde eu vou ao clicar (especificada lá na Home.jsx)
//prop text: baseado em onde irei utilizá-lo,será um texto dinâmico pq irei utilizar em outras pages