import { TranslatePipe } from 'educats-translate'
import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Group } from '../../models/group.model'
import { Help } from '../../models/help.model'

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.less'],
})
export class MainPageComponent {
  @Input()
  public controlCompleting: boolean = false

  @Input()
  public allowChanges: boolean

  @Input()
  public forNN: boolean

  @Input()
  public adminTests: boolean

  @Input()
  public adminQuestions: boolean

  @Input()
  public hideSearch: boolean

  @Input()
  public groupDropdown: boolean

  @Input()
  public text: string

  @Input()
  public inputValue: string

  @Input()
  public groups: Group[]

  @Output()
  public onValueChangeSearch: EventEmitter<string> = new EventEmitter()

  @Output()
  public onOpenAddingPopupEvent: EventEmitter<void> = new EventEmitter()

  @Output()
  public groupValueChange: EventEmitter<any> = new EventEmitter()

  @Output()
  public addNewQuestion: EventEmitter<any> = new EventEmitter()

  @Output()
  public addQuestionFromOtherTestEvent: EventEmitter<any> = new EventEmitter()

  @Output()
  public createNeuralNetworkEvent: EventEmitter<any> = new EventEmitter()

  adminTestsHelp: Help = {
    message: '',
    action: '',
  }

  adminQuestionsHelp: Help = {
    message: '',
    action: '',
  }

  controlCompletingHelp: Help = {
    message: '',
    action: '',
  }

  constructor(private translatePipe: TranslatePipe) {
    this.adminTestsHelp = {
      message: this.translatePipe.transform(
        'text.help.themes',
        // tslint:disable-next-line:max-line-length
        'Чтобы подготовить тест, его необходимо создать, наполнить вопросами и ответами. Также необходимо указать время на прохождение теста и количество вопросов в нем. Для предварительного просмотра теста и открытия доступа к нему нажмите на соответствующие иконки.'
      ),
      action: this.translatePipe.transform('button.understand', 'Понятно'),
    }

    this.adminQuestionsHelp = {
      message: this.translatePipe.transform(
        'text.help.questions',
        // tslint:disable-next-line:max-line-length
        'На данной странице можно добавить новый вопрос в тест. Для этого заполните все поля вопроса и выберите тип ответа. Также можно добавить вопрос из существующего теста.'
      ),
      action: this.translatePipe.transform('button.understand', 'Понятно'),
    }

    this.controlCompletingHelp = {
      message: this.translatePipe.transform(
        'text.help.viewRealTime',
        // tslint:disable-next-line:max-line-length
        'На данной странице можно наблюдать за процессом прохождения тестов для контроля знаний. Если на вопрос был дан верный ответ, он отображен зеленым цветом. Если был дан неверный ответ, он отображен красным цветом.'
      ),
      action: this.translatePipe.transform('button.understand', 'Понятно'),
    }
  }

  public onValueChange(event): void {
    this.onValueChangeSearch.emit(event.currentTarget.value)
  }

  public onGroupValueChange(event): void {
    this.groupValueChange.emit(event.source.value)
  }

  public onOpenAddingPopup(): void {
    this.onOpenAddingPopupEvent.emit()
  }

  public onAddNewQuestion(): void {
    this.addNewQuestion.emit()
  }

  public addQuestionFromOtherTest(): void {
    this.addQuestionFromOtherTestEvent.emit()
  }

  public createNeuralNetwork(): void {
    this.createNeuralNetworkEvent.emit()
  }
}
