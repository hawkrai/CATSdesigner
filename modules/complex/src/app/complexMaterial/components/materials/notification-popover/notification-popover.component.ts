import { Component, Inject } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { DialogData } from '../../../../models/DialogData'
import { AdaptivityService } from '../../../../service/adaptivity.service'
import { TestExecutionComponent } from '../adaptiveLearningTests/adaptive-learning-test.component'
import { TestService } from '../../../../service/test.service'
import { Adaptivity } from '../../../../models/Adaptivity'

@Component({
  selector: 'app-notification-popover',
  templateUrl: './notification-popover.component.html',
  styleUrls: ['./notification-popover.component.less']
})

  export class NotificationPopoverComponent {
  public files = []
  page: number = 1
  path: string
  currentPathIndex: number
  materialPathes: string[]

  themaId: string
  adaptivityType: number

  isAdaptive: boolean
  needToGetInitialTest: boolean
  shouldWaitPresettedTime: boolean
  showMaterial: boolean
  isEndLearning: boolean

  showTimer: boolean
  seconds: number
  studentSeconds: number = 0
  time: string

  isTest: boolean
  testId: string
  isPredTest: boolean

  nextButtonVisible: boolean
  prevButtonVisible: boolean
  toTestButtonVisible: boolean
  toTestButtonEnabled: boolean

  constructor(
    public dialogRef: MatDialogRef<NotificationPopoverComponent>,
    private adaptivityService: AdaptivityService,
    private testService: TestService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.path = data.url
    this.isAdaptive = data.isAdaptive
    this.materialPathes
    this.countWatchTime()

    if (this.isAdaptive) {
      this.adaptivityType = data.adaptivityType
      this.initFieldsByAdaptivity(data.adaptivity)
    } else if (data.documents) {
      this.currentPathIndex = 0
      this.materialPathes = data.documents
      this.showMaterial = true
      this.checkMaterialsContainerForButtonsVisibility()
    } else {
      this.showMaterial = true
      this.toTestButtonVisible = false
    }
  }

  initFieldsByAdaptivity(adaptivity: Adaptivity) {
    this.themaId = adaptivity.nextThemaId
    this.currentPathIndex = 0
    this.materialPathes = adaptivity.nextMaterialPaths
    this.needToGetInitialTest = adaptivity.needToDoPredTest
    this.shouldWaitPresettedTime = adaptivity.shouldWaitPresettedTime
    this.isEndLearning = adaptivity.isLearningEnded

    this.showMaterial = !(
      this.needToGetInitialTest ||
      this.isTest ||
      this.isEndLearning
    )

    this.toTestButtonVisible = this.showMaterial

    if (this.materialPathes) {
      this.checkMaterialsContainerForButtonsVisibility()
    }

    if (this.shouldWaitPresettedTime) {
      this.showTimer = true
      this.toTestButtonEnabled = false
      this.seconds = adaptivity.timeToWait
      this.countDown()
    } else {
      this.showTimer = false
      this.toTestButtonEnabled = true
    }
  }

  processsTest() {
    if (this.isPredTest) {
      this.processAndSavePredTest()
    } else {
      this.processTestAndGetNext()
    }
  }

  processTestAndGetNext() {
    this.adaptivityService
      .getNextThemaRes(this.testId, this.themaId, this.adaptivityType)
      .subscribe((res) => {
        this.path = '/api/Upload?fileName=' + res.nextMaterialPaths[0]
        this.isTest = false
        this.studentSeconds = 0
        this.initFieldsByAdaptivity(res)
      })
  }

  processAndSavePredTest(): void {
    this.adaptivityService
      .processPredTtest(this.testId, this.adaptivityType)
      .subscribe((res) => {
        this.path = '/api/Upload?fileName=' + res.nextMaterialPaths[0]
        this.isTest = false
        this.studentSeconds = 0
        this.initFieldsByAdaptivity(res)
      })
  }

  goToTests() {
    this.adaptivityService
      .getTestId(this.themaId, this.studentSeconds, this.adaptivityType)
      .subscribe((res) => {
        this.testId = `${res}`
        this.isTest = true
        this.isPredTest = false

        this.showMaterial = false
        this.toTestButtonVisible = false
        this.prevButtonVisible = false
        this.nextButtonVisible = false
        this.needToGetInitialTest = false
        this.shouldWaitPresettedTime = false
      })
  }

  goToPredTest() {
    this.testService.getPredTest().subscribe((res) => {
      this.testId = `${res}`
      this.isTest = true
      this.isPredTest = true

      this.showMaterial = false
      this.toTestButtonVisible = false
      this.prevButtonVisible = false
      this.nextButtonVisible = false
      this.needToGetInitialTest = false
      this.shouldWaitPresettedTime = false
    })
  }

  goToPrevMaterial() {
    --this.currentPathIndex
    const path =
      '/api/Upload?fileName=' + this.materialPathes[this.currentPathIndex]
    this.path = path
    this.checkMaterialsContainerForButtonsVisibility()

  }

  goToNextMaterial() {
    ++this.currentPathIndex
    this.path =
      '/api/Upload?fileName=' + this.materialPathes[this.currentPathIndex]
    this.checkMaterialsContainerForButtonsVisibility()
  }

  checkMaterialsContainerForButtonsVisibility() {
    this.prevButtonVisible = this.currentPathIndex != 0
    this.nextButtonVisible =
      this.currentPathIndex < this.materialPathes.length - 1
    this.toTestButtonVisible = this.isAdaptive && !this.nextButtonVisible
  }

  countDown() {
    window.setInterval(() => {
      this.seconds -= 1
      this.time = this.getStrTime()
      if (this.seconds == 0) {
        this.toTestButtonEnabled = true
        this.showTimer = false
        return
      }
    }, 1000)
  }

  countWatchTime() {
    setInterval(() => {
      this.studentSeconds += 1
    }, 1000)
  }

  getStrTime(): string {
    const min: number = this.seconds > 60 ? Math.floor(this.seconds / 60) : 0
    const sec: number = this.seconds > 60 ? this.seconds % 60 : this.seconds
    const minStr: string = min < 10 ? '0' + min : String(min)
    const secStr: string = sec < 10 ? '0' + sec : String(sec)
    return `${minStr}:${secStr}`
  }

  onNoClick(): void {
    this.dialogRef.close(this.studentSeconds)
  }
}
