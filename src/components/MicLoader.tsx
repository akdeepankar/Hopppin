import React, { useEffect, useRef, useState } from 'react';

const letters = 'Connecting...'.split('');

export default function MicLoader({ active = true }: { active?: boolean }) {
  const [animation, setAnimation] = useState<'in' | 'out' | undefined>(
    undefined
  );
  const prevActive = useRef(active);

  useEffect(() => {
    if (active && !prevActive.current) {
      setAnimation('in');
    } else if (!active && prevActive.current) {
      setAnimation('out');
      // After animation, reset to static
      setTimeout(() => setAnimation(undefined), 400);
    }
    prevActive.current = active;
  }, [active]);

  return (
    <div
      className="mic-loader-wrapper"
      style={
        animation === 'in'
          ? { animation: 'mic-loader-scale-in 0.4s cubic-bezier(0.4,0,0.2,1)' }
          : animation === 'out'
            ? {
                animation:
                  'mic-loader-scale-out 0.4s cubic-bezier(0.4,0,0.2,1)',
              }
            : {}
      }
    >
      {active
        ? letters.map((l, i) => (
            <span
              className="mic-loader-letter"
              key={i}
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {l}
            </span>
          ))
        : letters.map((_, i) => (
            <span
              className="mic-loader-letter"
              key={i}
              style={{ animation: 'none', opacity: 0 }}
            >
              &nbsp;
            </span>
          ))}
      <div
        className="mic-loader-circle"
        style={active ? {} : { animation: 'none' }}
      />
      <style>{`
				@keyframes mic-loader-scale-out {
					0% {
						transform: scale(1);
						opacity: 1;
					}
					100% {
						transform: scale(0.5);
						opacity: 0.2;
					}
				}
				@keyframes mic-loader-scale-in {
					0% {
						transform: scale(0.5);
						opacity: 0.2;
					}
					80% {
						transform: scale(1.08);
						opacity: 1;
					}
					100% {
						transform: scale(1);
						opacity: 1;
					}
				}
				.mic-loader-wrapper {
					position: relative;
					display: flex;
					align-items: center;
					justify-content: center;
					width: 180px;
					height: 180px;
					font-family: 'Inter', sans-serif;
					font-size: 1.2em;
					font-weight: 300;
					color: white;
					border-radius: 50%;
					background-color: transparent;
					user-select: none;
				}
				.mic-loader-circle {
					position: absolute;
					top: 0;
					left: 0;
					width: 100%;
					aspect-ratio: 1 / 1;
					border-radius: 50%;
					background-color: transparent;
					animation: mic-loader-rotate 2s linear infinite;
					z-index: 0;
				}
				@keyframes mic-loader-rotate {
					0% {
						transform: rotate(90deg);
						box-shadow:
							0 10px 20px 0 #fff inset,
							0 20px 30px 0 #ad5fff inset,
							0 60px 60px 0 #471eec inset;
					}
					50% {
						transform: rotate(270deg);
						box-shadow:
							0 10px 20px 0 #fff inset,
							0 20px 10px 0 #d60a47 inset,
							0 40px 60px 0 #311e80 inset;
					}
					100% {
						transform: rotate(450deg);
						box-shadow:
							0 10px 20px 0 #fff inset,
							0 20px 30px 0 #ad5fff inset,
							0 60px 60px 0 #471eec inset;
					}
				}
				.mic-loader-letter {
					display: inline-block;
					opacity: 0.4;
					transform: translateY(0);
					animation: mic-loader-letter-anim 2s infinite;
					z-index: 1;
					border-radius: 50ch;
					border: none;
				}
				@keyframes mic-loader-letter-anim {
					0%, 100% {
						opacity: 0.4;
						transform: translateY(0);
					}
					20% {
						opacity: 1;
						transform: scale(1.15);
					}
					40% {
						opacity: 0.7;
						transform: translateY(0);
					}
				}
			`}</style>
    </div>
  );
}
