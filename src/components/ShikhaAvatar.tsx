import React, { useState, useEffect } from 'react';
import { SHIKHA_AVATAR_BASE64 } from '../utils/avatarData';
import { AssistantStatus } from '../types';

interface ShikhaAvatarProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBorder?: boolean;
  status?: AssistantStatus;
}

export const ShikhaAvatar: React.FC<ShikhaAvatarProps> = ({
  size = 'md',
  className = '',
  showBorder = true,
  status = 'idle',
}) => {
  const [hasError, setHasError] = useState(false);
  const [avatarSrc, setAvatarSrc] = useState<string>(() => {
    try {
      return localStorage.getItem('shikha_custom_avatar_base64') || SHIKHA_AVATAR_BASE64;
    } catch {
      return SHIKHA_AVATAR_BASE64;
    }
  });

  // Listen for custom avatar updates across components
  useEffect(() => {
    const handleAvatarUpdate = () => {
      try {
        const saved = localStorage.getItem('shikha_custom_avatar_base64');
        setAvatarSrc(saved || SHIKHA_AVATAR_BASE64);
        setHasError(false);
      } catch {
        // ignore
      }
    };

    window.addEventListener('shikha-avatar-updated', handleAvatarUpdate);
    return () => {
      window.removeEventListener('shikha-avatar-updated', handleAvatarUpdate);
    };
  }, []);

  // Size mappings
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  }[size];

  // Dynamic glow ring based on status requirement:
  // "The glow pulses around the avatar while she speaks, and a calm static ring shows while listening or thinking."
  let glowClasses = '';
  if (showBorder) {
    if (status === 'speaking') {
      glowClasses = 'ring-4 ring-amber-400 shadow-xl shadow-amber-500/60 animate-pulse';
    } else if (status === 'listening' || status === 'thinking') {
      glowClasses = 'ring-2 ring-amber-500/90 shadow-md shadow-amber-500/30';
    } else {
      glowClasses = 'ring-2 ring-amber-500/40 shadow-sm shadow-amber-500/10';
    }
  }

  // If it fails to load, show an orange circle with the letter "S"
  if (hasError || !avatarSrc) {
    return (
      <div
        className={`relative rounded-full bg-orange-500 text-white font-bold flex items-center justify-center font-serif select-none shrink-0 transition-all duration-300 ${glowClasses} ${sizeClasses} ${className}`}
        aria-label="Shikha ji fallback avatar"
      >
        <span>S</span>
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden shrink-0 select-none transition-all duration-300 ${glowClasses} ${sizeClasses} ${className}`}
    >
      <img
        src={avatarSrc}
        alt="Shikha ji Profile"
        onError={() => setHasError(true)}
        className="w-full h-full object-cover object-[center_28%] rounded-full"
        loading="eager"
      />
    </div>
  );
};
