import { createContext, useState, ReactNode, useContext } from 'react'

type Episode = {
    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;
}

type PlayerContextData = {
    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (episode: Episode) => void;
    togglePlay: () => void;
    playNext: () => void;
    playPrevious: () => void;
    setPlayingState: (state: boolean) => void;
    playList:(list:Episode[],index:number)=> void;
    hasNext:boolean;
    hasPrevious:boolean;
    isLooping:boolean;
    toggleLoop:()=>void;
    isShuffling:boolean;
    toggleShuffle:()=>void;
    clearPlayerState:()=>void;
   
}


type PlayerContextProviderProps = {
    children: ReactNode;
}

export const PlayerContext = createContext({} as PlayerContextData)

export function PlayerContextProvider({ children }: PlayerContextProviderProps) {
    const [episodeList, setEpisodeList] = useState([])
    const [currentEpisodeIndex, setCurrentEpisodeIndex] = useState(0)
    const [isPlaying, setIsPlaying] = useState(false)
    const [isLooping,setIsLooping] = useState(false)
    const [isShuffling,setIsShuffling] = useState(false)

    console.log('context')

    function play(episode: Episode) {
        setEpisodeList([episode])
        setCurrentEpisodeIndex(0)
        setIsPlaying(true)
    }

    function playList(list:Episode[],index:number){
        setEpisodeList(list)
        setCurrentEpisodeIndex(index)
        setPlayingState(true)
    }

    function togglePlay() {
        setIsPlaying(!isPlaying)
    }

    function toggleLoop(){
    
        setIsLooping(!isLooping)
    }

    function toggleShuffle(){
        setIsShuffling(!isShuffling)
    }

    function setPlayingState(state: boolean) {
        setIsPlaying(state)
    }

    const hasPrevious = isShuffling?true:currentEpisodeIndex>0 
    const hasNext = isShuffling?true:(currentEpisodeIndex+1)<episodeList.length
    

    function playNext(){
        if(isShuffling){
            const nextRandom = Math.floor(Math.random()*episodeList.length)
            setCurrentEpisodeIndex(nextRandom)
        }else if(hasNext){
            setCurrentEpisodeIndex(currentEpisodeIndex+1)
        }
        
    }
    function playPrevious(){
        if(hasPrevious){
            setCurrentEpisodeIndex(currentEpisodeIndex-1)
        }
    }

    function clearPlayerState(){
        setEpisodeList([])
        setCurrentEpisodeIndex(0)
    }

    return (
        <PlayerContext.Provider
            value={{
                episodeList,
                currentEpisodeIndex,
                isPlaying,
                play,
                togglePlay,
                setPlayingState,
                playList,
                playNext,
                playPrevious,
                hasNext,
                hasPrevious,
                isLooping,
                toggleLoop,
                isShuffling,
                toggleShuffle,
                clearPlayerState
            }}>
            { children}
        </PlayerContext.Provider>
    )

}


export const usePlayer = ()=> useContext(PlayerContext)