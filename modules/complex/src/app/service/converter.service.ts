import { Injectable } from '@angular/core'
import { ComplexGrid } from '../models/ComplexGrid'
import { ComplexTree, TreeNode } from '../models/ComplexTree'
import { Group } from '../models/Group'
import { ConceptMonitoring } from '../models/ConceptMonitoring'
import { Adaptivity } from '../models/Adaptivity'
import { ComplexCascade } from '../models/ComplexCascade'
import { Student } from '../models/student.model'
import { ConceptMonitoringData } from '../models/ConceptMonitoringData'

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  constructor() {}
  private conceptConverter(concept: any) {
    const complexGrid = new ComplexGrid()
    complexGrid.id = concept.Id
    complexGrid.name = concept.ShortName
    complexGrid.fullname = concept.Name

    return complexGrid
  }

  public complexGridConverter(concepts: any[]) {
    return concepts.map((con) => this.conceptConverter(con))
  }

  public mapConverter(concept: any) {
    const tree = new ComplexTree([])
    tree.result.push(
      new TreeNode(concept.Id, concept.Name, null, concept.FilePath)
    )
    this.childMapConverter(concept.children, tree, concept.Id)

    return tree
  }

  private childMapConverter(
    childConcepts: any[],
    tree: ComplexTree,
    parentId: number
  ) {
    if (!childConcepts || childConcepts.length === 0) {
      return
    }
    for (const concept of childConcepts) {
      tree.result.push(
        new TreeNode(concept.Id, concept.Name, parentId, concept.FilePath)
      )
      this.childMapConverter(concept.children, tree, concept.Id)
    }
  }

  private monitoringConverter(monitoring: any, estimatedTime: number) {
    const monitor = new ConceptMonitoring()
    monitor.Name = monitoring.Name
    monitor.Seconds = this.getStrTime(monitoring.Seconds)
    monitor.Color = this.getColorByTime(monitoring.Seconds, estimatedTime)
    return monitor
  }

  public monitoringsConverter(
    monitorings: any,
    estimatedTime: number
  ): ConceptMonitoringData {
    const convertedMonitorings = monitorings.map((mon) =>
      this.monitoringConverter(mon, estimatedTime)
    )
    return {
      Estimated: this.getStrTime(estimatedTime),
      ConceptMonitorings: convertedMonitorings,
    }
  }

  public getColorByTime(realTime: number, estimatedTime: number): string {
    if (realTime >= estimatedTime / 2 && realTime <= estimatedTime * 1.5) {
      return `green`
    }
    return 'red'
  }

  public getStrTime(seconds: number): string {
    if (seconds < 60) {
      return `${seconds} сек`
    }
    const min = Math.floor(seconds / 60)
    const sec = seconds % 60

    return `${min} мин ${sec} сек`
  }

  public filterNonGroupItems(
    conceptsCascade: ComplexCascade
  ): ComplexCascade[] {
    conceptsCascade.children = conceptsCascade.children.filter((x) => x.IsGroup)
    for (const concept of conceptsCascade.children) {
      this.filterNonGroupItems(concept)
    }

    return [conceptsCascade]
  }

  private studentConverter(studentRes: any) {
    const student = new Student()
    student.Id = studentRes.StudentId
    student.Name = studentRes.FullName

    return student
  }

  public studentsConverter(students: any): Student[] {
    return students.map((gr) => this.studentConverter(gr))
  }

  private groupConverter(groupRes: any) {
    const group = new Group()
    group.Id = groupRes.GroupId
    group.Name = groupRes.GroupName

    return group
  }

  public groupsConverter(groups: any) {
    return groups.map((gr) => this.groupConverter(gr))
  }

  public nextThemaResConverter(themaRes: any) {
    const nextThemaRes = new Adaptivity()
    nextThemaRes.nextThemaId = themaRes.NextThemaId
    nextThemaRes.nextMaterialPaths = themaRes.NextMaterialPath
    nextThemaRes.needToDoPredTest = themaRes.NeedToDoPredTest
    nextThemaRes.shouldWaitPresettedTime = themaRes.ShouldWaitBeforeTest
    nextThemaRes.timeToWait = themaRes.TimeToWait
    nextThemaRes.isLearningEnded = themaRes.IsLearningEnded

    return nextThemaRes
  }
}
