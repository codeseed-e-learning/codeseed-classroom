import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Code, PlayCircle, X, Menu } from 'lucide-react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { solarizedlight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import VideoPlayer from "../pages/VideoPlayer"
interface Video {
  id: string;
  video_title: string;
  video_description: string;
  code_snippets: string;
  video_link: string;
  course_id: string;
}

export default function Learn() {
  const { courseId } = useParams(); // ✅ Correct way to get courseId
  const [videos, setVideos] = useState<Video[]>([]);
  const [currentVideo, setCurrentVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  const fetchVideos = useCallback(async () => {
    setLoading(true);
    try {
      const courseId = window.location.pathname.split('/').pop();
      const { data, error } = await supabase
        .from('videos')
        .select('*')
        .eq('course_id', courseId) // Ensure this column exists
        .order('video_title', { ascending: true });
  
      if (error) throw error;
  
      setVideos((prevVideos) => (data.length ? data : prevVideos));
      if (!currentVideo && data.length > 0) {
        setCurrentVideo(data[0]);
      }
    } catch (error) {
      console.warn('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  }, [currentVideo]);

  useEffect(() => {
    if (courseId) {
      fetchVideos();
    }
  }, [courseId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main Content */}
          <div className={`flex-1 space-y-6 ${isSidebarOpen ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {loading ? (
              <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
                <p className="text-gray-500">Loading videos...</p>
              </div>
            ) : currentVideo ? (
              <>
                {/* Video Player */}
                <div className="bg-white rounded-xl overflow-hidden">
                  <VideoPlayer videoSrc={currentVideo.video_link} />
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900">{currentVideo.video_title}</h2>
                    <p className="text-gray-700 mt-2">{currentVideo.video_description}</p>
                  </div>
                </div>

                {/* Code Snippets */}
                {currentVideo.code_snippets && (
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Code className="h-6 w-6 text-gray-700" />
                      <h3 className="text-lg font-semibold text-gray-900">Code Snippets</h3>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg overflow-x-auto max-h-80 border border-gray-200">
                      <SyntaxHighlighter language="javascript" style={solarizedlight}>
                        {currentVideo.code_snippets}
                      </SyntaxHighlighter>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 flex items-center justify-center">
                <p className="text-gray-500">No videos available</p>
              </div>
            )}
          </div>

          {/* Video List (Sidebar) */}
          <div className={`transition-all duration-300 overflow-hidden ${isSidebarOpen ? 'w-80' : 'w-0'}`}>
            <div className={`bg-white border rounded-xl shadow-lg overflow-hidden ${isSidebarOpen ? 'block' : 'hidden'}`}>
              <div className="p-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Lessons</h3>
              </div>
              <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                {videos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => setCurrentVideo(video)}
                    className={`w-full text-left p-4 flex items-center space-x-3 hover:bg-gray-100 transition-colors 
                      ${currentVideo?.id === video.id ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`}
                    aria-label={`Watch ${video.video_title}`}
                    tabIndex={0}
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

        {/* Toggle Button for Sidebar */}
        <div className="fixed bottom-4 right-4 z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
            aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
          >
            {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
} 