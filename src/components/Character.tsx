import React from 'react';
import { CharacterAttributes } from '../types';

interface CharacterProps {
  attributes: CharacterAttributes;
  size?: number;
}

const colors = {
  red: '#FCA5A5',     // Soft red
  blue: '#AECBFA',    // Soft blue
  green: '#A7F3D0',   // Soft green
  yellow: '#FDE047',  // Soft yellow
};

const Character: React.FC<CharacterProps> = ({ attributes, size = 100 }) => {
  const { type, color, expression, hasHat, hasGlasses, hasRibbon, hasBag } = attributes;
  const mainColor = colors[color];

  return (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body / Head */}
      {type === 'human' && (
        <>
          <circle cx="50" cy="50" r="35" fill="#FFE0C2" />
          <path d="M 30 30 Q 50 10 70 30 Q 80 50 70 70 Q 50 90 30 70 Q 20 50 30 30 Z" fill={mainColor} opacity="0.2" className="hidden" />
          {/* Hair */}
          <path d="M 15 50 Q 50 -10 85 50 C 75 25 25 25 15 50 Z" fill={mainColor} />
        </>
      )}
      
      {type === 'animal' && (
        <>
          {/* Ears */}
          <polygon points="20,20 35,40 15,45" fill={mainColor} />
          <polygon points="80,20 65,40 85,45" fill={mainColor} />
          {/* Head */}
          <circle cx="50" cy="55" r="35" fill="#FFE0C2" />
          {/* Snout */}
          <ellipse cx="50" cy="65" rx="12" ry="8" fill="#FFCDB2" />
          <circle cx="50" cy="62" r="3" fill="#333" />
        </>
      )}

      {type === 'robot' && (
        <>
          {/* Antenna */}
          <rect x="48" y="5" width="4" height="20" fill="#999" />
          <circle cx="50" cy="5" r="5" fill={mainColor} />
          {/* Head */}
          <rect x="20" y="25" width="60" height="60" rx="10" fill="#E2E8F0" />
          {/* Robot details */}
          <rect x="25" y="80" width="50" height="5" fill="#CBD5E1" />
        </>
      )}

      {/* Eyes and Expression */}
      <g transform={type === 'robot' ? "translate(0, -5)" : "translate(0, 0)"}>
        {expression === 'smile' && (
          <>
            <circle cx="35" cy="45" r="4" fill="#333" />
            <circle cx="65" cy="45" r="4" fill="#333" />
            <path d="M 40 60 Q 50 70 60 60" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}
        {expression === 'sad' && (
          <>
            <circle cx="35" cy="45" r="4" fill="#333" />
            <circle cx="65" cy="45" r="4" fill="#333" />
            <path d="M 40 65 Q 50 55 60 65" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}
        {expression === 'surprise' && (
          <>
            <circle cx="35" cy="45" r="4" fill="#333" />
            <circle cx="65" cy="45" r="4" fill="#333" />
            <circle cx="50" cy="62" r="6" fill="#333" />
          </>
        )}
        {expression === 'wink' && (
          <>
            <path d="M 30 45 Q 35 40 40 45" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none" />
            <circle cx="65" cy="45" r="4" fill="#333" />
            <path d="M 40 60 Q 50 70 60 60" stroke="#333" strokeWidth="3" strokeLinecap="round" fill="none" />
          </>
        )}
      </g>

      {/* Accessories */}
      {hasHat && (
        <g transform="translate(0, -5)">
          <path d="M 20 25 L 80 25 L 60 5 Z" fill={mainColor} />
          <path d="M 10 25 L 90 25 L 90 30 L 10 30 Z" fill="#333" opacity="0.1" />
        </g>
      )}

      {hasGlasses && (
        <g transform={type === 'robot' ? "translate(0, -5)" : "translate(0, 0)"}>
          <rect x="25" y="40" width="20" height="10" rx="2" stroke="#333" strokeWidth="3" fill="none" />
          <rect x="55" y="40" width="20" height="10" rx="2" stroke="#333" strokeWidth="3" fill="none" />
          <line x1="45" y1="45" x2="55" y2="45" stroke="#333" strokeWidth="3" />
        </g>
      )}

      {hasRibbon && (
        <g transform={type === 'robot' ? "translate(20, 75)" : "translate(20, 70)"}>
          <path d="M 50 15 L 40 5 L 40 25 Z" fill="#FF4D4D" />
          <path d="M 50 15 L 60 5 L 60 25 Z" fill="#FF4D4D" />
          <circle cx="50" cy="15" r="4" fill="#CC0000" />
        </g>
      )}

      {hasBag && (
        <g transform="translate(70, 60)">
          <rect x="0" y="0" width="20" height="25" rx="3" fill="#A0522D" />
          <path d="M 5 0 Q 10 -10 15 0" stroke="#8B4513" strokeWidth="2" fill="none" />
          <rect x="5" y="10" width="10" height="5" rx="1" fill="#D2B48C" />
        </g>
      )}

    </svg>
  );
};

export default Character;
