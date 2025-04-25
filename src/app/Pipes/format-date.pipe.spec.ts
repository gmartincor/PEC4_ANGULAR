import { FormatDatePipe } from './format-date.pipe';

describe('FormatDatePipe', () => {
  let pipe: FormatDatePipe;
  
  // Test date: January 15, 2025
  const testDate = new Date(2025, 0, 15); // Month is 0-indexed in JavaScript Date

  beforeEach(() => {
    pipe = new FormatDatePipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

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

  // Testing with a different date that has single-digit day and month
  it('should add leading zeros for single digit day and month', () => {
    const singleDigitDate = new Date(2025, 1, 5); // February 5, 2025
    expect(pipe.transform(singleDigitDate, 1)).toBe('05022025');
    expect(pipe.transform(singleDigitDate, 3)).toBe('05/02/2025');
  });
});
