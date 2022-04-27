import { Header } from '../components/Header'
import '../styles/global.scss'
import styles from '../styles/App.module.scss'
import { Player } from '../components/Player'
import { PlayerContextProvider} from '../contexts/Playercontext'

function MyApp({ Component, pageProps }) {

  
  return (
    <PlayerContextProvider>
      <div className={styles.wrapper}>
        <main>
          <Header></Header>
          <Component {...pageProps} />
        </main>
        <Player></Player>
      </div>
   </PlayerContextProvider>
  )
}

export default MyApp
