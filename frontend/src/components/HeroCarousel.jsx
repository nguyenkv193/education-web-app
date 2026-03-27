import { useEffect, useMemo, useRef, useState, useCallback } from 'react';

export default function HeroCarousel({ slides = [], intervalMs = 5000 }) {
    const [paused, setPaused] = useState(false);
    const timerRef = useRef(null);

    const safeSlides = useMemo(() => slides.filter(Boolean), [slides]);
    const total = safeSlides.length;

    const [index, setIndex] = useState(0);

    useEffect(() => {
        if (total <= 1) return;

        const startAutoPlay = () => {
            timerRef.current = setInterval(() => {
                if (!paused) {
                    setIndex(prev => (prev + 1) % total);
                }
            }, intervalMs);
        };

        startAutoPlay();
        return () => clearInterval(timerRef.current);
    }, [intervalMs, total, paused]);

    // Điều hướng
    const goToPrev = useCallback(() => {
        if (total <= 1) return;
        setIndex(prev => (prev - 1 + total) % total);
    }, [total]);

    const goToNext = useCallback(() => {
        if (total <= 1) return;
        setIndex(prev => (prev + 1) % total);
    }, [total]);

    const goToDot = useCallback(
        dotIndex => {
            if (total <= 1) return;
            setIndex(dotIndex);
        },
        [total]
    );

    if (!safeSlides.length) return null;

    return (
        <div className="mx-auto px-3">
            <div
                className="relative"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                {/* Slide Container */}
                <div className="relative overflow-hidden rounded-2xl">
                    <div className="relative">
                        {safeSlides.map((slide, i) => (
                            <div
                                key={i}
                                className={`transition-opacity duration-700 ${
                                    i === index ? 'opacity-100' : 'opacity-0'
                                }`}
                                style={{
                                    position: 'absolute',
                                    inset: 0,
                                }}
                            >
                                <SlideContent slide={slide} />
                            </div>
                        ))}
                        {/* Placeholder để định chiều cao */}
                        <div className="invisible">
                            <SlideContent slide={safeSlides[0]} />
                        </div>
                    </div>
                </div>

                {/* Navigation Buttons */}
                <NavButton direction="prev" onClick={goToPrev} disabled={safeSlides.length <= 1} />
                <NavButton direction="next" onClick={goToNext} disabled={safeSlides.length <= 1} />
            </div>

            {/* Dot Indicators */}
            <div className="flex px-11 gap-2 opacity-80 mt-3">
                {safeSlides.map((_, i) => (
                    <DotIndicator key={i} isActive={index === i} onClick={() => goToDot(i)} />
                ))}
            </div>
        </div>
    );
}

/**
 * Component nút điều hướng
 */
function NavButton({ direction, onClick, disabled }) {
    const isNext = direction === 'next';
    const position = isNext ? '-right-4' : '-left-4';

    return (
        <button
            aria-label={isNext ? 'Next slide' : 'Previous slide'}
            onClick={onClick}
            disabled={disabled}
            className={`absolute ${position} top-1/2 -translate-y-1/2 grid place-items-center w-8 h-8 rounded-full bg-white text-gray-700 hover:bg-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold cursor-pointer shadow`}
        >
            {isNext ? (
                <svg
                    data-prefix="fas"
                    data-icon="chevron-right"
                    role="img"
                    viewBox="0 0 320 512"
                    aria-hidden="true"
                    className="w-3 h-3"
                >
                    <path
                        fill="currentColor"
                        d="M311.1 233.4c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L243.2 256 73.9 86.6c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0l192 192z"
                    ></path>
                </svg>
            ) : (
                <svg
                    data-prefix="fas"
                    data-icon="chevron-left"
                    role="img"
                    viewBox="0 0 320 512"
                    aria-hidden="true"
                    className="w-3 h-3"
                >
                    <path
                        fill="currentColor"
                        d="M9.4 233.4c-12.5 12.5-12.5 32.8 0 45.3l192 192c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L77.3 256 246.6 86.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0l-192 192z"
                    ></path>
                </svg>
            )}
        </button>
    );
}

/**
 * Component chỉ báo dot
 */
function DotIndicator({ isActive, onClick }) {
    return (
        <button
            onClick={onClick}
            aria-label="Go to slide"
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                isActive ? 'bg-gray-400 w-12' : 'bg-gray-300 hover:bg-gray-350 w-8'
            }`}
        />
    );
}

function SlideContent({ slide: s }) {
    return (
        <div className="rounded-2xl p-6 md:p-10 text-white relative min-h-[250px] md:min-h-[270px] lg:min-h-[300px] flex items-center">
            <div
                className={`absolute inset-0 ${
                    s.gradient || 'bg-linear-to-r from-indigo-500 via-purple-500 to-orange-400'
                }`}
            />
            <div className="relative z-10 flex justify-between items-center gap-6 w-full">
                <div className="max-w-xl">
                    <h2 className="text-2xl md:text-[32px] font-bold leading-tight">{s.title}</h2>
                    {s.subtitle ? (
                        <p className="mt-3 text-sm md:text-base opacity-95 max-w-[600px]">
                            {s.subtitle}
                        </p>
                    ) : null}
                    {s.ctaText ? (
                        <a
                            href={s.ctaHref || '#'}
                            className="inline-flex mt-6 h-10 items-center px-4 text-sm border-2 rounded-full hover:scale-105 transition-transform duration-300 uppercase font-bold"
                        >
                            {s.ctaText}
                        </a>
                    ) : null}
                </div>
                <div className="hidden md:flex justify-end items-center">
                    {s.rightImage ? (
                        <img
                            src={s.rightImage}
                            alt="slide_image"
                            className="max-h-40 md:max-h-48 lg:max-h-56 object-contain drop-shadow-md"
                        />
                    ) : null}
                </div>
            </div>
        </div>
    );
}
