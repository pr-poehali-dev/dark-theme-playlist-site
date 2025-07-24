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
  isBuiltIn?: boolean;
}

interface Playlist {
  id: string;
  name: string;
  tracks: Track[];
  createdAt: Date;
}

function Index() {
  // Встроенные треки - всегда доступны на сайте
  const builtInTracks: Track[] = [
    { id: 'builtin1', name: 'Мёртвый Анархист', artist: 'Король и Шут', url: '', duration: 213, isBuiltIn: true },
    { id: 'builtin2', name: 'Золото мёртвых', artist: 'NAGART', url: '', duration: 195, isBuiltIn: true },
    { id: 'builtin3', name: 'Демобилизация', artist: 'Сектор Газа', url: '', duration: 177, isBuiltIn: true },
    { id: 'builtin4', name: 'Твой звонок', artist: 'Сектор Газа', url: '', duration: 168, isBuiltIn: true },
    { id: 'builtin5', name: 'Лирика', artist: 'Сектор Газа', url: '', duration: 201, isBuiltIn: true },
    { id: 'builtin6', name: 'Камнем по голове', artist: 'КиШ', url: '', duration: 156, isBuiltIn: true },
    { id: 'builtin7', name: 'Охотник', artist: 'Король и Шут', url: '', duration: 224, isBuiltIn: true },
    { id: 'builtin8', name: 'Пиво-Пиво-Пиво', artist: 'КняZz', url: '', duration: 189, isBuiltIn: true },
    { id: 'builtin9', name: 'Лесник', artist: 'Король и Шут', url: '', duration: 191, isBuiltIn: true },
    { id: 'builtin10', name: 'Танец злобного гения', artist: 'Король и Шут', url: '', duration: 205, isBuiltIn: true },
    { id: 'builtin11', name: 'Кукла колдуна', artist: 'Король и Шут', url: '', duration: 176, isBuiltIn: true },
    { id: 'builtin12', name: 'Дагон', artist: 'Король и Шут', url: '', duration: 163, isBuiltIn: true },
    { id: 'builtin13', name: 'Прыгну со скалы', artist: 'Король и Шут', url: '', duration: 184, isBuiltIn: true },
    { id: 'builtin14', name: 'Бомж', artist: 'Сектор Газа', url: '', duration: 142, isBuiltIn: true },
    { id: 'builtin15', name: 'Дурак и молния', artist: 'Король и Шут', url: '', duration: 198, isBuiltIn: true },
    { id: 'builtin16', name: 'Музыка нас связала', artist: 'Мираж', url: '', duration: 225, isBuiltIn: true },
    { id: 'builtin17', name: 'Komarovo (DVRST Phonk Remix)', artist: 'DVRST, Игорь Скляр, Atomic Heart', url: '', duration: 180, isBuiltIn: true },
    { id: 'builtin18', name: 'Всё, что касается', artist: 'Звери', url: '', duration: 203, isBuiltIn: true },
    { id: 'builtin19', name: 'Районы-кварталы', artist: 'Звери', url: '', duration: 218, isBuiltIn: true },
  ];

  const [playlists, setPlaylists] = useState<Playlist[]>([
    { id: 'main', name: '🎵 Главный плейлист', tracks: builtInTracks, createdAt: new Date() },
    { id: 'uploaded', name: '📁 Загруженная музыка', tracks: [], createdAt: new Date() }
  ]);
  
  const [currentPlaylist, setCurrentPlaylist] = useState<Playlist>(playlists[0]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(builtInTracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState([85]);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [isShuffled, setIsShuffled] = useState(false);
  const [isRepeat, setIsRepeat] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      if (isRepeat) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, isRepeat]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume[0] / 100;
    }
  }, [volume]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const uploadedPlaylist = playlists.find(p => p.id === 'uploaded');
    if (!uploadedPlaylist) return;

    Array.from(files).forEach(file => {
      if (file.type.startsWith('audio/')) {
        const url = URL.createObjectURL(file);
        const track: Track = {
          id: Math.random().toString(36).substr(2, 9),
          name: file.name.replace(/\.[^/.]+$/, ''),
          artist: 'Загруженный трек',
          url,
          duration: 0,
          isBuiltIn: false
        };

        // Добавляем трек в плейлист загруженной музыки
        setPlaylists(prev => prev.map(playlist => 
          playlist.id === 'uploaded'
            ? { ...playlist, tracks: [...playlist.tracks, track] }
            : playlist
        ));

        // Автоматически переключаемся на плейлист загруженной музыки
        if (uploadedPlaylist.tracks.length === 0) {
          setCurrentPlaylist(prev => prev.id === 'uploaded' ? { ...prev, tracks: [track] } : prev);
        }

        if (!currentTrack) {
          setCurrentTrack(track);
        }
      }
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeTrack = (trackId: string) => {
    const trackToRemove = currentPlaylist.tracks.find(t => t.id === trackId);
    if (trackToRemove?.isBuiltIn) return; // Защищаем встроенные треки

    const updatedTracks = currentPlaylist.tracks.filter(t => t.id !== trackId);
    
    setPlaylists(prev => prev.map(playlist => 
      playlist.id === currentPlaylist.id 
        ? { ...playlist, tracks: updatedTracks }
        : playlist
    ));
    
    setCurrentPlaylist(prev => ({ ...prev, tracks: updatedTracks }));
    
    if (currentTrack?.id === trackId) {
      if (updatedTracks.length > 0) {
        setCurrentTrack(updatedTracks[0]);
      } else {
        setCurrentTrack(null);
        setIsPlaying(false);
      }
    }
  };

  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setCurrentTime(0);
    setDuration(track.duration);
    
    if (track.isBuiltIn) {
      // Для встроенных треков используем симуляцию воспроизведения
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      
      if (isPlaying) {
        playbackIntervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= track.duration) {
              clearInterval(playbackIntervalRef.current!);
              if (isRepeat) {
                setCurrentTime(0);
                return 0;
              } else {
                playNext();
                return track.duration;
              }
            }
            return prev + 1;
          });
        }, 1000);
      }
    } else {
      // Для загруженных треков используем реальное воспроизведение
      if (audioRef.current) {
        audioRef.current.src = track.url;
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play().catch(console.error);
        }
      }
    }
  };

  const togglePlayPause = () => {
    if (!currentTrack) return;

    const newIsPlaying = !isPlaying;
    setIsPlaying(newIsPlaying);

    if (currentTrack.isBuiltIn) {
      // Управление симуляцией для встроенных треков
      if (newIsPlaying) {
        playbackIntervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= currentTrack.duration) {
              clearInterval(playbackIntervalRef.current!);
              if (isRepeat) {
                setCurrentTime(0);
                return 0;
              } else {
                setIsPlaying(false);
                playNext();
                return currentTrack.duration;
              }
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        if (playbackIntervalRef.current) {
          clearInterval(playbackIntervalRef.current);
        }
      }
    } else {
      // Управление реальным воспроизведением для загруженных треков
      if (audioRef.current) {
        if (newIsPlaying) {
          audioRef.current.play().catch(console.error);
        } else {
          audioRef.current.pause();
        }
      }
    }
  };

  const playNext = () => {
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack?.id);
    let nextIndex;
    
    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * currentPlaylist.tracks.length);
    } else {
      nextIndex = (currentIndex + 1) % currentPlaylist.tracks.length;
    }
    
    selectTrack(currentPlaylist.tracks[nextIndex]);
  };

  const playPrevious = () => {
    const currentIndex = currentPlaylist.tracks.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? currentPlaylist.tracks.length - 1 : currentIndex - 1;
    selectTrack(currentPlaylist.tracks[prevIndex]);
  };

  const seekTo = (newTime: number[]) => {
    const time = newTime[0];
    setCurrentTime(time);
    
    if (currentTrack?.isBuiltIn) {
      // Для встроенных треков просто обновляем время
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      if (isPlaying) {
        playbackIntervalRef.current = setInterval(() => {
          setCurrentTime(prev => {
            if (prev >= currentTrack.duration) {
              clearInterval(playbackIntervalRef.current!);
              if (isRepeat) {
                setCurrentTime(0);
                return 0;
              } else {
                setIsPlaying(false);
                playNext();
                return currentTrack.duration;
              }
            }
            return prev + 1;
          });
        }, 1000);
      }
    } else {
      // Для загруженных треков обновляем реальное время
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const createPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    
    const newPlaylist: Playlist = {
      id: Math.random().toString(36).substr(2, 9),
      name: newPlaylistName,
      tracks: [],
      createdAt: new Date()
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    setNewPlaylistName('');
    setShowCreatePlaylist(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-purple-900 text-white">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
            🎵 Music Player Pro
          </h1>
          <p className="text-gray-300 text-lg">Встроенная коллекция + загрузка своей музыки</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Плейлисты */}
          <div className="lg:col-span-1">
            <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Icon name="Library" size={20} className="text-purple-400" />
                    <span>Плейлисты</span>
                  </CardTitle>
                  <Button
                    onClick={() => setShowCreatePlaylist(true)}
                    size="sm"
                    className="bg-purple-600 hover:bg-purple-700 shadow-lg"
                  >
                    <Icon name="Plus" size={16} />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {showCreatePlaylist && (
                  <div className="space-y-3 p-4 bg-gray-800/60 rounded-lg border border-purple-500/20">
                    <input
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="Название плейлиста"
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      onKeyPress={(e) => e.key === 'Enter' && createPlaylist()}
                    />
                    <div className="flex space-x-2">
                      <Button onClick={createPlaylist} size="sm" className="bg-green-600 hover:bg-green-700 flex-1">
                        Создать
                      </Button>
                      <Button onClick={() => setShowCreatePlaylist(false)} variant="outline" size="sm" className="flex-1">
                        Отмена
                      </Button>
                    </div>
                  </div>
                )}
                
                {playlists.map(playlist => (
                  <div
                    key={playlist.id}
                    onClick={() => setCurrentPlaylist(playlist)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      currentPlaylist.id === playlist.id
                        ? 'bg-gradient-to-r from-purple-600/40 to-pink-600/40 border border-purple-400/50 shadow-lg'
                        : 'bg-gray-800/40 hover:bg-gray-700/50 border border-gray-700/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon 
                        name={playlist.id === 'main' ? 'Star' : playlist.id === 'uploaded' ? 'Upload' : 'Music'} 
                        size={16} 
                        className={currentPlaylist.id === playlist.id ? 'text-purple-300' : 'text-gray-400'} 
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{playlist.name}</p>
                        <p className="text-xs text-gray-400">{playlist.tracks.length} треков</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Now Playing Card */}
            {currentTrack && (
              <Card className="bg-gradient-to-r from-purple-900/60 to-pink-900/60 border-purple-500/30 backdrop-blur-sm shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0 w-24 h-24 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center shadow-xl">
                      <Icon name="Music" size={32} className="text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-2xl font-bold text-white truncate mb-1">
                        {currentTrack.name}
                      </h2>
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="text-purple-200">{currentTrack.artist}</p>
                        {currentTrack.isBuiltIn && (
                          <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs px-2 py-1 rounded-full">
                            ВСТРОЕННЫЙ
                          </span>
                        )}
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-purple-300">
                        <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-500'}`}></div>
                        <span>{isPlaying ? 'Воспроизводится' : 'Приостановлено'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Player Controls */}
            <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardContent className="p-6">
                {/* Progress Bar */}
                {currentTrack && (
                  <div className="space-y-2 mb-6">
                    <Slider
                      value={[currentTime]}
                      onValueChange={seekTo}
                      max={duration || 100}
                      step={1}
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>{formatTime(currentTime)}</span>
                      <span>{formatTime(duration)}</span>
                    </div>
                  </div>
                )}

                {/* Control Buttons */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <Button
                    onClick={() => setIsShuffled(!isShuffled)}
                    variant="outline"
                    size="lg"
                    className={`rounded-full ${isShuffled ? 'bg-purple-600 border-purple-500' : 'bg-gray-700 border-gray-600'} hover:bg-purple-600`}
                  >
                    <Icon name="Shuffle" size={18} />
                  </Button>

                  <Button
                    onClick={playPrevious}
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-gray-700 border-gray-600 hover:bg-gray-600"
                    disabled={!currentTrack}
                  >
                    <Icon name="SkipBack" size={20} />
                  </Button>

                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="rounded-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 w-16 h-16 shadow-xl"
                    disabled={!currentTrack}
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={28} />
                  </Button>

                  <Button
                    onClick={playNext}
                    variant="outline"
                    size="lg"
                    className="rounded-full bg-gray-700 border-gray-600 hover:bg-gray-600"
                    disabled={!currentTrack}
                  >
                    <Icon name="SkipForward" size={20} />
                  </Button>

                  <Button
                    onClick={() => setIsRepeat(!isRepeat)}
                    variant="outline"
                    size="lg"
                    className={`rounded-full ${isRepeat ? 'bg-purple-600 border-purple-500' : 'bg-gray-700 border-gray-600'} hover:bg-purple-600`}
                  >
                    <Icon name="Repeat" size={18} />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-4">
                  <Icon name="Volume2" size={20} className="text-gray-400" />
                  <Slider
                    value={volume}
                    onValueChange={setVolume}
                    max={100}
                    step={1}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-400 w-10">{volume[0]}%</span>
                </div>
              </CardContent>
            </Card>

            {/* Track List */}
            <Card className="bg-gray-900/80 border-purple-500/30 backdrop-blur-sm shadow-2xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-white flex items-center space-x-2">
                    <Icon name="Music" size={20} className="text-purple-400" />
                    <span>{currentPlaylist.name}</span>
                    <span className="text-purple-400">({currentPlaylist.tracks.length})</span>
                  </CardTitle>
                  <div className="flex space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="audio/*"
                      multiple
                      className="hidden"
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-green-600 hover:bg-green-700 shadow-lg"
                    >
                      <Icon name="Upload" size={16} className="mr-2" />
                      Загрузить музыку
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {currentPlaylist.tracks.length === 0 ? (
                    <div className="text-center py-12 text-gray-400">
                      <Icon name="Music" size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Плейлист пуст</p>
                      <p className="text-sm">Загрузите музыку, чтобы начать слушать</p>
                    </div>
                  ) : (
                    currentPlaylist.tracks.map((track, index) => (
                      <div
                        key={track.id}
                        className={`group flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          currentTrack?.id === track.id
                            ? 'bg-gradient-to-r from-purple-600/30 to-pink-600/30 border border-purple-500/50 shadow-lg'
                            : 'hover:bg-gray-800/60 border border-transparent'
                        }`}
                        onClick={() => selectTrack(track)}
                      >
                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center mr-4 shadow-lg">
                          <Icon 
                            name={currentTrack?.id === track.id && isPlaying ? "Pause" : "Play"} 
                            size={16} 
                            className="text-white" 
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <p className="font-semibold truncate text-white">{track.name}</p>
                            {track.isBuiltIn && (
                              <span className="bg-purple-600/40 text-purple-300 text-xs px-2 py-0.5 rounded-full border border-purple-500/30">
                                ВСТРОЕННЫЙ
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-300 truncate mb-1">{track.artist}</p>
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <span>#{index + 1}</span>
                            <span>•</span>
                            <span>{formatTime(track.duration)}</span>
                            {currentTrack?.id === track.id && (
                              <>
                                <span>•</span>
                                <span className="flex items-center space-x-1 text-green-400">
                                  <div className="w-1.5 h-1.5 bg-current rounded-full animate-pulse"></div>
                                  <span>Играет</span>
                                </span>
                              </>
                            )}
                          </div>
                        </div>

                        {!track.isBuiltIn && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeTrack(track.id);
                            }}
                            variant="ghost"
                            size="sm"
                            className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/20 text-red-400 hover:text-red-300"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Hidden Audio Element for uploaded tracks */}
        <audio ref={audioRef} />
      </div>
    </div>
  );
}

export default Index;