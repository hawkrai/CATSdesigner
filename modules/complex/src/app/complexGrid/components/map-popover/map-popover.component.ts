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

      treeModel.setNodes = function (source: any, treeData: any) {
        const nodes = treeData.descendants()
        const tm: any = treeModel

        const node = tm.svg.selectAll('g.node')
          .data(nodes, function (d: any) { return d.id })

        const nodeEnter = node.enter().append('g')
          .attr('class', 'node')
          .attr('transform', function () {
            return 'translate(' + source.y0 + ',' + source.x0 + ')'
          })

        nodeEnter.append('circle')
          .attr('class', 'node')
          .attr('r', 1e-6)
          .style('fill', function (d: any) { return d._children ? 'lightsteelblue' : '#fff' })

        nodeEnter.append('text')
          .attr('dy', tm.nodeTextDistanceY)
          .attr('x', 0)
          .attr('text-anchor', 'start')
          .text(function (d: any) { return d.data.name || d.data.description || d.id })

        nodeEnter.append('circle')
          .attr('class', 'ghostCircle')
          .attr('r', tm.nodeRadius * 2)
          .attr('opacity', 0.2)
          .style('fill', 'red')
          .attr('pointer-events', 'mouseover')
          .on('mouseover', function (n: any) {
            tm.overCircle(n)
            ;(this as Element).classList.add('over')
          })
          .on('mouseout', function (n: any) {
            tm.outCircle(n)
            ;(this as Element).classList.remove('over')
          })

        const nodeUpdate = nodeEnter.merge(node as any)
        nodeUpdate.transition()
          .duration(tm.duration)
          .attr('transform', function (d: any) { return 'translate(' + d.y + ',' + d.x + ')' })

        nodeUpdate.select('circle.node')
          .attr('r', tm.nodeRadius)
          .style('fill', function (d: any) { return d._children ? 'lightsteelblue' : '#fff' })
          .attr('cursor', 'pointer')

        const nodeExit = node.exit().transition()
          .duration(tm.duration)
          .attr('transform', function () { return 'translate(' + source.y + ',' + source.x + ')' })
          .remove()
        nodeExit.select('circle').attr('r', 1e-6)
        nodeExit.select('text').style('fill-opacity', 1e-6)

        nodes.forEach(function (d: any) { d.x0 = d.x; d.y0 = d.y })

        nodeEnter
          .call(tm.dragBehaviour())
          .on('click', function (d: any) {
            tm.click(d, this)
            tm.update(d)
          })

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

          const angle = (d && typeof d._angle === 'number') ? d._angle : 0
          const outwardRight = Math.cos(angle) >= 0
          const labelOffset = MapPopoverLayout.NodeRadius + MapPopoverLayout.TextOffset
          const labelX = outwardRight ? labelOffset : -labelOffset
          el.attr('x', labelX)
          el.attr('y', 0)
          el.attr('dy', null)
          el.attr('text-anchor', outwardRight ? 'start' : 'end')
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

      treeModel.createLayout = function () { /* radial layout — no d3.tree() used */ }

      treeModel.diagonalCurvedPath = function (s: any, d: any) {
        return 'M ' + s.y + ' ' + s.x + ' L ' + d.y + ' ' + d.x
      }

      treeModel.update = function (source: any) {
        self.applyRadialLayout()

        const all: any[] = []
        const walk = function (n: any) {
          all.push(n)
          const kids = n.children || []
          for (let i = 0; i < kids.length; i++) { walk(kids[i]) }
        }
        walk(treeModel.root)

        const treeData = {
          descendants: function () { return all.slice() }
        }

        treeModel.setNodes(source, treeData)
        treeModel.setLinks(source, treeData)
      }

      self.customTreeService()
    })
  }

  private applyRadialLayout() {
    const treeModel: any = this.treeService.treeModel
    const root = treeModel.root
    if (!root) { return }

    const countLeaves = (n: any): number => {
      const kids = n.children || []
      if (!kids.length) { n._leaves = 1; return 1 }
      let s = 0
      for (let i = 0; i < kids.length; i++) { s += countLeaves(kids[i]) }
      n._leaves = s
      return s
    }
    countLeaves(root)

    const maxDepthOf = (n: any): number => {
      const kids = n.children || []
      if (!kids.length) { return 0 }
      let m = 0
      for (let i = 0; i < kids.length; i++) { m = Math.max(m, maxDepthOf(kids[i])) }
      return 1 + m
    }
    const depth = maxDepthOf(root)

    const w = treeModel.width || 0
    const h = treeModel.height || 0
    const cx = w / 2
    const cy = h / 2

    const labelReserve = MapPopoverLayout.MaxLabelChars * MapPopoverLayout.CharWidthPx + 40
    const usable = Math.max(120, Math.min(w, h) / 2 - labelReserve)
    const levelRadius = depth > 0 ? usable / depth : 180
    const lr = Math.max(110, Math.min(220, levelRadius))

    const place = (n: any, startAngle: number, endAngle: number, d: number) => {
      const midAngle = (startAngle + endAngle) / 2
      if (d === 0) {
        n.y = cx
        n.x = cy
        n._angle = 0
      } else {
        const r = d * lr
        n.y = cx + r * Math.cos(midAngle)
        n.x = cy + r * Math.sin(midAngle)
        n._angle = midAngle
      }

      const kids = n.children || []
      if (!kids.length) { return }

      let total = 0
      for (let i = 0; i < kids.length; i++) { total += (kids[i]._leaves || 1) }

      let s = startAngle
      let e = endAngle
      if (d > 0) {
        const maxArc = Math.PI * 0.85
        const range = Math.min(e - s, maxArc)
        s = midAngle - range / 2
        e = midAngle + range / 2
      }

      let cur = s
      for (let i = 0; i < kids.length; i++) {
        const child = kids[i]
        const share = (child._leaves || 1) / total
        const span = (e - s) * share
        place(child, cur, cur + span, d + 1)
        cur += span
      }
    }

    const rootKids = root.children || []
    let startAngle = 0
    let endAngle = 2 * Math.PI
    if (rootKids.length > 0) {
      const total = root._leaves || 1
      const firstSpan = ((rootKids[0]._leaves || 1) / total) * 2 * Math.PI
      startAngle = -Math.PI / 2 - firstSpan / 2
      endAngle = startAngle + 2 * Math.PI
    }
    place(root, startAngle, endAngle, 0)
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
    tm.margin = { top: 40, bottom: 40, left: 40, right: 40 }

    this.treeService.treeModel.createTreeData = () => {
      this.treeService.treeModel.root = d3
        .stratify<any>()
        .id(function (d) { return d.id })
        .parentId(function (d) { return d.parent })(this.chartData)
      this.treeService.treeModel.root.x0 = (this.treeService.treeModel.height || 0) / 2
      this.treeService.treeModel.root.y0 = (this.treeService.treeModel.width || 0) / 2
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
      .style('stroke', '#c8c8c8')
      .style('stroke-width', '0.8px')
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
