import { Component, OnInit, OnDestroy, Inject, HostListener } from '@angular/core'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'
import { ComplexService } from '../../../service/complex.service'
import { CatsService, CodeType } from '../../../service/cats.service'
import { DialogData } from '../../../models/DialogData'
import { AngularD3TreeLibService } from 'angular-d3-tree'
import { forkJoin } from 'rxjs'
import * as d3 from 'd3'
import { StorageKeys } from '../../../../../../../container/src/app/core/models/storage-keys.enum'
import { MapPopoverLayout } from '../../../models/map-popover-layout.enum'
import { ApiResponseCode } from '../../../models/api-response-code.enum'

@Component({
  selector: 'map-popover',
  templateUrl: './map-popover.component.html',
  styleUrls: ['./map-popover.component.less'],
})
export class MapPopoverComponent implements OnInit, OnDestroy {
  chartData: any[]
  isLector: boolean

  private hiddenConceptIds: number[] = []
  private chartDataSnapshot: any[] = null
  private resizeTimer: any = null

  constructor(
    public dialogRef: MatDialogRef<MapPopoverComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private treeService: AngularD3TreeLibService,
    private complexService: ComplexService,
    private catsService: CatsService
  ) {
    const user = JSON.parse(localStorage.getItem(StorageKeys.CurrentUser))
    this.isLector = user && user.role === 'lector'
  }

