import { useState, useEffect } from 'react';

/**
 * 自定义Hook，用于管理localStorage中的数据
 * @param key localStorage的键名
 * @param initialValue 默认值，当localStorage中没有数据时使用
 * @returns [storedValue, setValue] 存储的值和更新值的方法
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((val: T) => T)) => void] {
  // 创建内部状态，用于存储当前值
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // 检查localStorage是否可用
      if (typeof window === 'undefined') {
        return initialValue;
      }

      // 尝试从localStorage获取值
      const item = window.localStorage.getItem(key);
      // 如果存在则解析JSON，否则返回初始值
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // 如果出错（如JSON解析错误），则使用初始值
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // 用于更新localStorage和状态的方法
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // 允许函数式更新，类似于React的setState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      
      // 更新React状态
      setStoredValue(valueToStore);
      
      // 更新localStorage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      // 处理错误情况
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // 当key变化时，重新从localStorage读取数据
  useEffect(() => {
    try {
      if (typeof window === 'undefined') return;
      
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error re-reading localStorage key "${key}":`, error);
    }
  }, [key]);

  return [storedValue, setValue];
}

export default useLocalStorage;