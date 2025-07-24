import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Track {
  id: string;
  name: string;
  artist: string;
  url: string;
  duration: number;
  isDemo?: boolean;
}

function Index() {
  // Предустановленные демо-треки
  const demoTracks: Track[] = [
    { id: 'demo1', name: 'Мёртвый Анархист', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 180, isDemo: true },
    { id: 'demo2', name: 'Золото мёртвых', artist: 'NAGART', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 200, isDemo: true },
    { id: 'demo3', name: 'Демобилизация', artist: 'Сектор Газа', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 195, isDemo: true },
    { id: 'demo4', name: 'Твой звонок', artist: 'Сектор Газа', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 170, isDemo: true },
    { id: 'demo5', name: 'Лирика', artist: 'Сектор Газа', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 210, isDemo: true },
    { id: 'demo6', name: 'Камнем по голове', artist: 'КиШ', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 155, isDemo: true },
    { id: 'demo7', name: 'Охотник', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 240, isDemo: true },
    { id: 'demo8', name: 'Пиво-Пиво-Пиво', artist: 'КняZz', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 190, isDemo: true },
    { id: 'demo9', name: 'Лесник', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 220, isDemo: true },
    { id: 'demo10', name: 'Танец злобного гения', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 205, isDemo: true },
    { id: 'demo11', name: 'Кукла колдуна', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 175, isDemo: true },
    { id: 'demo12', name: 'Дагон', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 160, isDemo: true },
    { id: 'demo13', name: 'Прыгну со скалы', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 185, isDemo: true },
    { id: 'demo14', name: 'Бомж', artist: 'Сектор Газа', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 145, isDemo: true },
    { id: 'demo15', name: 'Дурак и молния', artist: 'Король и Шут', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 195, isDemo: true },
    { id: 'demo16', name: 'Музыка нас связала', artist: 'Мираж', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 225, isDemo: true },
    { id: 'demo17', name: 'Komarovo (DVRST Phonk Remix)', artist: 'DVRST, Игорь Скляр, Atomic Heart', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 180, isDemo: true },
    { id: 'demo18', name: 'Всё, что касается', artist: 'Звери', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 200, isDemo: true },
    { id: 'demo19', name: 'Районы-кварталы', artist: 'Звери', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav', duration: 215, isDemo: true }
  ];

  const [tracks, setTracks] = useState<Track[]>(demoTracks);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(demoTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([70]);
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => playNext();

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const track: Track = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Загруженный трек',
          url,
          duration: 0,
          isDemo: false
        };
        
        setTracks(prev => [...prev, track]);
        
        if (!currentTrack) {
          setCurrentTrack(track);
        }
      }
    });
  };

  const togglePlayPause = () => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const playNext = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const nextIndex = (currentIndex + 1) % tracks.length;
    const nextTrack = tracks[nextIndex];
    
    setCurrentTrack(nextTrack);
    setIsPlaying(true);
  };

  const playPrevious = () => {
    if (!currentTrack || tracks.length === 0) return;
    
    const currentIndex = tracks.findIndex(t => t.id === currentTrack.id);
    const prevIndex = currentIndex === 0 ? tracks.length - 1 : currentIndex - 1;
    const prevTrack = tracks[prevIndex];
    
    setCurrentTrack(prevTrack);
    setIsPlaying(true);
  };

  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const removeTrack = (trackId: string) => {
    // Не позволяем удалять демо-треки
    const trackToRemove = tracks.find(t => t.id === trackId);
    if (trackToRemove?.isDemo) return;
    
    const updatedTracks = tracks.filter(t => t.id !== trackId);
    setTracks(updatedTracks);
    
    if (currentTrack?.id === trackId) {
      if (updatedTracks.length > 0) {
        setCurrentTrack(updatedTracks[0]);
        setIsPlaying(true);
      } else {
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    }
  };

  const loadDemoTrack = (track: Track) => {
    // Создаем аудио-контекст для генерации демо-звука
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    // Генерируем разные тоны для разных треков
    const frequency = 440 + (parseInt(track.id.replace('demo', '')) * 50);
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 2);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 2);
    
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0F14] via-[#1A1A1A] to-[#0A0A0F] text-white p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-r from-[#D946EF] to-[#F97316] rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block">
            <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-[#6366F1] via-[#8B5CF6] to-[#D946EF] bg-clip-text text-transparent animate-fade-in">
              🎵 Music Player
            </h1>
            <div className="h-1 w-full bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full animate-fade-in delay-300"></div>
          </div>
          <p className="text-gray-300 text-lg mt-4 animate-fade-in delay-500">
            Загружайте и слушайте вашу музыку в стиле
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card className="bg-gradient-to-br from-[#2D2D2D] to-[#1F1F23] border-gray-600 shadow-2xl backdrop-blur-sm animate-scale-in">
              <CardHeader className="pb-2">
                <CardTitle className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl font-bold text-white truncate">
                      {currentTrack ? currentTrack.name : 'Выберите трек'}
                    </h2>
                    {currentTrack && (
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-sm text-gray-400">{currentTrack.artist}</p>
                        {currentTrack.isDemo && (
                          <span className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white text-xs px-2 py-1 rounded-full">
                            DEMO
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5AF0] hover:to-[#7E69AB] text-white border-0 shadow-lg hover-scale transition-all duration-300"
                    size="sm"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-8 pt-6">
                {/* Now Playing Display */}
                {currentTrack && (
                  <div className="text-center p-6 bg-gradient-to-r from-[#6366F1]/10 to-[#8B5CF6]/10 rounded-xl border border-[#6366F1]/20">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-full flex items-center justify-center animate-pulse shadow-lg">
                      <Icon name={isPlaying ? "Pause" : "Play"} size={28} className="text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-1">{currentTrack.name}</h3>
                    <p className="text-sm text-gray-300 mb-3">{currentTrack.artist}</p>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-400">
                      <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                      <span>{isPlaying ? 'Воспроизводится' : 'Приостановлено'}</span>
                      {currentTrack.isDemo && (
                        <>
                          <span>•</span>
                          <span className="text-[#6366F1]">Демо версия</span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Progress Bar */}
                <div className="space-y-3">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleProgressChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span className="font-mono">{formatTime(currentTime)}</span>
                    <span className="font-mono">{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-6">
                  <Button
                    onClick={playPrevious}
                    variant="ghost"
                    size="lg"
                    className="text-white hover:text-[#6366F1] hover:bg-gray-800/50 rounded-full w-12 h-12 hover-scale transition-all duration-300"
                    disabled={tracks.length === 0}
                  >
                    <Icon name="SkipBack" size={24} />
                  </Button>
                  
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5AF0] hover:to-[#7E69AB] text-white rounded-full w-20 h-20 shadow-2xl hover-scale transition-all duration-300 animate-pulse"
                    disabled={!currentTrack}
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={36} />
                  </Button>
                  
                  <Button
                    onClick={playNext}
                    variant="ghost"
                    size="lg"
                    className="text-white hover:text-[#6366F1] hover:bg-gray-800/50 rounded-full w-12 h-12 hover-scale transition-all duration-300"
                    disabled={tracks.length === 0}
                  >
                    <Icon name="SkipForward" size={24} />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl">
                  <Icon name="Volume2" size={20} className="text-gray-400" />
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-300 font-mono w-12">{volume[0]}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist */}
          <div>
            <Card className="bg-gradient-to-br from-[#2D2D2D] to-[#1F1F23] border-gray-600 shadow-2xl backdrop-blur-sm animate-scale-in delay-200">
              <CardHeader className="pb-4">
                <CardTitle className="text-white flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] rounded-lg flex items-center justify-center mr-3">
                      <Icon name="Music" size={16} className="text-white" />
                    </div>
                    <span>Плейлист</span>
                  </div>
                  <div className="bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 px-3 py-1 rounded-full">
                    <span className="text-sm font-mono">{tracks.length}</span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tracks.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-[#6366F1]/20 to-[#8B5CF6]/20 rounded-full flex items-center justify-center">
                      <Icon name="Music" size={32} className="opacity-50" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2 text-gray-300">Плейлист пуст</h3>
                    <p className="text-sm text-gray-500">Загрузите музыку для начала</p>
                    <div className="mt-6">
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] hover:from-[#5B5AF0] hover:to-[#7E69AB] text-white border-0"
                        size="sm"
                      >
                        <Icon name="Plus" size={16} className="mr-2" />
                        Добавить треки
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                    {tracks.map((track, index) => (
                      <div
                        key={track.id}
                        className={`group p-4 rounded-xl cursor-pointer transition-all duration-300 ${
                          currentTrack?.id === track.id
                            ? 'bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] text-white shadow-lg'
                            : 'bg-gray-800/50 hover:bg-gray-700/50 text-gray-300 hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div 
                            className="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center transition-colors"
                            onClick={(e) => {
                              e.stopPropagation();
                              track.isDemo ? loadDemoTrack(track) : selectTrack(track);
                            }}
                          >
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                              currentTrack?.id === track.id 
                                ? 'bg-white/20 text-white' 
                                : 'bg-[#6366F1]/20 text-[#6366F1] group-hover:bg-[#6366F1] group-hover:text-white'
                            }`}>
                              {currentTrack?.id === track.id && isPlaying ? (
                                <Icon name="Pause" size={14} />
                              ) : (
                                <Icon name="Play" size={14} />
                              )}
                            </div>
                          </div>
                          <div className="flex-1 min-w-0" onClick={() => track.isDemo ? loadDemoTrack(track) : selectTrack(track)}>
                            <div className="flex items-center justify-between">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center space-x-2 mb-1">
                                  <p className="font-semibold truncate text-sm">{track.name}</p>
                                  {track.isDemo && (
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                                      currentTrack?.id === track.id 
                                        ? 'bg-white/20 text-white' 
                                        : 'bg-[#6366F1]/20 text-[#6366F1]'
                                    }`}>
                                      DEMO
                                    </span>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 truncate mb-1">{track.artist}</p>
                                <div className="flex items-center space-x-2 text-xs opacity-75">
                                  <span>#{index + 1}</span>
                                  {currentTrack?.id === track.id && (
                                    <>
                                      <span>•</span>
                                      <span className="flex items-center space-x-1">
                                        <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                                        <span>Играет</span>
                                      </span>
                                    </>
                                  )}
                                </div>
                              </div>
                              {!track.isDemo && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeTrack(track.id);
                                  }}
                                  variant="ghost"
                                  size="sm"
                                  className={`opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 p-0 rounded-lg ${
                                    currentTrack?.id === track.id
                                      ? 'hover:bg-white/20 text-white'
                                      : 'hover:bg-red-500/20 text-red-400 hover:text-red-300'
                                  }`}
                                >
                                  <Icon name="Trash2" size={14} />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          multiple
          onChange={handleFileUpload}
          className="hidden"
        />

        {/* Hidden audio element */}
        {currentTrack && (
          <audio
            ref={audioRef}
            src={currentTrack.url}
            preload="metadata"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        )}
      </div>
    </div>
  );
}

export default Index;