  ngOnInit() {
    const complexId = parseInt(this.data.id, 10)
    const self = this

    forkJoin([
      this.complexService.getConceptTree(this.data.id),
      this.complexService.getHiddenTests(complexId),
    ]).subscribe((results: any[]) => {
      const tree = results[0]
      const hidden = results[1]
      self.hiddenConceptIds = hidden && hidden.ConceptIds ? hidden.ConceptIds : []

      self.chartData = tree.result.filter(
        (node: any) => self.hiddenConceptIds.indexOf(node.id) === -1
      )

      const treeModel = self.treeService.treeModel
      treeModel.nodeWidth = 1.8
      treeModel.nodeHeight = 1
      treeModel.nodeRadius = MapPopoverLayout.NodeRadius
      treeModel.horizontalSeparationBetweenNodes = -0.5
      treeModel.verticalSeparationBetweenNodes = 0
      treeModel.nodeTextDistanceX = MapPopoverLayout.TextOffset

      if (self.isLector) {
        treeModel.nodechanged = function (movedNode: any) { self.onNodeMoved(movedNode) }
      }

      const originalDragBehaviour = treeModel.dragBehaviour.bind(treeModel)
      treeModel.dragBehaviour = function () {
        const drag = originalDragBehaviour()
        const startHandler = drag.on('start')
        drag.on('start', function (d: any) {
          if (d && d.data && d.data.testId) {
            self.catsService.showMessage({ Message: 'Перемещение тестов недоступно', Type: CodeType.error })
            return
          }
          if (startHandler) { startHandler.call(this, d) }
        })
        return drag
      }

      const originalSetNodes = treeModel.setNodes.bind(treeModel)
      treeModel.setNodes = function (source: any, treeData: any) {
        originalSetNodes(source, treeData)

        let tooltip = d3.select('#map-node-tooltip')
        if (tooltip.empty()) {
          tooltip = d3.select('body').append('div')
            .attr('id', 'map-node-tooltip')
            .style('position', 'fixed')
            .style('background', 'rgba(97,97,97,0.9)')
            .style('color', '#fff')
            .style('padding', '6px 12px')
            .style('border-radius', '4px')
            .style('font-size', '13px')
            .style('font-family', 'Inter, system-ui, sans-serif')
            .style('font-weight', '400')
            .style('pointer-events', 'none')
            .style('white-space', 'nowrap')
            .style('z-index', '9999')
            .style('display', 'none')
            .style('box-shadow', '0 2px 8px rgba(0,0,0,0.3)')
        }

        treeModel.svg.selectAll('g.node text').each(function (d: any) {
          const el = d3.select(this)
          const g = d3.select((this as Element).parentNode as SVGGElement)
          g.select('rect.node-label-bg').remove()

          const fullName: string = (d && d.data)
            ? (d.data.description || d.data.name || String(d.id))
            : ''

          const labelX = MapPopoverLayout.NodeRadius + MapPopoverLayout.TextOffset
          el.attr('x', labelX)
          el.attr('y', 0)
          el.attr('dy', null)
          el.attr('text-anchor', 'start')
          el.attr('dominant-baseline', 'middle')
          el.style('font-family', 'Inter, system-ui, -apple-system, sans-serif')
          el.style('font-size', '13px')
          el.style('font-weight', '600')
          el.style('fill', '#1f1f1f')
          el.style('stroke', 'none')
          el.style('paint-order', 'normal')
          el.style('text-rendering', 'geometricPrecision')
          el.style('-webkit-font-smoothing', 'antialiased')

          if (fullName.length > MapPopoverLayout.MaxLabelChars) {
            el.text(fullName.substring(0, MapPopoverLayout.MaxLabelChars) + '\u2026')

            g.select('title').remove()

            g
              .on('mouseenter.tooltip', function () {
                tooltip
                  .style('display', 'block')
                  .text(fullName)
              })
              .on('mousemove.tooltip', function () {
                const e = d3.event as MouseEvent
                tooltip
                  .style('left', (e.clientX + 14) + 'px')
                  .style('top', (e.clientY - 28) + 'px')
              })
              .on('mouseleave.tooltip', function () {
                tooltip.style('display', 'none')
              })
          } else {
            el.text(fullName)
            g
              .on('mouseenter.tooltip', null)
              .on('mousemove.tooltip', null)
              .on('mouseleave.tooltip', null)
          }

          try {
            const textEl = el.node() as SVGTextElement
            const bbox = textEl.getBBox()
            g.insert('rect', 'text')
              .attr('class', 'node-label-bg')
              .attr('x', bbox.x - MapPopoverLayout.LabelBgPadX)
              .attr('y', bbox.y - MapPopoverLayout.LabelBgPadY)
              .attr('width', Math.max(0, bbox.width + 2 * MapPopoverLayout.LabelBgPadX))
              .attr('height', Math.max(0, bbox.height + 2 * MapPopoverLayout.LabelBgPadY))
              .attr('rx', 2)
              .attr('ry', 2)
              .attr('fill', '#ffffff')
              .style('pointer-events', 'none')
          } catch {}
        })

        self.applyLinkStyles()
      }

      const originalSetLinks = treeModel.setLinks.bind(treeModel)
      treeModel.setLinks = function (source: any, treeData: any) {
        originalSetLinks(source, treeData)
        self.applyLinkStyles()
      }

      treeModel.createLayout = function () {
        const depthSpacing = self.computeDepthSpacing()
        treeModel['_depthSpacing'] = depthSpacing
        treeModel.treeLayout = d3.tree()
          .size([treeModel.height, treeModel.width])
          .nodeSize([
            treeModel.nodeWidth + treeModel.horizontalSeparationBetweenNodes,
            treeModel.nodeHeight + treeModel.verticalSeparationBetweenNodes
          ])
          .separation(function (a: any, b: any) { return a.parent === b.parent ? 28 : 36 })
      }

      treeModel.update = function (source: any) {
        const treeData = treeModel.treeLayout(treeModel.root)
        const nodes = treeData.descendants()
        const depthSpacing: number[] = treeModel['_depthSpacing'] || []

        const cumulativeY: number[] = []
        let acc = 0
        const seenDepths: number[] = []
        nodes.forEach(function (d: any) {
          if (seenDepths.indexOf(d.depth) === -1) {
            seenDepths.push(d.depth)
            cumulativeY[d.depth] = acc
            acc += (depthSpacing[d.depth] || 180)
          }
        })

        nodes.forEach(function (d: any) {
          d.y = cumulativeY[d.depth] !== undefined ? cumulativeY[d.depth] : d.depth * 180
        })

        const desc = treeData.descendants()
        if (desc.length > 0) {
          let minX = Infinity
          let maxX = -Infinity
          desc.forEach(function (d: any) {
            if (typeof d.x === 'number') {
              if (d.x < minX) { minX = d.x }
              if (d.x > maxX) { maxX = d.x }
            }
          })
          if (minX !== Infinity && maxX !== -Infinity && treeModel.height > 0) {
            const mid = (minX + maxX) / 2
            const deltaX = treeModel.height / 2 - mid
            desc.forEach(function (d: any) {
              if (typeof d.x === 'number') { d.x += deltaX }
            })
          }
        }

        treeModel.setNodes(source, treeData)
        treeModel.setLinks(source, treeData)
      }

      self.customTreeService()
    })
  }

