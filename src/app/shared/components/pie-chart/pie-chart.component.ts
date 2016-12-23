import {
  Component,
  AfterViewInit,
  OnChanges,
  ViewChild,
  Input,
  ElementRef
} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'cs-pie-chart',
  templateUrl: 'pie-chart.component.html',
  styleUrls: ['pie-chart.component.scss']
})
export class PieChartComponent implements OnChanges, AfterViewInit {

  @ViewChild('element') element: ElementRef;
  @Input() data = [];

  private svg: d3.Selection<any> = null;
  private pie: d3.layout.Pie<any> = null;
  private arc: d3.svg.Arc<any> = null;
  private arcs: any = null;
  private angles = {};

  private width = 200;
  private height = 200;
  private radius = Math.min(this.width, this.height) / 2;

  public categories = [];

  constructor() {}

  init() {
    this.pie = d3.layout.pie();
    this.arc = d3.svg.arc();
  }

  ngOnChanges() {
    this.categories = this.data;
    this.render();
  }

  ngAfterViewInit() {
    this.categories = this.data;
    this.render();
  }

  private render() {
    this.init();

    this.arc
        .outerRadius(this.radius - 10)
        .innerRadius(this.radius - 70);

    this.pie
        .sort(null)
        .value(d => d.amount);

    this.svg = d3.select(this.element.nativeElement)
      .attr('style', 'margin: 0 auto;')
      .attr('width', this.width)
      .attr('height', this.height)
      .append('g')
      .attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

    this.arcs = this.svg.selectAll('.arc')
      .data(this.pie(this.categories))
      .enter().append('g')
      .attr('class', 'arc');

    this.arcs.append('path')
      .style('fill', d => d.data.color)
      .style('stroke', d => this.colorLuminance(d.data.color, -0.2))
      .style('stroke-width', '2px')
      .attr('d', this.arc)
      .each(d => this.angles[d.data.type] = d);

    this.arcs.append('text')
      .attr('transform', d => 'translate(' + this.arc.centroid(d) + ')')
      .attr('dy', '.35em')
      .text(d => d.amount);
  }

  colorLuminance(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    lum = lum || 0;

    // convert to decimal and change luminosity
    let rgb = '#', c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i * 2, 2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ('00' + c).substr(c.length);
    }

    return rgb;
  }

}
