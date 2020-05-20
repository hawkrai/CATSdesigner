export class StatisticResponse {
    resultMessage: string;
    attendance: Attendance[];
}

export class Attendance {
    day: string;
    count: number;
}
