import { useState, useEffect, useCallback } from 'react';
import { Howl, Howler } from 'howler';
import useLocalStorage from './useLocalStorage';

// 定义音效类型
type SoundType = 'correct' | 'incorrect' | 'hint' | 'complete' | 'start' | 'click';

// 音效文件路径映射
const SOUND_PATHS: Record<SoundType, string> = {
  correct: '/sounds/correct.mp3',
  incorrect: '/sounds/incorrect.mp3',
  hint: '/sounds/hint.mp3',
  complete: '/sounds/level-complete.mp3',
  start: '/sounds/game-start.mp3',
  click: '/sounds/click.mp3'
};

// 自定义钩子接口
interface UseSoundsReturn {
  playSound: (soundType: SoundType) => void;
  setVolume: (volume: number) => void;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  currentVolume: number;
}

/**
 * 自定义Hook，用于管理游戏音效
 * @returns 音效控制方法和状态
 */
export function useSounds(): UseSoundsReturn {
  // 使用localStorage保存音效设置
  const [isSoundEnabled, setIsSoundEnabled] = useLocalStorage<boolean>('sound-enabled', true);
  const [currentVolume, setCurrentVolume] = useLocalStorage<number>('sound-volume', 0.7);
  
  // 保存已加载的音效
  const [sounds, setSounds] = useState<Record<SoundType, Howl | null>>({
    correct: null,
    incorrect: null,
    hint: null,
    complete: null,
    start: null,
    click: null
  });

  // 初始化音效
  useEffect(() => {
    // 创建音效对象
    const loadedSounds: Record<SoundType, Howl> = {} as Record<SoundType, Howl>;
    
    // 加载所有音效
    Object.entries(SOUND_PATHS).forEach(([key, path]) => {
      loadedSounds[key as SoundType] = new Howl({
        src: [path],
        volume: currentVolume,
        preload: true,
        onloaderror: (id, error) => console.error(`Error loading sound ${key}:`, error)
      });
    });
    
    setSounds(loadedSounds);
    
    // 设置全局音量
    Howler.volume(currentVolume);
    
    // 清理函数
    return () => {
      // 停止并卸载所有音效
      Object.values(loadedSounds).forEach(sound => {
        if (sound) sound.unload();
      });
    };
  }, []);

  // 更新全局音量
  useEffect(() => {
    Howler.volume(currentVolume);
    
    // 更新每个音效的音量
    Object.values(sounds).forEach(sound => {
      if (sound) sound.volume(currentVolume);
    });
  }, [currentVolume, sounds]);

  // 播放音效的方法
  const playSound = useCallback((soundType: SoundType) => {
    // 如果音效被禁用，则不播放
    if (!isSoundEnabled) return;
    
    const sound = sounds[soundType];
    if (sound) {
      // 停止之前可能正在播放的同类音效
      sound.stop();
      // 播放音效
      sound.play();
    }
  }, [sounds, isSoundEnabled]);

  // 设置音量的方法
  const setVolume = useCallback((volume: number) => {
    // 确保音量在有效范围内
    const validVolume = Math.max(0, Math.min(1, volume));
    setCurrentVolume(validVolume);
  }, [setCurrentVolume]);

  // 切换音效开关的方法
  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prevState => !prevState);
  }, [setIsSoundEnabled]);

  return {
    playSound,
    setVolume,
    isSoundEnabled,
    toggleSound,
    currentVolume
  };
}

export default useSounds;