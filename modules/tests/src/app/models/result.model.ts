import {TestPassResult} from "./test-pass-result.model";


export class Result {
  public Login: string;
  public Marks: any;
  public Number: number;
  public StudentName: string;
  public StudentShortName: string;
  public SubGroup: string;
  public TestPassResults: TestPassResult[];
  public groupName: string;
  public groupId: string;
}
