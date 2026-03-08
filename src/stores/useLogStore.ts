import { create } from "zustand";

type LogStore = {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
};

export const useLogStore = create<LogStore>(set => ({
    currentDate: new Date(),
    setCurrentDate: date => set({ currentDate: date }),
}));
