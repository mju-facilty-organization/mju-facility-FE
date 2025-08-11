import { useState, useCallback, useEffect } from 'react';
import { WeeklySchedules } from '@/types/RegularSchedule';

export const useTimeSlotDrag = (
  weeklySchedules: WeeklySchedules,
  setWeeklySchedules: React.Dispatch<React.SetStateAction<WeeklySchedules>>
) => {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDay, setDragStartDay] = useState<string | null>(null);
  const [dragStartSlot, setDragStartSlot] = useState<number | null>(null);
  const [dragMode, setDragMode] = useState<'select' | 'deselect' | null>(null);

  const handleMouseDown = useCallback(
    (day: string, slot: number, e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      setDragStartDay(day);
      setDragStartSlot(slot);
      const newMode = weeklySchedules[day][slot] ? 'deselect' : 'select';
      setDragMode(newMode);

      setWeeklySchedules((prev) => ({
        ...prev,
        [day]: prev[day].map((selected, index) =>
          index === slot ? newMode === 'select' : selected
        ),
      }));
    },
    [weeklySchedules, setWeeklySchedules]
  );

  const handleMouseEnter = useCallback(
    (day: string, slot: number) => {
      if (!isDragging || day !== dragStartDay) return;

      const startSlot = Math.min(dragStartSlot!, slot);
      const endSlot = Math.max(dragStartSlot!, slot);

      setWeeklySchedules((prev) => ({
        ...prev,
        [day]: prev[day].map((selected, index) =>
          index >= startSlot && index <= endSlot
            ? dragMode === 'select'
            : index < startSlot || index > endSlot
            ? prev[day][index]
            : selected
        ),
      }));
    },
    [isDragging, dragStartDay, dragStartSlot, dragMode, setWeeklySchedules]
  );

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      if (isDragging) {
        e.preventDefault();
        setIsDragging(false);
        setDragStartDay(null);
        setDragStartSlot(null);
        setDragMode(null);
      }
    },
    [isDragging]
  );

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mouseleave', handleMouseUp);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mouseleave', handleMouseUp);
      };
    }
  }, [isDragging, handleMouseUp]);

  return {
    isDragging,
    dragStartDay,
    handleMouseDown,
    handleMouseEnter,
  };
};
