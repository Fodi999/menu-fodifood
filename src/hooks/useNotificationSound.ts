import { useEffect, useRef, useCallback } from 'react';

export function useNotificationSound() {
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio Context and Strudel
  useEffect(() => {
    // Initialize Web Audio Context
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContextRef.current = new AudioContextClass();
        console.log('✅ Web Audio Context initialized');
      }
    } catch (error) {
      console.log('⚠️ Could not initialize Web Audio Context:', error);
    }

    // Load Strudel library for synthesized notification sound (fallback)
    const loadStrudel = () => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/strudel@latest/dist/strudel.min.js';
      script.async = true;
      script.onload = () => {
        console.log('✅ Strudel audio library loaded');
      };
      script.onerror = () => {
        console.log('⚠️ Strudel failed to load, using Web Audio API');
      };
      document.head.appendChild(script);
    };

    loadStrudel();
  }, []);

  // Play notification sound
  const playSound = useCallback(() => {
    // Primary: Use Web Audio API for restaurant kitchen notification melody
    if (audioContextRef.current) {
      try {
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;
        
        // Create gain node for volume control
        const masterGain = ctx.createGain();
        masterGain.connect(ctx.destination);
        masterGain.gain.setValueAtTime(0.5, now);
        
        // Play "Ding-Dong" melody 3 times with 1 second intervals
        for (let i = 0; i < 3; i++) {
          const offset = i * 1.0; // 1 second between each repetition
          
          // First tone: C5 (523 Hz) - "Ding"
          const osc1 = ctx.createOscillator();
          const gain1 = ctx.createGain();
          osc1.type = 'sine';
          osc1.frequency.setValueAtTime(523.25, now + offset); // C5
          osc1.connect(gain1);
          gain1.connect(masterGain);
          
          gain1.gain.setValueAtTime(0, now + offset);
          gain1.gain.linearRampToValueAtTime(0.8, now + offset + 0.01);
          gain1.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.3);
          
          osc1.start(now + offset);
          osc1.stop(now + offset + 0.3);
          
          // Second tone: G4 (392 Hz) - "Dong" (slightly lower)
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(392.00, now + offset + 0.15); // G4
          osc2.connect(gain2);
          gain2.connect(masterGain);
          
          gain2.gain.setValueAtTime(0, now + offset + 0.15);
          gain2.gain.linearRampToValueAtTime(0.6, now + offset + 0.16);
          gain2.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.45);
          
          osc2.start(now + offset + 0.15);
          osc2.stop(now + offset + 0.45);
          
          // Add harmonic richness with C6 (octave higher) - subtle
          const harmonic = ctx.createOscillator();
          const harmonicGain = ctx.createGain();
          harmonic.type = 'triangle';
          harmonic.frequency.setValueAtTime(1046.50, now + offset); // C6
          harmonic.connect(harmonicGain);
          harmonicGain.connect(masterGain);
          
          harmonicGain.gain.setValueAtTime(0, now + offset);
          harmonicGain.gain.linearRampToValueAtTime(0.15, now + offset + 0.01);
          harmonicGain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.25);
          
          harmonic.start(now + offset);
          harmonic.stop(now + offset + 0.25);
          
          // Final chime (E5) - only on the last repetition
          if (i === 2) {
            const finalChime = ctx.createOscillator();
            const finalGain = ctx.createGain();
            finalChime.type = 'sine';
            finalChime.frequency.setValueAtTime(659.25, now + offset + 0.5); // E5
            finalChime.connect(finalGain);
            finalGain.connect(masterGain);
            
            finalGain.gain.setValueAtTime(0, now + offset + 0.5);
            finalGain.gain.linearRampToValueAtTime(0.5, now + offset + 0.51);
            finalGain.gain.exponentialRampToValueAtTime(0.01, now + offset + 1.2);
            
            finalChime.start(now + offset + 0.5);
            finalChime.stop(now + offset + 1.2);
          }
        }
        
        console.log('🔔 Playing 3x Ding-Dong notification melody');
        return;
      } catch (error) {
        console.log('⚠️ Web Audio API error:', error);
      }
    }

    // Secondary fallback: Try Strudel if available
    if (typeof window !== 'undefined' && (window as any).strudel) {
      try {
        const { stack, s } = (window as any).strudel;
        
        if ((window as any).strudel.initAudio) {
          (window as any).strudel.initAudio();
        }
        
        const pattern = stack(
          s("bd").gain(2.0).speed(0.8),
          s("hh").gain(1.5).speed(1.2),
          s("sd").gain(1.8).delay(0.15)
        );

        pattern.gain(2.5).once();
        console.log('🔊 Playing Strudel notification');
        return;
      } catch (error) {
        console.log('⚠️ Strudel error:', error);
      }
    }

    console.log('ℹ️ No audio method available');
  }, []);

  return { playSound };
}
