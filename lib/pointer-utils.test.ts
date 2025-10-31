import { describe, test, expect } from 'bun:test';
import {
  handlePointerDownLogic,
  handlePointerMoveLogic,
} from './pointer-utils';

describe('pointer-utils', () => {
  describe('handlePointerDownLogic', () => {
    test('returns drag start and end for valid date', () => {
      const date = new Date('2025-01-15');
      const result = handlePointerDownLogic(date);
      
      expect(result).not.toBe(null);
      expect(result?.dragStart).toEqual(date);
      expect(result?.dragEnd).toEqual(date);
    });

    test('returns null for invalid date', () => {
      const result = handlePointerDownLogic(new Date('invalid'));
      expect(result).toBe(null);
    });

    test('returns null for null date', () => {
      const result = handlePointerDownLogic(null as any);
      expect(result).toBe(null);
    });
  });

  describe('handlePointerMoveLogic', () => {
    test('returns new date when dragging to different date', () => {
      const dragStart = new Date('2025-01-15');
      const currentDragEnd = new Date('2025-01-16');
      const newDate = new Date('2025-01-17');
      
      const result = handlePointerMoveLogic(newDate, true, dragStart, currentDragEnd);
      expect(result).toEqual(newDate);
    });

    test('returns null when not dragging', () => {
      const dragStart = new Date('2025-01-15');
      const currentDragEnd = new Date('2025-01-16');
      const newDate = new Date('2025-01-17');
      
      const result = handlePointerMoveLogic(newDate, false, dragStart, currentDragEnd);
      expect(result).toBe(null);
    });

    test('returns null when drag start is null', () => {
      const currentDragEnd = new Date('2025-01-16');
      const newDate = new Date('2025-01-17');
      
      const result = handlePointerMoveLogic(newDate, true, null, currentDragEnd);
      expect(result).toBe(null);
    });

    test('returns null when new date is invalid', () => {
      const dragStart = new Date('2025-01-15');
      const currentDragEnd = new Date('2025-01-16');
      
      const result = handlePointerMoveLogic(new Date('invalid'), true, dragStart, currentDragEnd);
      expect(result).toBe(null);
    });

    test('returns null when moving to same date', () => {
      const dragStart = new Date('2025-01-15');
      const currentDragEnd = new Date('2025-01-16');
      const sameDate = new Date('2025-01-16');
      
      const result = handlePointerMoveLogic(sameDate, true, dragStart, currentDragEnd);
      expect(result).toBe(null);
    });

    test('returns new date when current drag end is null', () => {
      const dragStart = new Date('2025-01-15');
      const newDate = new Date('2025-01-17');
      
      const result = handlePointerMoveLogic(newDate, true, dragStart, null);
      expect(result).toEqual(newDate);
    });
  });
});

