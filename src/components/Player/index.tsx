import { useEffect, useRef, useState } from 'react'
import {  usePlayer } from '../../contexts/Playercontext'
import styles from './styles.module.scss'
import Image from 'next/image'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { convertDurationTimeString } from '../../utils/convertToTimeString'

export function Player() {

    const [progress,setProgress] = useState(0)

    const {
        episodeList,
        currentEpisodeIndex,
        isPlaying,
        togglePlay,
        setPlayingState,
        playNext,
        playPrevious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        toggleShuffle,
        isShuffling,
        clearPlayerState
    } = usePlayer()

    const audioRef = useRef<HTMLAudioElement>(null)

    const episode = episodeList[currentEpisodeIndex]

    console.log('player')

    function setUpProgressListener(){
        audioRef.current.currentTime = 0
        console.log(progress)
        audioRef.current.addEventListener('timeupdate',e=>{
            setProgress(Math.floor(audioRef.current.currentTime))
        })
    }

    function handleSeek(amount:number){
        audioRef.current.currentTime = amount
        setProgress(amount)
    }

    function handleEpisodeEnded(){
        if(hasNext){ 
            playNext()
        }else{
            clearPlayerState()
        }
    }

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()

            }
        }

    }, [isPlaying])


    return (
        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="tocando agora" />
                <strong>Tocando agora</strong>
            </header>

            {
                episode ? (
                    <div className={styles.currentEpisode}>
                        <Image
                            width={192}
                            height={192}
                            src={episode.thumbnail}
                            objectFit='cover'
                        ></Image>
                        <strong>{episode.title}</strong>
                        <span>{episode.members}</span>
                    </div>
                ) : (
                    <div className={styles.emptyPlayer}>
                        <strong>
                            Selecione um podcast para ouvir
                        </strong>
                    </div>
                )
            }



            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span>{convertDurationTimeString(progress)}</span>
                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#84d361' }}
                                railStyle={{ backgroundColor: '#9f75ff' }}
                                handleStyle={{ backgroundColor: '#84d361', borderWidth: 4 }}
                            ></Slider>
                        ) : (<div className={styles.emptySlider}></div>)}

                    </div>

                    <span>{convertDurationTimeString(episode?.duration ?? 0)}</span>
                </div>


                {
                    episode && (
                        <audio
                            src={episode.url}
                            autoPlay
                            onEnded={handleEpisodeEnded}
                            onLoadedMetadata={setUpProgressListener}
                            ref={audioRef}
                            loop={isLooping}
                            onPlay={() => { setPlayingState(true) }}
                            onPause={() => { setPlayingState(false) }}>

                        </audio>
                    )
                }


                <div className={styles.buttons}>
                    <button 
                    type='button' 
                    onClick={toggleShuffle}
                    className={isShuffling?styles.isActive:''}
                    disabled={!episode || episodeList.length==1}>
                        <img src="/shuffle.svg" alt="embaralhar" />
                    </button>
                    <button 
                    type='button' 
                    onClick={playPrevious} 
                    disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="tocar anterior" />
                    </button>
                    <button 
                    type='button' 
                    className={styles.playButton} 
                    disabled={!episode} 
                    onClick={togglePlay}>
                        {
                            isPlaying ? <img src="/pause.svg" alt="tocar" /> : <img src="/play.svg" alt="tocar" />
                        }

                    </button>
                    <button 
                    type='button' 
                    onClick={playNext} 
                    disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="tocar proxima" />
                    </button>
                    <button 
                    type='button' 
                    disabled={!episode}
                    onClick={toggleLoop}
                    className={isLooping?styles.isActive:''}>
                        <img src="/repeat.svg" alt="repetir" />
                    </button>
                </div>
            </footer>
        </div>
    )
}