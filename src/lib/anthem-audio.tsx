"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";

// 192k re-encode of The Anthem: 2.8MB vs the 4.0MB original (which also
// carries a 1024x1024 cover that no UI ever shows). First-click latency
// is the whole experience — the smaller the file, the faster the record.
const ANTHEM_SRC = "/assets/dj-lethal-skillz-the-anthem-192k.mp3";

type AnthemValue = {
  playing: boolean;
  time: number;
  duration: number;
  toggle: () => void;
};

const AnthemContext = createContext<AnthemValue>({
  playing: false,
  time: 0,
  duration: 0,
  toggle: () => {},
});

/** One shared audio element — the HQ soundtrack. Every controller (bridge
 *  deck, footer vinyl) reads and drives the same source of truth. */
export function AnthemProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const toggle = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) void audio.play();
    else audio.pause();
  }, []);

  return (
    <AnthemContext.Provider value={{ playing, time, duration, toggle }}>
      <audio
        ref={audioRef}
        src={ANTHEM_SRC}
        preload="none"
        className="sr-only"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onEnded={() => {
          setPlaying(false);
          setTime(0);
        }}
        onTimeUpdate={(e) => setTime(e.currentTarget.currentTime)}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
      />
      {children}
    </AnthemContext.Provider>
  );
}

export function useAnthem() {
  return useContext(AnthemContext);
}
