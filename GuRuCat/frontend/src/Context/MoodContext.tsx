import React, { createContext, useContext, useState } from 'react';

type MoodContextType = {
  mood: string | null;
  setMood: (mood: string | null) => void;
};

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mood, setMood] = useState<string | null>(null);

  return (
    <MoodContext.Provider value={{ mood, setMood }}>
      {children}
    </MoodContext.Provider>
  );
};

export const useMood = () => {
  const context = useContext(MoodContext);
  if (!context) {
    throw new Error('useMood ใช้ได้แค่ใน provider');
  }
  return context;
};
