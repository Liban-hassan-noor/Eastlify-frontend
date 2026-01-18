import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function ImageCarousel({ 
  images = [], 
  autoSlide = false, 
  autoSlideInterval = 5000,
  aspectRatio = "aspect-square"
}) {
  const [curr, setCurr] = useState(0);

  const prev = () => setCurr((curr) => (curr === 0 ? images.length - 1 : curr - 1));
  const next = useCallback(() => setCurr((curr) => (curr === images.length - 1 ? 0 : curr + 1)), [images.length]);

  useEffect(() => {
    if (!autoSlide || images.length <= 1) return;
    const slideInterval = setInterval(next, autoSlideInterval);
    return () => clearInterval(slideInterval);
  }, [autoSlide, autoSlideInterval, next, images.length]);

  if (!images || images.length === 0) {
    return (
      <div className={`${aspectRatio} bg-gray-50 flex items-center justify-center text-gray-300`}>
        <span className="text-xs font-bold uppercase">No Image</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden relative group ${aspectRatio}`}>
      <div
        className="flex transition-transform ease-out duration-500 w-full h-full"
        style={{ transform: `translateX(-${curr * 100}%)` }}
      >
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Slide ${i}`}
            className="w-full h-full object-cover flex-shrink-0"
            loading="lazy"
          />
        ))}
      </div>

      {images.length > 1 && (
        <>
          <div className="absolute inset-0 flex items-center justify-between p-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); prev(); }}
              className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white transition"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); next(); }}
              className="p-1 rounded-full shadow bg-white/80 text-gray-800 hover:bg-white transition"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          <div className="absolute bottom-3 right-0 left-0">
            <div className="flex items-center justify-center gap-1.5">
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`
                    transition-all w-1.5 h-1.5 bg-white rounded-full
                    ${curr === i ? "p-0.5 w-3" : "bg-opacity-50"}
                  `}
                />
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
