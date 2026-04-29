import {
  Component, Input, Output, EventEmitter,
  OnInit, ViewChild, ElementRef, HostListener, AfterViewChecked
} from '@angular/core'
import { FormControl } from '@angular/forms'

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.less'],
})
export class TimePickerComponent implements OnInit, AfterViewChecked {
  @Input() label: string = ''
  @Input() control: FormControl
  @Input() ngModelValue: string
  @Output() ngModelValueChange = new EventEmitter<string>()

  @ViewChild('hoursColumn', { static: false }) hoursColumn: ElementRef
  @ViewChild('minutesColumn', { static: false }) minutesColumn: ElementRef

  isOpen = false
  shouldScroll = false
  isFirefox = false

  hours = Array.from({ length: 24 }, (_, i) => i)
  minutes = Array.from({ length: 60 }, (_, i) => i)

  selectedHour = 0
  selectedMinute = 0

  get value(): string {
    const h = String(this.selectedHour).padStart(2, '0')
    const m = String(this.selectedMinute).padStart(2, '0')
    return `${h}:${m}`
  }

  ngOnInit() {
    this.isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

    const controlValue = this.control ? this.control.value : ''
    const initial = this.ngModelValue || controlValue || ''
    if (initial) {
      const parts = initial.split(':')
      this.selectedHour = +parts[0] || 0
      this.selectedMinute = +parts[1] || 0
    }
  }

  ngAfterViewChecked() {
    if (this.shouldScroll && this.isOpen) {
      this.scrollToSelected()
      this.shouldScroll = false
    }
  }

  toggle() {
    this.isOpen = !this.isOpen
    if (this.isOpen) {
      this.shouldScroll = true
    }
  }

  selectHour(h: number) {
    this.selectedHour = h
    this.emit()
  }

  selectMinute(m: number) {
    this.selectedMinute = m
    this.emit()
  }

  emit() {
    const val = this.value
    if (this.control) {
      this.control.setValue(val)
    }
    this.ngModelValueChange.emit(val)
  }

  onNativeTimeChange(event: any) {
    const val = event.target.value
    if (val) {
      const parts = val.split(':')
      this.selectedHour = +parts[0] || 0
      this.selectedMinute = +parts[1] || 0
      this.emit()
    }
  }

  onManualInput(event: any) {
    const val = event.target.value
    const cleaned = val.replace(/[^0-9:]/g, '')
    event.target.value = cleaned
  }

  onManualBlur(event: any) {
    const val = event.target.value
    if (val && val.indexOf(':') > -1) {
      const parts = val.split(':')
      const h = Math.min(23, Math.max(0, +parts[0] || 0))
      const m = Math.min(59, Math.max(0, +parts[1] || 0))
      this.selectedHour = h
      this.selectedMinute = m
      this.emit()
    }
  }

  scrollToSelected() {
    if (this.hoursColumn) {
      const el = this.hoursColumn.nativeElement
      const items = el.querySelectorAll('.timepicker-item')
      if (items[this.selectedHour]) {
        items[this.selectedHour].scrollIntoView({ block: 'center' })
      }
    }
    if (this.minutesColumn) {
      const el = this.minutesColumn.nativeElement
      const items = el.querySelectorAll('.timepicker-item')
      if (items[this.selectedMinute]) {
        items[this.selectedMinute].scrollIntoView({ block: 'center' })
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const target = event.target as HTMLElement
    if (!target.closest('app-time-picker')) {
      this.isOpen = false
    }
  }
}