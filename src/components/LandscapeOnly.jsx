import React, { useState, useEffect } from 'react';
import { RotateCcw } from 'lucide-react';

const LandscapeOnly = ({ children, showOnPortrait = true }) => {
  const [orientation, setOrientation] = useState('landscape');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkOrientation = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      const isMobileDevice = window.innerWidth <= 768;
      
      setOrientation(isPortrait ? 'portrait' : 'landscape');
      setIsMobile(isMobileDevice);
    };

    // Check on mount
    checkOrientation();

    // Listen for orientation changes
    window.addEventListener('resize', checkOrientation);
    window.addEventListener('orientationchange', checkOrientation);

    // Try to request landscape orientation using Screen Orientation API
    if ('screen' in window && 'orientation' in window.screen) {
      try {
        window.screen.orientation.lock('landscape').catch(() => {
          // Silently fail if lock is not supported or fails
          console.log('Screen orientation lock not supported or failed');
        });
      } catch (error) {
        // Silently fail
        console.log('Screen orientation API not supported');
      }
    }

    return () => {
      window.removeEventListener('resize', checkOrientation);
      window.removeEventListener('orientationchange', checkOrientation);
    };
  }, []);

  const requestLandscape = async () => {
    if ('screen' in window && 'orientation' in window.screen) {
      try {
        await window.screen.orientation.lock('landscape');
      } catch (error) {
        // Show user instruction to rotate manually
        alert('Please rotate your device to landscape mode for the best experience!');
      }
    } else {
      alert('Please rotate your device to landscape mode for the best experience!');
    }
  };

  // Show landscape message only on mobile portrait mode
  if (isMobile && orientation === 'portrait' && showOnPortrait) {
    return (
      <div className="landscape-only">
        <div className="rotate-icon">
          <RotateCcw />
        </div>
        <h2>Rotate Your Device</h2>
        <p>This game is best experienced in landscape mode. Please rotate your device for optimal gameplay.</p>
        <button 
          onClick={requestLandscape}
          className="mt-4 px-6 py-2 bg-white text-purple-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Request Landscape
        </button>
      </div>
    );
  }

  return children;
};

export default LandscapeOnly;