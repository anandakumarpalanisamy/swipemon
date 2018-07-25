export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  projectId: string;
  projectName: string;
  totalMonthHours: number;
  dayLevelStats?: DayPunch [];
}

export interface DayPunch {
  date: string;
  dayOfWeek: string;
  punchIn: string;
  punchOut: string;
  totalHours: number;
  totalProductiveHours: number;
}
