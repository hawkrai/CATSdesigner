import { Injectable } from '@angular/core'
import { ComplexCascade } from '../models/ComplexCascade'
import { DropPlacement } from '../models/drop-placement.enum'

export interface DropPosition {
  targetNode: ComplexCascade
  placement: DropPlacement
}

@Injectable({
  providedIn: 'root',
})
export class TreeDragDropService {
  dragNode: ComplexCascade | null = null
  dropPosition: DropPosition | null = null

  onDragStart(node: ComplexCascade): void {
    this.dragNode = node
    this.dropPosition = null
  }

  onDragEnd(): void {
    this.dragNode = null
    this.dropPosition = null
  }

  onDragOver(event: DragEvent, targetElement: HTMLElement, targetNode: ComplexCascade, treeData: ComplexCascade[] = []): void {
    if (!this.dragNode) return
    if (!this.isDropAllowed(this.dragNode, targetNode, treeData)) return
    event.preventDefault()
    this.dropPosition = this.computeDropPosition(event, targetElement, targetNode)
  }

  onDrop(event: DragEvent, targetElement: HTMLElement, targetNode: ComplexCascade, treeData: ComplexCascade[]): DropPosition | null {
    event.preventDefault()
    if (!this.dragNode) return null
    if (!this.isDropAllowed(this.dragNode, targetNode, treeData)) {
      this.onDragEnd()
      return null
    }
    const position = this.computeDropPosition(event, targetElement, targetNode)
    if (this.isSamePosition(this.dragNode, position, treeData)) {
      this.onDragEnd()
      return null
    }
    this.dropPosition = position
    return position
  }

  computeDropPosition(event: DragEvent, targetElement: HTMLElement, targetNode: ComplexCascade): DropPosition {
    const rect = targetElement.getBoundingClientRect()
    const relativeY = event.clientY - rect.top
    const ratio = relativeY / rect.height
    const isFolder = targetNode.IsGroup || (targetNode.children && targetNode.children.length > 0)

    let placement: DropPlacement
    if (isFolder) {
      if (ratio < 0.25) {
        placement = DropPlacement.Before
      } else if (ratio > 0.75) {
        placement = DropPlacement.After
      } else {
        placement = DropPlacement.Inside
      }
    } else {
      placement = ratio < 0.5 ? DropPlacement.Before : DropPlacement.After
    }

    return { targetNode, placement }
  }

  isDescendant(ancestor: ComplexCascade, candidate: ComplexCascade): boolean {
    if (ancestor.Id === candidate.Id) return true
    if (!ancestor.children || ancestor.children.length === 0) return false
    return ancestor.children.some(child => this.isDescendant(child, candidate))
  }

  isSamePosition(dragNode: ComplexCascade, position: DropPosition, treeData: ComplexCascade[]): boolean {
    const { targetNode, placement } = position

    if (placement === DropPlacement.Inside) {
      const children = targetNode.children || []
      return children.length > 0 && children[children.length - 1].Id === dragNode.Id
    }

    const parent = this.findParent(targetNode, treeData)
    const siblings = parent ? (parent.children || []) : treeData
    const targetIndex = siblings.findIndex(n => n.Id === targetNode.Id)
    if (targetIndex === -1) return false
    const dragIndex = siblings.findIndex(n => n.Id === dragNode.Id)
    if (dragIndex === -1) return false

    if (placement === DropPlacement.Before) return dragIndex === targetIndex - 1
    return dragIndex === targetIndex + 1
  }

  isDropAllowed(dragNode: ComplexCascade, targetNode: ComplexCascade, treeData: ComplexCascade[]): boolean {
    if (dragNode.Id === targetNode.Id) return false
    if (this.isDescendant(dragNode, targetNode)) return false
    if (this.isMandatorySection(targetNode)) return false
    return true
  }

  findParent(node: ComplexCascade, treeData: ComplexCascade[]): ComplexCascade | null {
    for (const root of treeData) {
      const found = this.findParentInSubtree(node, root)
      if (found) return found
    }
    return null
  }

  private findParentInSubtree(target: ComplexCascade, current: ComplexCascade): ComplexCascade | null {
    if (!current.children) return null
    for (const child of current.children) {
      if (child.Id === target.Id) return current
      const found = this.findParentInSubtree(target, child)
      if (found) return found
    }
    return null
  }

  private isMandatorySection(node: ComplexCascade): boolean {
    return !!(node as any).ReadOnly || !!node.isSectionNode
  }
}
