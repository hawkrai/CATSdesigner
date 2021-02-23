import {ChangeDetectorRef, Component, Inject, OnInit, ViewChild} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef, MatRadioChange, MatSnackBar} from "@angular/material";
import {TestService} from "../../../service/test.service";
import {Question} from "../../../models/question/question.model";
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Answer} from "../../../models/question/answer.model";
import {ActivatedRoute} from "@angular/router";
import {AutoUnsubscribe} from "../../../decorator/auto-unsubscribe";
import {AutoUnsubscribeBase} from "../../../core/auto-unsubscribe-base";
import {combineLatest, of, Subject} from "rxjs";
import {catchError, takeUntil, tap} from "rxjs/operators";
import {Base64UploaderPlugin} from "../../../core/Base64Upload";
import {FormUtils} from "../../../utils/form.utils";
import {NavItem} from "../../../models/nav-item";
import {TranslatePipe} from "../../../../../../../container/src/app/pipe/translate.pipe";


@AutoUnsubscribe
@Component({
  selector: "app-question-popup",
  templateUrl: "./question-popup.component.html",
  styleUrls: ["./question-popup.component.less"]
})
export class QuestionPopupComponent extends AutoUnsubscribeBase implements OnInit {
  public question: Question = new Question();
  public chosenQuestionType: any = 0;
  public chosenType: any;
  navItems: NavItem[] = [];
  ckconfig = {
    // include any other configuration you want
    extraPlugins: [Base64UploaderPlugin]
  };
  name = "ng2-ckeditor";
  ckeConfig: any;
  log: string = "";
  @ViewChild("myckeditor", {static: true}) ckeditor: any;

  public chars: { [key: string]: string } = {};
  public charsNeskolko: { [key: string]: any[] } = {};
  public charsWords: { [key: string]: string } = {};
  public charsSequence: { [key: string]: string } = {};
  public charsde: any;
  public newCase: boolean;
  public readonly ANSWER_TYPES: any = [{id: 0, label: "text.test.one.variant"},
    {id: 1, label: "text.test.many.variant"},
    {id: 2, label: "text.test.from.keyboard"},
    {id: 3, label: "text.test.sequence"}];
  public formGroup: FormGroup;
  public concept: any;
  public loader: boolean;
  public selectedConcept: string;
  private unsubscribeStream$: Subject<void> = new Subject<void>();
  private conceptId: any;

  constructor(public dialogRef: MatDialogRef<QuestionPopupComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private testService: TestService,
              private snackBar: MatSnackBar,
              private translatePipe: TranslatePipe,
              private formBuilder: FormBuilder,
              private route: ActivatedRoute,
              private cdr: ChangeDetectorRef) {
    super();
  }

