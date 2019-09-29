import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {TestPassingService} from '../../service/test-passing.service';
import {TestAvailable} from '../../models/test-available.model';
import {Router} from '@angular/router';


@Component({
  selector: 'app-main-table-tests',
  templateUrl: './main-table-tests.component.html',
  styleUrls: ['./main-table-tests.component.css']
})
export class MainTableTestsComponent implements OnInit {

  @Input()
  public title: string;

  @Input()
  public allowChanges: boolean;

  @Input()
  public tests: TestAvailable[];

  @Output()
  public onOpenEditPopup: EventEmitter<any> = new EventEmitter();

  @Output()
  public onOpenAvailabilityPopup: EventEmitter<any> = new EventEmitter();

  @Output()
  public onDeleteTest: EventEmitter<string> = new EventEmitter();

  public test: any;

  displayedColumns: string[] = ['Id', 'Title', 'action'];

  constructor(private testPassingService: TestPassingService,
              private router: Router) {
  }

  ngOnInit() {
    console.log('title' + ' ' + this.title);
    console.log('allowChanges' + ' ' + this.allowChanges);
    console.log('tests' + ' ' + this.tests);
  }

  public navigateToTest(Id: number): void {
    this.router.navigate(['test/' + Id]);
  }

  public openEditPopup(element): void {
    this.onOpenEditPopup.emit(element);
  }

  public deleteTest(testId): void {
    this.onDeleteTest.emit(testId);
  }

  public openAvailabilityPopup(testId): void {
    this.onOpenAvailabilityPopup.emit(testId);
  }
}
