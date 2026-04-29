import { Component, Input, OnInit } from '@angular/core'
import { VisitStats } from '../../../models/visit-stats.model'
import { Consultation } from '../../../models/consultation.model'
import { VisitStatsComponent } from '../visit-stats.component'
import { TranslatePipe } from 'educats-translate'
import { Sort } from '@angular/material/sort'

@Component({
  selector: 'app-visit-stats-list',
  templateUrl: './visit-stats-list.component.html',
  styleUrls: ['./visit-stats-list.component.less'],
})
export class VisitStatsListComponent implements OnInit {
  @Input() filteredVisitStatsList: VisitStats[]
  @Input() consultations: Consultation[]

  displayedDates: Set<string> = new Set<string>()

  constructor(
    private visitStatsComponent: VisitStatsComponent,
    public translatePipe: TranslatePipe
  ) {}

  ngOnInit() {
    this.displayedDates.clear()
  }

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '') return

    this.filteredVisitStatsList.sort((a, b) => {
      let valueA = a[sort.active as keyof VisitStats]
      let valueB = b[sort.active as keyof VisitStats]

      if (typeof valueA === 'string') valueA = valueA.toLowerCase()
      if (typeof valueB === 'string') valueB = valueB.toLowerCase()

      return (valueA < valueB ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1)
    })
  }

  shouldDisplayDate(day: string): boolean {
    if (!this.displayedDates.has(day)) {
      this.displayedDates.add(day)
      return true
    }
    return false
  }

  getStudentConsultations(stats: VisitStats): Consultation[] {
    if (!this.consultations) return []
    return this.consultations.filter(
      (c) => c.LecturerFullName === stats.Lecturer
    )
  }

  getMissedHours(stats: VisitStats): number {
  if (!stats.DiplomProjectConsultationMarks) return 0
  return stats.DiplomProjectConsultationMarks.reduce((sum, mark) => {
    const val = parseFloat(mark.Mark)
    return sum + (isNaN(val) ? 0 : val)
  }, 0)
}

getTotalHours(stats: VisitStats): number {
  return this.getStudentConsultations(stats).length * 2
}

getMissedTooltip(stats: VisitStats): string {
  const missed = this.getMissedHours(stats)
  const total = this.getTotalHours(stats)
  return this.translatePipe.transform(
    'text.diplomProject.missedHoursTooltip',
    `Пропустил(а) ${missed} часа(ов) из ${total}`,
    {
      missed: String(missed),
      total: String(total),
    }
  )
}
}