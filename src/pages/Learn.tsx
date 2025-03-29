import { useEffect, useState } from 'react';
import { Code, PlayCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

interface Video {
  id: string;
  video_title: string;
  video_description: string;
  code_snippets: string;
  video_link: string;
}

export default function Learn() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    const { data, error } = await supabase
      .from('videos')
      .select('*')
      .order('video_title', { ascending: true });

    if (error) {
      console.error('Error fetching videos:', error);
      return;
    }

    setVideos(data);
    if (data.length > 0 && !currentVideo) {
      setCurrentVideo(data[0]);
    }
  };

  const handleVideoClick = (video: Video) => {
    setCurrentVideo(video);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {currentVideo ? (
              <>
                {/* Video Player */}
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <video
                    className="w-full h-[400px] object-cover rounded-t-xl"
                    controls
                    src={currentVideo.video_link}
                  />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900">{currentVideo.video_title}</h2>
                    <p className="text-gray-700 mt-2">{currentVideo.video_description}</p>
                  </div>
                </div>

                {/* Code Snippets */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center space-x-2 mb-4">
                    <Code className="h-6 w-6 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">Code Snippets</h3>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-80 border border-gray-200">
                    <pre className="text-sm font-mono text-gray-800 whitespace-pre-wrap">
                      {currentVideo.code_snippets}
                    </pre>
                  </div>
                </div>
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
                <p className="text-gray-500">Select a lesson to start learning</p>
              </div>
            )}
          </div>

          {/* Video List */}
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Lessons</h3>
            </div>
            <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
              {videos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleVideoClick(video)}
                  className={`w-full text-left p-4 flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
                    currentVideo?.id === video.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''
                  }`}
                >
                  <PlayCircle className="h-6 w-6 text-gray-700" />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{video.video_title}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{video.video_description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