  private computeDepthSpacing(): number[] {
    const depthMap: { [id: number]: number } = {}
    const rootNode = this.chartData.find((n: any) => n.parent === null || n.parent === undefined)
    if (!rootNode) { return [] }

    depthMap[rootNode.id] = 0
    let changed = true
    while (changed) {
      changed = false
      this.chartData.forEach((n: any) => {
        if (depthMap[n.id] === undefined && n.parent !== null && n.parent !== undefined) {
          if (depthMap[n.parent] !== undefined) {
            depthMap[n.id] = depthMap[n.parent] + 1
            changed = true
          }
        }
      })
    }

    const depthMaxWidth: { [depth: number]: number } = {}
    this.chartData.forEach((n: any) => {
      const depth = depthMap[n.id]
      if (depth === undefined) { return }
      const name: string = n.description || n.name || ''
      const labelLen = Math.min(name.length, MapPopoverLayout.MaxLabelChars)
      const labelPx =
        labelLen * MapPopoverLayout.CharWidthPx +
        MapPopoverLayout.NodeRadius +
        MapPopoverLayout.TextOffset +
        MapPopoverLayout.ColumnGap
      if (!depthMaxWidth[depth] || labelPx > depthMaxWidth[depth]) {
        depthMaxWidth[depth] = labelPx
      }
    })

    const depths = Object.keys(depthMap).map((k) => depthMap[+k])
    const maxDepth = depths.length > 0 ? Math.max.apply(null, depths) : 0
    const result: number[] = []
    for (let i = 0; i <= maxDepth; i++) {
      result[i] = depthMaxWidth[i] || 180
    }
    return result
  }

  ngOnDestroy() {
    if (this.resizeTimer) { clearTimeout(this.resizeTimer) }
    d3.select('#map-node-tooltip').remove()
  }

  @HostListener('window:resize')
  onWindowResize() {
    if (this.resizeTimer) { clearTimeout(this.resizeTimer) }
    this.resizeTimer = setTimeout(() => {
      if (this.chartData && this.chartData.length) { this.customTreeService() }
    }, 200)
  }

  customTreeService() {
    // 1) оригинал createChart @url https://github.com/jgpATs2w/angular-d3-tree/blob/374aa9948f39138f7341d72777e8954d5b5e9194/projects/angular-d3-tree-lib/src/lib/angular-d3-tree-lib.service.ts#L12
    // 2) оригинал createTreeData (внутри createChart) @url https://github.com/jgpATs2w/angular-d3-tree/blob/374aa9948f39138f7341d72777e8954d5b5e9194/projects/angular-d3-tree-lib/src/lib/tree.dendo.model.ts#L70
    const tm: any = this.treeService.treeModel
    tm.margin = { top: 40, bottom: 40, left: 72, right: 40 }

    this.treeService.treeModel.createTreeData = () => {
      this.treeService.treeModel.root = d3
        .stratify<any>()
        .id(function (d) { return d.id })
        .parentId(function (d) { return d.parent })(this.chartData)
      this.treeService.treeModel.root.x0 = this.treeService.treeModel.height / 2
      this.treeService.treeModel.root.y0 = 0
      if (tm.root && tm.root.children && tm.root.children.length) {
        tm.root.children.forEach((child: any) => tm.collapse(child))
      }
    }

    const host = document.getElementById('chartContainer')
    const run = () => {
      if (!host) {
        setTimeout(() => this.customTreeService(), 50)
        return
      }
      this.treeService.createChart({ nativeElement: host } as any, this.chartData)
      const svc: any = this.treeService
      if (typeof svc.update === 'function') {
        svc.update()
      }
      requestAnimationFrame(() => {
        this.applyLinkStyles()
        this.markTestNodes()
      })
    }
    requestAnimationFrame(run)
  }

