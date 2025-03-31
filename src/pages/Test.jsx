import React, { useEffect, useRef } from 'react';
import Plyr from 'plyr'; // Make sure to install plyr using npm or yarn
import 'plyr/dist/plyr.css'; // Import Plyr CSS

const PlyrComponent = React.forwardRef((props, ref) => {

  const { source, options = {}, ...rest } = props;
  const videoRef = useRef(null);


  useEffect(() => {
    // Initialize Plyr
    const player = new Plyr(videoRef.current, options);

    // Set the source
    if (source) {
      player.source = source;
    }

    // Cleanup on unmount
    return () => {
      player.destroy();
    };
  }, [source, options]);

  return (
    <video ref={videoRef} className="plyr-react plyr" {...rest} />
  );
  console.log(`works`);
});

export default PlyrComponent;