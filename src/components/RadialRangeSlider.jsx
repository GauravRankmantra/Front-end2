import React, { useState, useRef } from 'react';
import { FaMusic } from 'react-icons/fa';

const RadialSlider = () => {
  const [value, setValue] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const circleRef = useRef(null);
  
  const handleMouseMove = (e) => {
    if (isDragging) {
      const circle = circleRef.current;
      const center_x = circle.offsetWidth / 2 + circle.getBoundingClientRect().left;
      const center_y = circle.offsetHeight / 2 + circle.getBoundingClientRect().top;
      const pos_x = e.pageX || e.touches?.[0].pageX;
      const pos_y = e.pageY || e.touches?.[0].pageY;

      const delta_y = center_y - pos_y;
      const delta_x = center_x - pos_x;

      let angle = Math.atan2(delta_y, delta_x) * (180 / Math.PI); // Calculate Angle
      angle -= 90;
      if (angle < 0) angle = 360 + angle; // Ensure positive angle

      // Calculate the new value based on the angle, skipping the dead zone
      let newValue = Math.round((angle / 360) * 100);

      // Implement the gap: if in the gap (dead zone) between 0 and 10 or between 90 and 100
      if ((angle >= 350 || angle <= 10)) {
        return; // Don't move if the angle is within the gap between 100 and 0
      }

      // Clamp the value between 0 and 100
      if (newValue <= 100 && newValue >= 0) {
        setValue(newValue); // Update the value state
        changeAudioBasedOnValue(newValue); // Call function to update audio
      }
    }
  };

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const changeAudioBasedOnValue = (val) => {
    // Logic to change audio progress or volume based on the slider's value
    const audio = document.getElementById('audio');
    const duration = audio.duration;
    const newTime = (val / 100) * duration;
    audio.currentTime = newTime;
  };

  return (
    <div
      ref={circleRef}
      className="circle"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
      onTouchStart={handleMouseDown}
      onTouchEnd={handleMouseUp}
      onTouchMove={handleMouseMove}
      style={{
        position: 'relative',
        border:'1px solid white',
        width: '100px', // Smaller size
        height: '100px', // Smaller size
        borderRadius: '50%',
        backgroundColor: 'transparent', // Updated color to fit music control
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
      }}
    >
      {/* Music Icon in the center */}
      <FaMusic style={{ fontSize: '30px', color: '#fff' }} />
      
      {/* Slider Dot */}
      <div
        className="dot"
        style={{
          position: 'absolute',
          backgroundColor: '#fff',
          width: '8px',
          height: '8px',
          border:'1px solid black',
          borderRadius: '50%',
          transform: `rotate(${(value / 100) * 360}deg) translateY(-65px)`,
          transformOrigin: 'center bottom',
          boxShadow: '0 0 3px rgba(0, 0, 0, 0.3)',
        }}
      />
      
      <audio id="audio" src="your-audio-file.mp3" />
    </div>
  );
};

export default RadialSlider;
