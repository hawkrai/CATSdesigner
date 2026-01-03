export interface TestResult {
  testId: number;
  startTime?: string;
  points?: number;
  percent?: number;
  endTime?: string;
  testName?: string;
  studentId?: number;
}

export interface StudentData {
  id: number;
  name: string;
  test: TestResult[];
}

export type StudentMapEntry = [unknown, StudentData];

