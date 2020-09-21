import { Component, OnInit, ElementRef, ViewEncapsulation, Input, SimpleChanges, OnChanges } from '@angular/core';
import * as d3 from 'd3';

export class DonutChartDatum {
  code: string;
  displayValue: string;
  count: number;
}

interface ComplexNode {
  name: string;
  id: number;
  children?: ComplexNode[];
}



@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.less']
})
export class MapComponent implements OnInit, OnChanges {
  //@Input() data: number[];
  hostElement; // Native element hosting the SVG container
  svg; // Top level SVG element
  g; // SVG Group element
  svgGroup;
  totalNodes; 
  maxLabelLength;
  selectedNode;
  draggingNode;
  panSpeed;
  panBoundary;
  root;
  duration;
  shift;
  viewBoxHeight;
  viewBoxWidth;
  i;  
  tree;
  treeRoot;
  diagonal;
  zoomListener;
  
  
  constructor(private elRef: ElementRef) {
    this.hostElement = this.elRef.nativeElement;
  }

  ngOnInit() {
    this.root = d3;
    this.treeRoot = d3.hierarchy(this.root);
    this.tree = d3.tree(this.treeRoot);
    this.totalNodes = 0; 
    this.maxLabelLength = 0; 
    this.selectedNode = null;
    this.draggingNode = null;
    this.panSpeed = 200; 
    this.panBoundary = 20;
    this.duration = 750;
    this.shift = 0.2;
    this.viewBoxHeight = 500;
    this.viewBoxWidth = 500;
    this.i = 0;
    this.diagonal = d3.linkHorizontal()
      .x(function (d) {
        return d.x;
      })
      .y(function (d) {
        return d.y;
      });

    //this.zoomListener = d3.zoom().scaleExtent([0.1, 3]).on("zoom", this.zoom);
    this.updateChart(this.root);
    //this.centerNode(this.root);    
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data) {
      this.updateChart(changes.data.currentValue);

      //this.visit(this.data, function (d) {
      //  this.totalNodes++;
      //  this.maxLabelLength = Math.max(d.Name.length, this.maxLabelLength);

      //}, function (d) {
      //  return d.children && d.children.length > 0 ? d.children : null;
      //})
    }
  }

 
  private createChart(source: any) {

    this.removeExistingChartFromParent();

    this.setChartDimensions();

    this.addGraphicsElement();
  }

  public updateChart(source: any) {
    if (!this.svg) {
      this.createChart(source);      
    }

    var levelWidth = [1];
    var childCount = function (level, n) {

      if (n.children && n.children.length > 0) {
        if (levelWidth.length <= level + 1) levelWidth.push(0);

        levelWidth[level + 1] += n.children.length;
        n.children.forEach(function (d) {
          childCount(level + 1, d);
        });
      }
    };
    childCount(0, this.root);
    var newHeight = d3.max(levelWidth) * 25; // 25 pixels per line  
    this.tree = this.tree.size([newHeight, this.viewBoxWidth]);

    // Compute the new tree layout.
    var nodes = this.treeRoot.descendants(),
      links = this.treeRoot.links();

    // Set widths between levels based on maxLabelLength.
    nodes.forEach(function (d) {
      d.y = (d.depth * (4 * 10)); //maxLabelLength * 10px
      // alternatively to keep a fixed scale one can set a fixed depth per level
      // Normalize for fixed-depth by commenting out below line
      // d.y = (d.depth * 500); //500px per level.
    });

    // Update the nodes…
    var node = this.svgGroup.selectAll("g.node")
      .data(nodes, function (d) {
        return d.id || (d.id = ++this.i);
      });

    // Enter any new nodes at the parent's previous position.
    var nodeEnter = node.enter().append("g")
      //.call(dragListener)
      .attr("class", "node")
      .attr("transform", function (d) {
        return "translate(" + 0 + "," + 0 + ")";
      })
      //.on('click', click)
      //.on('dblclick', dblclick);

    nodeEnter.append("circle")
      .attr('class', 'nodeCircle')
      .attr("r", 0)
      .style("fill", function (d) {
        if (d.Id == 0)
          return "red";
        return d._children ? "lightsteelblue" : "#fff";
      });

    nodeEnter.append("text")
      .attr("x", function (d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("dy", ".35em")
      .attr('class', 'nodeText')
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.Name;
      })
      .style("fill-opacity", 0);

    // phantom node to give us mouseover in a radius around it
    nodeEnter.append("circle")
      .attr('class', 'ghostCircle')
      .attr("r", 30)
      .attr("opacity", 0.2) // change this to zero to hide the target area
      .style("fill", "red")
      .attr('pointer-events', 'mouseover')
      .on("mouseover", () => this.overCircle(node))
      .on("mouseout", () => this.outCircle(node));

    // Update the text to reflect whether node has children or not.
    node.select('text')
      .attr("x", function (d) {
        return d.children || d._children ? -10 : 10;
      })
      .attr("text-anchor", function (d) {
        return d.children || d._children ? "end" : "start";
      })
      .text(function (d) {
        return d.Name;
      });

    // Change the circle fill depending on whether it has children and is collapsed
    node.select("circle.nodeCircle")
      .attr("r", 4.5)
      .style("fill", function (d) {
        if (d.Id == 0)
          return "red";
        return d._children ? "lightsteelblue" : "#fff";
      });

    // Transition nodes to their new position.
    var nodeUpdate = node.transition()
      .duration(this.duration)
      .attr("transform", function (d) {
        return "translate(" + 0 + "," + 0 + ")";
      });

    // Fade the text in
    nodeUpdate.select("text")
      .style("fill-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    var nodeExit = node.exit().transition()
      .duration(this.duration)
      .attr("transform", function (d) {
        return "translate(" + 0 + "," + 0 + ")";
      })
      .remove();

    nodeExit.select("circle")
      .attr("r", 0);

    nodeExit.select("text")
      .style("fill-opacity", 0);

    // Update the links…
    var link = this.svgGroup.selectAll("path.link")
      .data(links, function (d) {
        return d.target.id;
      });

    var x0y0O = {
      x: source.x0,
      y: source.y0
    };
    var x0y0Diagonal = this.diagonal({
      source: x0y0O,
      target: x0y0O
    });

    // Enter any new links at the parent's previous position.
    link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", x0y0Diagonal);      
      

    // Transition links to their new position.
    link.transition()
      .duration(this.duration)
      .attr("d", this.diagonal);

    var xyO = {
      x: source.x,
      y: source.y
    };
    var xyDiagonal = this.diagonal({
      source: xyO,
      target: xyO
    });
    // Transition exiting nodes to the parent's new position.
    link.exit().transition()
      .duration(this.duration)
      .attr("d", xyDiagonal)
      .remove();

    // Stash the old positions for transition.
    nodes.forEach(function (d) {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  private setChartDimensions() {
    this.svg = d3.select(this.hostElement).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('viewBox', '0 0 ' + this.viewBoxWidth + ' ' + this.viewBoxHeight)
      .attr("class", "overlay")
      //.call(this.zoomListener);
    this.svgGroup = this.svg.append("g")
  }

  private addGraphicsElement() {
    this.g = this.svg.append("g")
      .attr("transform", "translate(100,90)");
  }
  
  private removeExistingChartFromParent() {
    // !!!!Caution!!!
    // Make sure not to do;
    //     d3.select('svg').remove();
    // That will clear all other SVG elements in the DOM
    d3.select(this.hostElement).select('svg').remove();
  }

  private visit(parent, visitFn, childrenFn) {
    if (!parent) return;

    visitFn(parent);

    var children = childrenFn(parent);
    if (children) {
      var count = children.length;
      for (var i = 0; i < count; i++) {
        this.visit(children[i], visitFn, childrenFn);
      }
    }
  }

  private sortTree() {
    this.tree.sort(function (a, b) {
      return b.Id < a.Id ? 1 : -1;
    });
  }
  private centerNode(source) {
    let scale = 3;//d3.zoomTransform(canvas.node()).k;
    let x = -source.y0;
    let y = -source.x0;
    x = x * scale + this.viewBoxWidth / 2;
    y = y * scale + this.viewBoxHeight / 2;
    d3.select('g').transition()
      .duration(this.duration)
      .attr("transform", "translate(" + x + "," + y + ")scale(" + scale + ")");
    //this.zoomListener.scale(scale);
    //this.zoomListener.translate([x, y]);
  }
  private toggleChildren(d) {
    if (d.children) {
      d._children = d.children;
      d.children = null;
    } else if (d._children) {
      d.children = d._children;
      d._children = null;
    }
    return d;
  }
  private collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(this.collapse);
      d.children = null;
    }
  }
  private expand(d) {
    if (d._children) {
      d.children = d._children;
      d.children.forEach(this.expand);
      d._children = null;
    }
  }
  private overCircle (d) {
    this.selectedNode = d;
    this.updateTempConnector();
  };
  private outCircle (d) {
    this.selectedNode = null;
    this.updateTempConnector();
  };
  private updateTempConnector () {
    var data = [];
    if (this.draggingNode !== null && this.selectedNode !== null) {
      // have to flip the source coordinates since we did this for the existing connectors on the original tree
      data = [{
        source: {
          x: this.selectedNode.y0,
          y: this.selectedNode.x0
        },
        target: {
          x: this.draggingNode.y0,
          y: this.draggingNode.x0
        }
      }];
    }
    var link = this.svgGroup.selectAll(".templink").data(data);

    link.enter().append("path")
      .attr("class", "templink")
      .attr("d", d3.linkHorizontal())
      .attr('pointer-events', 'none');

    link.attr("d", d3.linkHorizontal());

    link.exit().remove();
  };
  private zoom() {
    this.svgGroup.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
  }

  

  
}