  ngOnInit() {
    this.loader = true;
    const subject = JSON.parse(localStorage.getItem("currentSubject"));
    this.ckeConfig = {
      allowedContent: true,
      extraPlugins: "divarea",
      forcePasteAsPlainText: false
    };
    this.initForm();
    if (this.data.event) {
      combineLatest(this.testService.getQuestion(this.data.event), (this.data.isEUMKTest ? this.testService.getConcepts(subject.id) : of(null)))
        .pipe(takeUntil(this.unsubscribeStream$),
          catchError(error => {
            this.loader = false;
            return of(false);
          }))
        .subscribe(([question, concept]) => {
          this.question = question;
          this.navItems = concept;
          if (this.data.isEUMKTest) {
            this.conceptId = question.ConceptId;
            this.getConceptName();
          }
          this.newCase = false;
          this.formGroup = this.formBuilder.group({
            title: new FormControl(this.question.Title, Validators.compose([
              Validators.maxLength(255), Validators.required
            ])),
            description: new FormControl(this.question.Description, Validators.compose([
              Validators.maxLength(1000)
            ])),
            ComplexityLevel: new FormControl(this.question.ComplexityLevel, Validators.compose([
              Validators.max(10),
              Validators.min(1),
              Validators.required
            ]))
          });
          this.chosenQuestionType = question.QuestionType;
          this.initExisting(this.question.Answers);
          this.loader = false;
        });
    } else {
      this.newCase = true;
      if (this.data.isEUMKTest) {
        this.testService.getConcepts(subject.id)
          .pipe(
            tap((concept) => this.navItems = concept),
            takeUntil(this.unsubscribeStream$)
          ).subscribe();
      }
      this.question.ComlexityLevel = 1;
      this.question.ComplexityLevel = 1;
      this.formGroup = this.formBuilder.group({
        title: new FormControl("", Validators.compose([
          Validators.maxLength(255), Validators.required
        ])),
        description: new FormControl("", Validators.compose([
          Validators.maxLength(1000)
        ])),
        ComplexityLevel: new FormControl(1, Validators.compose([
          Validators.max(10),
          Validators.min(1),
          Validators.required
        ]))
      });
      this.loader = false;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChange(event) {
    console.log("changed");
  }

  onBlur(event) {
    console.log("blur " + event);
  }

  public addAnswer(): void {
    if (this.chosenQuestionType === 0) {
      let num: any = Object.keys(this.chars)[Object.keys(this.chars).length - 1];
      num = Number(num.split("key")[1]);
      this.chars["key" + (num + 1)] = "";
      this.charsde = Object.keys(this.chars);
      console.log(this.chosenType);
    } else if (this.chosenQuestionType === 1) {
      let num: any = Object.keys(this.charsNeskolko)[Object.keys(this.charsNeskolko).length - 1];
      num = Number(num.split("key")[1]);
      this.charsNeskolko["key" + (num + 1)] = [];
      this.charsNeskolko["key" + (num + 1)][0] = "";
      this.charsNeskolko["key" + (num + 1)][1] = false;
      this.charsde = Object.keys(this.charsNeskolko);
    } else if (this.chosenQuestionType === 2) {
      let num: any = Object.keys(this.charsWords)[Object.keys(this.charsWords).length - 1];
      num = Number(num.split("key")[1]);
      this.charsWords["key" + (num + 1)] = "";
      this.charsde = Object.keys(this.charsWords);
    } else if (this.chosenQuestionType === 3) {
      let num: any = Object.keys(this.charsSequence)[Object.keys(this.charsSequence).length - 1];
      num = Number(num.split("key")[1]);
      this.charsSequence  ["key" + (num + 1)] = "";
      this.charsde = Object.keys(this.charsSequence);
    }
    this.cdr.detectChanges();
  }

  public onValueChange(event): void {
    this.chosenQuestionType = event.source.value;
    this.charsde = [];
    this.question["QuestionType"] = event.source.value;
    if (this.chosenQuestionType === 0) {
      this.initForm();
    } else if (this.chosenQuestionType === 1) {
      this.initNeskolko();
    } else if (this.chosenQuestionType === 2) {
      this.initWords();
    } else if (this.chosenQuestionType === 3) {
      this.initSequence();
    }
    this.cdr.detectChanges();
  }

  kkkk($event: MatRadioChange) {
    console.log(this.chosenType);

  }

  public deleteAnswer(control: string) {
    if (this.chosenQuestionType === 0) {
      delete this.chars[control];
      this.charsde = Object.keys(this.chars);
    } else if (this.chosenQuestionType === 1) {
      delete this.charsNeskolko[control];
      this.charsde = Object.keys(this.charsNeskolko);
    } else if (this.chosenQuestionType === 2) {
      delete this.charsWords[control];
      this.charsde = Object.keys(this.charsWords);
    } else if (this.chosenQuestionType === 3) {
      delete this.charsSequence[control];
      this.charsde = Object.keys(this.charsSequence);
    }
    this.cdr.detectChanges();
  }

  public writeTitle(event, control, number?: boolean): void {
    console.log(event.target.value);

    this.question[control] = number ? Number(event.target.value) : event.target.value;
  }

  onChange1($event: any): void {
    console.log("onChange");
    //this.log += new Date() + "<br />";
  }

  onPaste($event: any): void {
    console.log("onPaste");
    //this.log += new Date() + "<br />";
  }

  public onYesClick() {
    if (this.formGroup.valid) {
      this.question.Answers = [];
      if (this.chosenQuestionType === 0) {
        if (this.chosenType) {
          Object.values(this.chars).forEach((value) => {
            let question = new Answer();
            question["Content"] = value;
            question["IsCorrect"] = 0;
            this.question.Answers.push(question);
          });
          let num = Number(this.chosenType.split("key")[1]);
          this.question.Answers[num].IsCorrect = 1;
          this.question.Answers[0].QuestionId = 0;
        } else {
          this.openSnackBar(this.translatePipe.transform('text.test.check.correctness',"Проверьте варианты ответов. Они не должны быть пустыми"));
          return;
        }
      } else if (this.chosenQuestionType === 1) {
        Object.values(this.charsNeskolko).forEach((value) => {
          let question = new Answer();
          question["Content"] = value[0];
          question["IsCorrect"] = value[1] ? 1 : 0;
          this.question.Answers.push(question);
        });
        this.question.Answers[0].QuestionId = 0;


        this.charsde = Object.keys(this.charsNeskolko);
      } else if (this.chosenQuestionType === 2) {
        Object.values(this.charsWords).forEach((value) => {
          let question = new Answer();
          question["Content"] = value;
          question["IsCorrect"] = 0;
          this.question.Answers.push(question);
        });
        this.question.Answers[0].QuestionId = 0;
      }


      else if (this.chosenQuestionType === 3) {

        Object.values(this.charsSequence).forEach((value) => {
          let question = new Answer();
          question["Content"] = value;
          question["IsCorrect"] = 0;
          this.question.Answers.push(question);
        });
        this.question.Answers[0].QuestionId = 0;
      }


      this.question["TestId"] = this.data.test;
      /*this.question['QuestionType'] = 0;
      this.question['Id'] = 0;
      this.question['ConceptId'] = null;*/
      if (this.data.isEUMKTest) {
        this.question.ConceptId = this.conceptId;
      }
      this.testService.saveQuestion(this.question)
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe((res) => {
          if (res.ErrorMessage) {
            this.openSnackBar(res.ErrorMessage);
          } else {
            this.newCase ? this.openSnackBar(this.translatePipe.transform('text.test.question.created',"Вопрос создан")) : this.openSnackBar(this.translatePipe.transform('text.test.question.changed',"Вопрос изменен"));
            this.dialogRef.close(true);
          }

        }, error1 => {
          this.openSnackBar(this.translatePipe.transform('text.test.internal.server.error',"Ошибка ответа сервера"));
        });
    } else {
      FormUtils.highlightInvalidControls(this.formGroup);
    }
  }

  public openSnackBar(message: string, action?: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  selectConcept(Id: any) {
    this.conceptId = Id;
    this.question.ConceptId = Id;
    this.getConceptName();
  }

  public getChildById(concepts: any, id): any {
    for (const concept of concepts) {
      if (concept.Id === id) {
        return concept;
      }

      if (concept.Children && concept.Children.length > 0) {
        const resultOrderItem = this.getChildById(concept.Children, id);

        if (resultOrderItem) {
          return resultOrderItem;
        }
      }
    }
    return null;
  }

  private initForm() {
    this.chars = {};
    this.chars["key0"] = "";
    this.charsde = Object.keys(this.chars);
  }

  private initNeskolko() {
    this.charsNeskolko = {};
    this.charsNeskolko["key0"] = [];
    this.charsNeskolko["key0"][0] = "fghjk";
    this.charsNeskolko["key0"][1] = false;
    this.charsde = Object.keys(this.charsNeskolko);
  }

  private initWords() {
    this.charsWords = {};
    this.charsWords["key0"] = "";
    this.charsde = Object.keys(this.charsWords);
  }

  private initSequence() {
    this.charsSequence = {};
    this.charsSequence["key0"] = "";
    this.charsde = Object.keys(this.charsSequence);
  }

  private initExisting(answers: Answer[]) {
    if (this.chosenQuestionType === 0) {
      answers.forEach((answer, index) => {
          this.chars["key" + index] = answer.Content;
          if (answer.IsCorrect === 1) {
            this.chosenType = "key" + index;
          }
        }
      );
      this.charsde = Object.keys(this.chars);
    } else if (this.chosenQuestionType === 1) {
      answers.forEach((answer, index) => {
          this.charsNeskolko["key" + index] = [];
          this.charsNeskolko["key" + index][0] = answer.Content;
          this.charsNeskolko["key" + index][1] = answer.IsCorrect;
        }
      );
      this.charsde = Object.keys(this.charsNeskolko);
    } else if (this.chosenQuestionType === 2) {
      answers.forEach((answer, index) => {
          this.charsWords["key" + index] = answer.Content;
        }
      );
      this.charsde = Object.keys(this.charsWords);
    } else if (this.chosenQuestionType === 3) {
      answers.forEach((answer, index) => {
          this.charsSequence["key" + index] = answer.Content;
        }
      );
      this.charsde = Object.keys(this.charsSequence);
    }
  }

  private getConceptName() {
    let questionConcept = this.getChildById(this.navItems, this.question.ConceptId);
    this.selectedConcept = questionConcept.Name;
  }
}
