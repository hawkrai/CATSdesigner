import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core'
import { FormControl, FormGroup } from '@angular/forms'
import { AutocompleteModel } from '../../models/autocomplete.model'

@Component({
  selector: 'app-autocomplete-form',
  templateUrl: './autocomplete-form.component.html',
  styleUrls: ['./autocomplete-form.component.less'],
})
export class AutocompleteFormComponent implements OnInit, OnDestroy {
  @Input()
  public options: AutocompleteModel[]
  @Input()
  public placeholder: string
  @Input()
  public preselected: boolean
  @Input()
  public preselectedAll: boolean
  @Input()
  public enableOptionTooltips = false
  profileForm = new FormGroup({
    selected: new FormControl(),
  })
  @Output()
  public onSelectionChange: EventEmitter<string[]> = new EventEmitter()

  private panelObserver: MutationObserver | undefined
  private readonly onHostClick = (): void => this.scheduleOptionTooltipPatch()

  constructor(private host: ElementRef<HTMLElement>) {}

  public ngOnInit(): void {
    if (this.preselected) {
      this.profileForm.controls.selected.setValue([
        this.options && this.options[0] && this.options[0].value,
      ])
      this.onSelectionChange.emit(this.profileForm.controls.selected.value)
    }
    if (this.preselectedAll) {
      const value = this.options.map((x) => x?.value) || []
      this.profileForm.controls.selected.setValue(value)
      this.onSelectionChange.emit(this.profileForm.controls.selected.value)
    }

    if (this.enableOptionTooltips) {
      this.host.nativeElement.addEventListener('click', this.onHostClick)
      this.host.nativeElement.addEventListener('keydown', this.onHostClick)
    }
  }

  public ngOnDestroy(): void {
    this.panelObserver?.disconnect()
    if (this.enableOptionTooltips) {
      this.host.nativeElement.removeEventListener('click', this.onHostClick)
      this.host.nativeElement.removeEventListener('keydown', this.onHostClick)
    }
  }

  private scheduleOptionTooltipPatch(): void {
    setTimeout(() => this.patchOptionTooltips(), 0)
    setTimeout(() => this.patchOptionTooltips(), 100)
  }

  private patchOptionTooltips(): void {
    const panel = this.findOptionPanel()
    if (!panel) {
      return
    }

    panel.querySelectorAll('mat-option').forEach((option) => {
      const text = option.textContent?.trim()
      if (text) {
        option.setAttribute('title', text)
      }
    })

    if (!this.panelObserver) {
      this.panelObserver = new MutationObserver(() => this.patchOptionTooltips())
      this.panelObserver.observe(panel, {
        childList: true,
        subtree: true,
        characterData: true,
      })
    }
  }

  private findOptionPanel(): HTMLElement | null {
    const panels = Array.from(
      document.querySelectorAll('.mat-select-panel')
    ) as HTMLElement[]
    const optionDisplays = new Set(
      (this.options || []).map((option) => option.display)
    )

    for (let i = panels.length - 1; i >= 0; i--) {
      const panel = panels[i]
      const optionElements = Array.from(panel.querySelectorAll('mat-option'))
      if (!optionElements.length) {
        continue
      }

      const matchesCurrentOptions = optionElements.some((option) =>
        optionDisplays.has(option.textContent?.trim() || '')
      )
      if (matchesCurrentOptions) {
        return panel
      }
    }

    return null
  }

  public onSubmit() {
    console.log(this.profileForm.value)
  }

  public selectionChange(event: string[]): void {
    if (event && event.length) {
      console.log(event)
      this.onSelectionChange.emit(event)
    } else {
      if (this.preselected) {
        this.onSelectionChange.emit([
          this.options && this.options[0] && this.options[0].value,
        ])
        console.log([this.options && this.options[0] && this.options[0].value])
      } else {
        this.onSelectionChange.emit(event)
      }
    }
  }
}
