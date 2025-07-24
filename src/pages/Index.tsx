import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import Icon from '@/components/ui/icon';

interface Track {
  id: string;
  name: string;
  url: string;
  duration: number;
}

function Index() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
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
          url,
          duration: 0
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
    <div className="min-h-screen bg-[#1A1A1A] text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-[#6366F1] to-[#8B5CF6] bg-clip-text text-transparent">
            Music Player
          </h1>
          <p className="text-gray-400">
            Загружайте и слушайте вашу музыку
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Player */}
          <div className="lg:col-span-2">
            <Card className="bg-[#2D2D2D] border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="text-white">
                    {currentTrack ? currentTrack.name : 'Выберите трек'}
                  </span>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    size="sm"
                    className="border-[#6366F1] text-[#6366F1] hover:bg-[#6366F1] hover:text-white"
                  >
                    <Icon name="Upload" size={16} className="mr-2" />
                    Загрузить
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Slider
                    value={[currentTime]}
                    max={duration || 100}
                    step={1}
                    onValueChange={handleProgressChange}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center space-x-4">
                  <Button
                    onClick={playPrevious}
                    variant="ghost"
                    size="lg"
                    className="text-white hover:text-[#6366F1] hover:bg-gray-800"
                    disabled={tracks.length === 0}
                  >
                    <Icon name="SkipBack" size={24} />
                  </Button>
                  
                  <Button
                    onClick={togglePlayPause}
                    size="lg"
                    className="bg-[#6366F1] hover:bg-[#5B5AF0] text-white rounded-full w-16 h-16"
                    disabled={!currentTrack}
                  >
                    <Icon name={isPlaying ? "Pause" : "Play"} size={32} />
                  </Button>
                  
                  <Button
                    onClick={playNext}
                    variant="ghost"
                    size="lg"
                    className="text-white hover:text-[#6366F1] hover:bg-gray-800"
                    disabled={tracks.length === 0}
                  >
                    <Icon name="SkipForward" size={24} />
                  </Button>
                </div>

                {/* Volume Control */}
                <div className="flex items-center space-x-3">
                  <Icon name="Volume2" size={20} className="text-gray-400" />
                  <Slider
                    value={volume}
                    max={100}
                    step={1}
                    onValueChange={setVolume}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-400 w-12">{volume[0]}%</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Playlist */}
          <div>
            <Card className="bg-[#2D2D2D] border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Icon name="Music" size={20} className="mr-2" />
                  Плейлист ({tracks.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {tracks.length === 0 ? (
                  <div className="text-center py-8 text-gray-400">
                    <Icon name="Music" size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="mb-2">Плейлист пуст</p>
                    <p className="text-sm">Загрузите музыку для начала</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {tracks.map((track) => (
                      <div
                        key={track.id}
                        onClick={() => selectTrack(track)}
                        className={`p-3 rounded-lg cursor-pointer transition-all ${
                          currentTrack?.id === track.id
                            ? 'bg-[#6366F1] text-white'
                            : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-shrink-0">
                            {currentTrack?.id === track.id && isPlaying ? (
                              <Icon name="Pause" size={16} />
                            ) : (
                              <Icon name="Play" size={16} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">{track.name}</p>
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