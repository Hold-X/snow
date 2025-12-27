
import React, { useEffect, useRef, useState } from 'react';
import { Snowflake, Star } from './types';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [stars, setStars] = useState<Star[]>([]);

  // Initialize Stars
  useEffect(() => {
    const starCount = 150;
    const newStars: Star[] = [];
    for (let i = 0; i < starCount; i++) {
      newStars.push({
        id: i,
        top: Math.random() * 100,
        left: Math.random() * 100,
        size: Math.random() * 2 + 1,
        duration: 2 + Math.random() * 3,
      });
    }
    setStars(newStars);
  }, []);

  // Snow Animation Logic
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resizeCanvas = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const snowflakeCount = 200;
    const snowflakes: Snowflake[] = [];

    for (let i = 0; i < snowflakeCount; i++) {
      snowflakes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.5,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.5 + 0.3,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'white';

      snowflakes.forEach((flake) => {
        ctx.beginPath();
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${flake.opacity})`;
        ctx.fill();

        flake.y += flake.speed;
        flake.x += flake.wind;

        if (flake.y > height) {
          flake.y = -10;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        if (flake.x < 0) flake.x = width;
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.log("Auto-play blocked", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-slate-950">
      {/* Stars Layer */}
      {stars.map((star) => (
        <div
          key={star.id}
          className="star absolute bg-white rounded-full opacity-0"
          style={{
            top: `${star.top}%`,
            left: `${star.left}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            boxShadow: '0 0 5px white',
            '--duration': `${star.duration}s`
          } as React.CSSProperties}
        />
      ))}

      {/* Moon */}
      <div className="absolute top-12 right-12 w-32 h-32 rounded-full bg-yellow-50 shadow-[0_0_60px_rgba(253,251,211,0.5)] z-10 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full bg-yellow-100 opacity-80 blur-sm"></div>
        {/* Simple craters */}
        <div className="w-4 h-4 rounded-full bg-yellow-200/50 absolute top-6 left-8 blur-[1px]"></div>
        <div className="w-6 h-6 rounded-full bg-yellow-200/50 absolute bottom-8 right-10 blur-[1px]"></div>
        <div className="w-3 h-3 rounded-full bg-yellow-200/50 absolute top-16 right-6 blur-[1px]"></div>
      </div>

      {/* Snow Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 z-20 pointer-events-none" />

      {/* Ground Glow */}
      <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-white/20 to-transparent pointer-events-none z-10" />

      <div className="absolute bottom-8 left-8 z-30 pointer-events-none">
        <h1 className="text-white/80 text-4xl font-light tracking-tighter">
          Silent Night
        </h1>
        <p className="text-white/40 text-sm italic">
          Listen to the rhythm of the falling snow...
        </p>
      </div>
    </div>
  );
};

export default App;
