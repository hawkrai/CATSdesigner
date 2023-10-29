import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core'
import { AutoUnsubscribeBase } from '../../../core/auto-unsubscribe-base'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material'
import { Question } from '../../../models/question/question.model'
import * as neuralNetworkV2 from '../../../core/neuron/neuron1.js'
import { TestPassingService } from '../../../service/test-passing.service'
import { catchError, takeUntil, tap } from 'rxjs/operators'
import { Subject, throwError } from 'rxjs'
import { TranslatePipe } from 'educats-translate'
import { CatsService } from 'src/app/service/cats.service'

@Component({
  selector: 'app-neural-network-popup',
  templateUrl: './neural-network-popup.component.html',
  styleUrls: ['./neural-network-popup.component.less'],
})
export class NeuralNetworkPopupComponent
  extends AutoUnsubscribeBase
  implements OnInit
{
  public showTable: boolean = false
  public generateDisabled: boolean
  public trainHidden: boolean = true
  public trainDisabled: boolean = true
  public saveHidden: boolean = true
  public saveDisabled: boolean
  public questions: Question[]
  public showSecondStep: boolean
  public showThirdStep: boolean
  private savedDataAnswersValue: any
  private savedTopicsValue: any
  private unsubscribeStream$: Subject<void> = new Subject<void>()

  constructor(
    public dialogRef: MatDialogRef<NeuralNetworkPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private translatePipe: TranslatePipe,
    private testPassingService: TestPassingService,
    private catsService: CatsService,
    private cd: ChangeDetectorRef
  ) {
    super()
  }

  ngOnInit(): void {
    this.questions = this.data.questions

    if (!this.generateDisabled) {
      this.generate()
    }
  }

  public disableButtons(state: boolean): void {
    this.generateDisabled = state
    this.trainDisabled = state
    this.saveDisabled = state
    this.cd.detectChanges()
  }

  public generate(): void {
    this.disableButtons(true)
    const argumentsD = []

    const queestions = []

    this.questions = this.questions.sort((current, next) => {
      return Number(current.ConceptId) > Number(next.ConceptId) ? -1 : 1
    })
    const topics = []
    const topicsNum = []
    let currentTopic = this.questions[0].ConceptId
    let currentNumb = 0

    this.questions.forEach((question: Question) => {
      argumentsD.push([0, 1])
      queestions.push(question.Title)
      if (currentTopic === question.ConceptId) {
        currentNumb += 1
      } else {
        topicsNum.push(currentNumb)
        currentTopic = question.ConceptId
        currentNumb += 1
      }
      if (!topics.includes(question.ConceptId)) {
        topics.push(question.ConceptId)
      }
    })
    topicsNum.push(currentNumb)
    let cartesian = this.cartesian(argumentsD)
    cartesian.unshift(queestions)
    let dataForTopic = this.cartesian(argumentsD)
    this.savedDataAnswersValue = JSON.parse(JSON.stringify(dataForTopic))
    let topicsValue = []
    dataForTopic.forEach((value) => {
      let tValue = []
      let currentBorder = 0
      topicsNum.forEach((valueN) => {
        let sumValue = 0
        for (currentBorder; currentBorder < valueN; currentBorder++) {
          sumValue +=
            value[currentBorder] *
            (this.questions[currentBorder].ComlexityLevel / 10)
        }
        tValue.push(sumValue < 0.7 ? 1 : 0)
      })
      topicsValue.push(tValue)
    })
    this.savedTopicsValue = JSON.parse(JSON.stringify(topicsValue))
    topicsValue.unshift(topics)
    this.showTable = true
    this.disableButtons(false)
    this.trainHidden = false
    this.showSecondStep = true
  }

  public cartesian(value): any {
    const r = [],
      arg = value,
      max = arg.length - 1

    function helper(arr, i) {
      for (let j = 0, l = arg[i].length; j < l; j++) {
        let a = arr.slice(0) // clone arr
        a.push(arg[i][j])
        if (i == max) {
          r.push(a)
        } else {
          helper(a, i + 1)
        }
      }
    }

    helper([], 0)
    return r
  }

  public train(): void {
    this.disableButtons(true)
    this.cd.detectChanges()
    setTimeout(() => {
      const data = []

      this.savedDataAnswersValue.forEach((value, index) => {
        const temp = { input: value, output: this.savedTopicsValue[index] }
        data.push(temp)
      })
      neuralNetworkV2.neuralNetworkV2.train(data, { log: true })
      this.saveHidden = false
      this.showThirdStep = true
      this.catsService.showMessage({
        Message: this.translatePipe.transform(
          'text.test.network.teach',
          'Сеть обучена'
        ),
        Code: '200',
      })
      this.disableButtons(false)
      // tslint:disable-next-line:no-magic-numbers
    }, 500)
  }

  public save(): void {
    this.disableButtons(true)
    const data = JSON.stringify(neuralNetworkV2.neuralNetworkV2.toJSON())
    this.testPassingService
      .saveNeuralNetwork(data, this.data.testId)
      .pipe(
        tap((message) => {
          if (message && message.ErrorMessage) {
            this.catsService.showMessage({
              Message: message.ErrorMessage,
              Code: '500',
            })
          } else {
            this.catsService.showMessage({
              Message: this.translatePipe.transform(
                'text.test.network.saved',
                'Сеть сохранена'
              ),
              Code: '200',
            })
          }
          this.disableButtons(false)
        }),
        takeUntil(this.unsubscribeStream$),
        catchError(() => {
          this.disableButtons(false)
          this.catsService.showMessage({
            Message: this.translatePipe.transform(
              'text.test.network.error',
              'Произошла ошибка'
            ),
            Code: '500',
          })
          return throwError(null)
        })
      )
      .subscribe()
    this.onNoClick()
  }

  onNoClick(): void {
    this.dialogRef.close()
  }
}
