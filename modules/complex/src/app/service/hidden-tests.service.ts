import { Injectable } from '@angular/core'
import { Observable, BehaviorSubject } from 'rxjs'
import { ComplexService } from './complex.service'
import { CatsService, CodeType } from './cats.service'
import { ComplexCascade } from '../models/ComplexCascade'
import { ComplexMonitoring } from '../models/ComplexMonitoring'
import { ApiResponseCode } from '../models/api-response-code.enum'

export interface HiddenTestsData {
  ConceptIds: number[]
  TestIds: number[]
}

@Injectable({
  providedIn: 'root',
})
export class HiddenTestsService {
  private hiddenConceptIds: Map<string, Set<string>> = new Map()
  private hiddenTestIds: Map<string, Set<number>> = new Map()
  private loadingStates: Map<string, BehaviorSubject<boolean>> = new Map()

  constructor(
    private complexService: ComplexService,
    private catsService: CatsService
  ) {}

  loadHiddenTests(complexId: string): Observable<HiddenTestsData> {
    const complexIdNum = parseInt(complexId, 10)
    
    return new Observable((observer) => {
      this.complexService.getHiddenTests(complexIdNum).subscribe(
        (hiddenTests) => {
          if (hiddenTests && hiddenTests.ConceptIds && hiddenTests.TestIds) {
            this.hiddenConceptIds.set(
              complexId,
              new Set(hiddenTests.ConceptIds.map((id) => String(id)))
            )
            this.hiddenTestIds.set(
              complexId,
              new Set(hiddenTests.TestIds)
            )
          } else {
            this.hiddenConceptIds.set(complexId, new Set())
            this.hiddenTestIds.set(complexId, new Set())
          }
          observer.next(hiddenTests)
          observer.complete()
        },
        (error) => {
          console.error('Ошибка при загрузке скрытых тестов:', error)
          this.hiddenConceptIds.set(complexId, new Set())
          this.hiddenTestIds.set(complexId, new Set())
          observer.error(error)
        }
      )
    })
  }

  saveHiddenTest(
    complexId: string,
    conceptId: string,
    testId?: number
  ): Observable<any> {
    const conceptIdNum = parseInt(conceptId, 10)
    const complexIdNum = parseInt(complexId, 10)

    return new Observable((observer) => {
      this.complexService.hideTest(conceptIdNum, testId || null, complexIdNum).subscribe(
        (result) => {
          if (result && result.Code === ApiResponseCode.Success) {
            if (!this.hiddenConceptIds.has(complexId)) {
              this.hiddenConceptIds.set(complexId, new Set())
            }
            if (!this.hiddenTestIds.has(complexId)) {
              this.hiddenTestIds.set(complexId, new Set())
            }

            this.hiddenConceptIds.get(complexId)!.add(conceptId)
            if (testId) {
              this.hiddenTestIds.get(complexId)!.add(testId)
            }

            observer.next(result)
            observer.complete()
          } else {
            console.error('Ошибка при сохранении скрытого теста:', result)
            this.catsService.showMessage({
              Message: 'Ошибка при сохранении скрытого теста',
              Type: CodeType.error,
            })
            observer.error(result)
          }
        }
      )
    })
  }

  isConceptHidden(complexId: string, conceptId: string): boolean {
    const hiddenIds = this.hiddenConceptIds.get(complexId)
    return hiddenIds ? hiddenIds.has(conceptId) : false
  }

  isTestHidden(complexId: string, testId: number): boolean {
    const hiddenTestIds = this.hiddenTestIds.get(complexId)
    return hiddenTestIds ? hiddenTestIds.has(testId) : false
  }

  isTestHiddenByConceptOrTestId(
    complexId: string,
    conceptId: string,
    testId?: number
  ): boolean {
    const isConceptHidden = this.isConceptHidden(complexId, conceptId)
    const isTestHidden = testId && this.isTestHidden(complexId, testId)
    return isConceptHidden || isTestHidden
  }

  getHiddenConceptIds(complexId: string): Set<string> {
    return this.hiddenConceptIds.get(complexId) || new Set()
  }

  getHiddenTestIds(complexId: string): Set<number> {
    return this.hiddenTestIds.get(complexId) || new Set()
  }

  clearCache(complexId: string): void {
    this.hiddenConceptIds.delete(complexId)
    this.hiddenTestIds.delete(complexId)
  }

  filterHiddenTestsForCascade(
    complexId: string,
    nodes: ComplexCascade[]
  ): ComplexCascade[] {
    const filterNodes = (nodeList: ComplexCascade[]): ComplexCascade[] => {
      return nodeList
        .filter((node) => {
          if (node.TestId) {
            if (this.isTestHidden(complexId, node.TestId) || this.isConceptHidden(complexId, String(node.Id))) {
              return false
            }
          }
          return true
        })
        .map((node) => {
          const newNode = { ...node }
          if (node.children && node.children.length > 0) {
            newNode.children = filterNodes(node.children)
          }
          return newNode
        })
    }

    return filterNodes(nodes)
  }

  filterHiddenTestsForMonitoring(
    complexId: string,
    nodes: ComplexMonitoring[]
  ): ComplexMonitoring[] {
    const filterNodes = (nodeList: ComplexMonitoring[]): ComplexMonitoring[] => {
      return nodeList
        .filter((node) => {
          if (node.TestId && this.isTestHidden(complexId, node.TestId)) {
            return false
          }
          return true
        })
        .map((node) => {
          const newNode = { ...node }
          if (node.Children && node.Children.length > 0) {
            newNode.Children = filterNodes(node.Children)
          }
          return newNode
        })
    }

    return filterNodes(nodes)
  }

  removeCascadeNode(
    nodes: ComplexCascade[],
    conceptId: string | number
  ): ComplexCascade[] {
    const conceptIdStr = String(conceptId)

    const removeNodeById = (nodeList: ComplexCascade[]): ComplexCascade[] => {
      if (!nodeList || nodeList.length === 0) {
        return []
      }

      const result: ComplexCascade[] = []
      for (const node of nodeList) {
        const nodeIdStr = String(node.Id)
        if (nodeIdStr === conceptIdStr) {
          continue
        }
        const newNode: ComplexCascade = {
          ...node,
        }

        if (node.children && node.children.length > 0) {
          newNode.children = removeNodeById(node.children)
        } else {
          newNode.children = []
        }

        result.push(newNode)
      }
      return result
    }

    return removeNodeById(nodes)
  }

  collectExpandedNodeIds(
    nodes: ComplexCascade[],
    isExpanded: (node: ComplexCascade) => boolean
  ): Set<string> {
    const expandedIds = new Set<string>()

    const collectIds = (nodeList: ComplexCascade[]) => {
      nodeList.forEach((node) => {
        try {
          if (isExpanded(node)) {
            expandedIds.add(String(node.Id))
            if (node.children && node.children.length > 0) {
              collectIds(node.children)
            }
          }
        } catch (e) {
        }
      })
    }

    collectIds(nodes)
    return expandedIds
  }

  restoreExpandedState(
    nodes: ComplexCascade[],
    expandedIds: Set<string>,
    expandNode: (node: ComplexCascade) => void
  ): void {
    if (!nodes || nodes.length === 0) {
      return
    }

    nodes.forEach((node) => {
      const nodeIdStr = String(node.Id)
      if (expandedIds.has(nodeIdStr) && node.children && node.children.length > 0) {
        try {
          expandNode(node)
          this.restoreExpandedState(node.children, expandedIds, expandNode)
        } catch (e) {
        }
      }
    })
  }
}

