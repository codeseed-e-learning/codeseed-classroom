import React, { useRef, useState, useEffect } from 'react';

const VideoPlayer = ({ videoSrc, thumbnail, height = "400px" }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1); // Volume range is 0.0 to 1.0
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [quality, setQuality] = useState('720p'); // Default quality
  const [progress, setProgress] = useState(0);

  const togglePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    videoRef.current.volume = newVolume;
    if (isMuted && newVolume > 0) setIsMuted(false); // Unmute if volume is increased
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    videoRef.current.muted = !isMuted;
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const handleFullscreenChange = () => {
    setIsFullscreen(document.fullscreenElement === videoRef.current);
  };

  const seekForward = () => {
    videoRef.current.currentTime += 10; // Seek forward 10 seconds
  };

  const seekBackward = () => {
    videoRef.current.currentTime -= 10; // Seek backward 10 seconds
  };

  const changeQuality = () => {
    const newQuality = quality === '720p' ? '1080p' : '720p';
    setQuality(newQuality);
    // Update video source based on quality (placeholder logic)
    videoRef.current.src = newQuality === '720p'
      ? 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
      : 'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny_1080p.mp4';
  };

  const handleProgress = () => {
    const progress = (videoRef.current.currentTime / videoRef.current.duration) * 100;
    setProgress(progress);
  };

  const handleTimelineChange = (e) => {
    const newTime = (e.target.value / 100) * videoRef.current.duration;
    videoRef.current.currentTime = newTime;
    setProgress(e.target.value);
  };

  useEffect(() => {
    const video = videoRef.current;
    video.addEventListener('timeupdate', handleProgress);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      video.removeEventListener('timeupdate', handleProgress);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const Button = ({ onClick, children, ariaLabel }) => (
    <button
      onClick={onClick}
      aria-label={ariaLabel}
      className="mx-1 text-white bg-gray-800 border border-gray-700 rounded-full p-2 hover:bg-gray-700 transition"
    >
      {children}
    </button>
  );

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg overflow-hidden shadow-lg">
      <video
        ref={videoRef}
        className="w-full object-cover"
        controls={false} // Disable default controls
        onEnded={() => setIsPlaying(false)}
        poster={thumbnail}
        style={{ height }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div className="flex flex-col p-4 bg-gray-100 text-black">
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={handleTimelineChange}
          className="w-full mb-4"
          aria-label="Video timeline"
        />
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center">
            <Button onClick={togglePlayPause} ariaLabel={isPlaying ? 'Pause' : 'Play'}>
              {isPlaying ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 9v6m4-6v6" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-6.5-3.75A1 1 0 007 8.25v7.5a1 1 0 001.252.918l6.5-3.75a1 1 0 000-1.836z" />
                </svg>
              )}
            </Button>
            <Button onClick={seekBackward} ariaLabel="Seek backward">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Button>
            <Button onClick={seekForward} ariaLabel="Seek forward">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Button>
            <Button onClick={toggleMute} ariaLabel={isMuted ? 'Unmute' : 'Mute'}>
              {isMuted ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 14l2 2m0 0l2-2m-2 2l-2-2" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              )}
            </Button>
            <div className="flex items-center mx-2">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
                aria-label="Volume control"
              />
              <span className="text-sm ml-2">{Math.round(volume * 100)}%</span>
            </div>
          </div>
          <div className="flex items-center">
            <Button onClick={changeQuality} ariaLabel="Change quality">
              Quality: {quality}
            </Button>
            <Button onClick={toggleFullscreen} ariaLabel={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
              {isFullscreen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6H6v12h12V6z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 6h8v2H8V6zm0 8h8v2H8v-2zm-2-4h12v2H6v-2z" />
                </svg>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;