  private applyLinkStyles() {
    const svg = this.treeService.treeModel && this.treeService.treeModel.svg
    if (!svg) { return }

    svg.selectAll('path')
      .filter(function () {
        const className = ((this as SVGPathElement).getAttribute('class') || '').toLowerCase()
        return className.indexOf('link') !== -1
      })
      .style('stroke', '#2b2b2b')
      .style('stroke-width', '1px')
      .style('fill', 'none')
      .style('shape-rendering', 'geometricPrecision')
      .style('vector-effect', 'non-scaling-stroke')
      .style('stroke-linecap', 'round')
  }

  private markTestNodes() {
    d3.selectAll('g.node').each(function (d: any) {
      const nodeData = d && d.data ? d.data : null
      if (nodeData && nodeData.testId) {
        d3.select(this).style('cursor', 'not-allowed')
        d3.select(this).select('.ghostCircle').attr('pointer-events', 'none')
      }
    })
  }

  private onNodeMoved(movedNode: any) {
    if (!movedNode || !movedNode.data) { return }

    if (movedNode.data.testId) {
      this.catsService.showMessage({ Message: 'Перемещение тестов недоступно', Type: CodeType.error })
      this.customTreeService()
      return
    }

    const conceptId: number = parseInt(movedNode.data.id, 10)
    const newParentId: number = movedNode.parent ? parseInt(movedNode.parent.data.id, 10) : null

    if (!conceptId || !newParentId) { return }

    const siblings: any[] = movedNode.parent.children || []
    const idx = siblings.findIndex((s: any) => s.data.id === movedNode.data.id)
    const prevConceptId = idx > 0 ? parseInt(siblings[idx - 1].data.id, 10) : 0
    const nextConceptId = idx < siblings.length - 1 ? parseInt(siblings[idx + 1].data.id, 10) : 0

    this.chartDataSnapshot = this.chartData.map((n: any) => Object.assign({}, n))
    const node = this.chartData.find((n: any) => n.id === conceptId)
    if (node) { node.parent = newParentId }

    this.complexService.moveConceptNode(conceptId, newParentId, prevConceptId, nextConceptId)
      .subscribe({
        next: (res: any) => {
          if (res && res['Code'] === ApiResponseCode.Success) {
            this.chartDataSnapshot = null
          } else {
            this.rollbackChartData()
            this.catsService.showMessage({ Message: 'Ошибка при перемещении узла', Type: CodeType.error })
          }
        },
        error: () => {
          this.rollbackChartData()
          this.catsService.showMessage({ Message: 'Ошибка при перемещении узла', Type: CodeType.error })
        }
      })
  }

  private rollbackChartData() {
    if (this.chartDataSnapshot) {
      this.chartData = this.chartDataSnapshot
      this.chartDataSnapshot = null
      this.customTreeService()
    }
  }

  onNoClick(): void { this.dialogRef.close() }

  selectedNode: any
  nodeUpdated(node: any) { console.info('app detected node change') }
  nodeSelected(node: any) {
    console.info('app detected node selected', node)
    this.selectedNode = node
  }
}
