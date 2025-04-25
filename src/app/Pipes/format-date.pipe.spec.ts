import { FormatDatePipe } from './format-date.pipe';

describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe;
  
  // Test dates
  const testDate = new Date(2025, 0, 15); // January 15, 2025
  const singleDigitDate = new Date(2025, 1, 5); // February 5, 2025
  const singleDigitMonthDate = new Date(2025, 5, 15); // June 15, 2025
  const singleDigitBothDate = new Date(2025, 5, 5); // June 5, 2025

  beforeEach(() => {
    pipe = new FormatDatePipe();
  });

  it('should create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  describe('transform method', () => {
    it('should format date with format type 1 (ddMMyyyy)', () => {
      const result = pipe.transform(testDate, 1);
      expect(result).toBe('15012025');
    });

    it('should format date with format type 2 (dd / MM / yyyy)', () => {
      const result = pipe.transform(testDate, 2);
      expect(result).toBe('15 / 01 / 2025');
    });

    it('should format date with format type 3 (dd/MM/yyyy)', () => {
      const result = pipe.transform(testDate, 3);
      expect(result).toBe('15/01/2025');
    });

    it('should format date with format type 4 (yyyy-MM-dd)', () => {
      const result = pipe.transform(testDate, 4);
      expect(result).toBe('2025-01-15');
    });

    it('should handle invalid format type by returning empty string', () => {
      const result = pipe.transform(testDate, 10);
      expect(result).toBe('');
    });

    it('should handle null format type by returning empty string', () => {
      const result = pipe.transform(testDate, null as any);
      expect(result).toBe('');
    });
  });

  describe('needZero method', () => {
    it('should add leading zeros for single digit day', () => {
      expect(pipe.transform(singleDigitDate, 1)).toBe('05022025');
      expect(pipe.transform(singleDigitDate, 3)).toBe('05/02/2025');
    });

    it('should add leading zeros for single digit month', () => {
      expect(pipe.transform(singleDigitMonthDate, 1)).toBe('15062025');
      expect(pipe.transform(singleDigitMonthDate, 3)).toBe('15/06/2025');
    });

    it('should add leading zeros for both single digit day and month', () => {
      expect(pipe.transform(singleDigitBothDate, 1)).toBe('05062025');
      expect(pipe.transform(singleDigitBothDate, 3)).toBe('05/06/2025');
    });

    it('should not add leading zeros for double digit numbers', () => {
      // Testing the private method through the transform method
      const dateWithDoubleDigits = new Date(2025, 10, 10); // November 10, 2025
      expect(pipe.transform(dateWithDoubleDigits, 1)).toBe('10112025');
    });
  });

  describe('edge cases', () => {
    it('should handle year change correctly', () => {
      const yearEndDate = new Date(2025, 11, 31); // December 31, 2025
      expect(pipe.transform(yearEndDate, 3)).toBe('31/12/2025');
      
      const yearStartDate = new Date(2025, 0, 1); // January 1, 2025
      expect(pipe.transform(yearStartDate, 3)).toBe('01/01/2025');
    });

    it('should handle different date inputs', () => {
      // Test with date string
      const dateString = '2025-01-15T00:00:00';
      expect(pipe.transform(dateString as any, 3)).toBe('15/01/2025');
      
      // Test with timestamp
      const timestamp = new Date(2025, 0, 15).getTime();
      expect(pipe.transform(timestamp as any, 3)).toBe('15/01/2025');
    });
  });
});
