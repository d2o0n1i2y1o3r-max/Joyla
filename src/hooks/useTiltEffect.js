import { useState, useRef, useEffect } from 'react';

export const useTiltEffect = (maxRotation = 15) => {
  const [transform, setTransform] = useState({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
  });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;

    const rotateX = (mouseY / (rect.height / 2)) * -maxRotation;
    const rotateY = (mouseX / (rect.width / 2)) * maxRotation;

    setTransform({
      rotateX: Math.max(-maxRotation, Math.min(maxRotation, rotateX)),
      rotateY: Math.max(-maxRotation, Math.min(maxRotation, rotateY)),
      scale: 1.05,
    });
  };

  const handleMouseLeave = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  };

  const handleTouchMove = (e) => {
    if (!cardRef.current || e.touches.length !== 1) return;

    const touch = e.touches[0];
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const touchX = touch.clientX - centerX;
    const touchY = touch.clientY - centerY;

    const rotateX = (touchY / (rect.height / 2)) * -maxRotation;
    const rotateY = (touchX / (rect.width / 2)) * maxRotation;

    setTransform({
      rotateX: Math.max(-maxRotation, Math.min(maxRotation, rotateX)),
      rotateY: Math.max(-maxRotation, Math.min(maxRotation, rotateY)),
      scale: 1.05,
    });
  };

  const handleTouchEnd = () => {
    setTransform({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
    });
  };

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchEnd);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
    };
  }, []);

  return { cardRef, transform };
};
