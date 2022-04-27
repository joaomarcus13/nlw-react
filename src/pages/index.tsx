import { GetStaticProps } from 'next'
import { api } from '../services/api'
import { format, parseISO } from 'date-fns'
import ptBR from 'date-fns/locale/pt-BR'
import { convertDurationTimeString } from '../utils/convertToTimeString'
import styles from './home.module.scss'
import Image from 'next/image'
import Link from 'next/link'
import {  usePlayer } from '../contexts/Playercontext'
import Head from 'next/head'

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  description: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  url: string;
}

type HomeProps = {
  latestEpisodes: Episode[];
  allEpisodes: Episode[];
}

export default function Home({ latestEpisodes, allEpisodes }: HomeProps) {


  const {playList} = usePlayer()


  console.log('home')

  const episodeList = [...latestEpisodes,...allEpisodes];

  return (
    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos lancamentos</h2>
        <ul>
          {
            latestEpisodes.map((e,index) => {
              return (
                <li key={e.id}>
                  <Image
                    width={192}
                    height={192}
                    src={e.thumbnail}
                    alt={e.title}
                    objectFit='cover' />
                  <div className={styles.episodeDetails}>
                    <Link href={`/episode/${e.id}`}>
                      <a  >{e.title}</a>
                    </Link>
                    <p>{e.members}</p>
                    <span>{e.publishedAt}</span>
                    <span>{e.durationAsString}</span>
                  </div>
                  <button type='button' onClick={()=>{playList(episodeList,index)}}>
                    <img src="/play-green.svg" alt="tocar episodio" />
                  </button>
                </li>
              )
            })
          }
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos Episodios</h2>
        <table cellSpacing={0}>
          <thead>
            <tr>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duracao</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {
              allEpisodes.map((e,index) => {
                return (
                  <tr key={e.id}>
                    <td style={{ width: 80 }}>
                      <Image
                        width={120}
                        height={120}
                        src={e.thumbnail}
                        alt={e.title}
                        objectFit='cover'
                      ></Image>
                    </td>
                    <td>
                      <Link href={`/episode/${e.id}`}>
                      <a >{e.title}</a>
                      </Link>
                    </td>
                    <td>{e.members}</td>
                    <td style={{ width: 100 }}>{e.publishedAt}</td>
                    <td>{e.durationAsString}</td>
                    <td>
                      <button type='button' onClick={()=>{playList(episodeList,index+latestEpisodes.length)}}>
                        <img src='/play-green.svg' alt="tocar episodio" />
                      </button>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </section>
    </div>
  )
}


//static side generation
export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at,',
      _order: 'desc'
    }
  })

  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: convertDurationTimeString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    }
  })


  const latestEpisodes = episodes.slice(0, 2)
  const allEpisodes = episodes.slice(2, episodes.length)
  return {
    props: {
      latestEpisodes,
      allEpisodes
    },
    revalidate: 60 * 60 * 8,
  }
}