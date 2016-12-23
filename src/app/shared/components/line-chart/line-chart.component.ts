import {
  Component,
  AfterViewInit,
  Input,
  ViewChild,
  ViewEncapsulation,
  ElementRef
} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'cs-line-chart',
  templateUrl: 'line-chart.component.html',
  styleUrls: ['line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements AfterViewInit {

  @ViewChild('element') element: ElementRef;
  @Input() data = [];

  // Set the dimensions of the canvas / graph
  private margin = { top: 30, right: 20, bottom: 30, left: 50 };
  private width = 0;
  private height = 0;
  private parseDate = null;
  private x = null;
  private y = null;
  private xAxis = null;
  private yAxis = null;
  private line = null;
  private svg = null;
  private transition = null;

  ngAfterViewInit() {
    setTimeout(() => {
      this.setup();
      this.update();
    }, 0);
  }

  private setup() {

    this.height = 415;
    this.width = this.element.nativeElement.clientWidth;

    this.parseDate = d3.time.format('%Y-%m-%d').parse;

    this.x = d3.time.scale().range([0, this.width]);
    this.y = d3.scale.linear().range([this.height, 0]);

    this.xAxis = d3.svg.axis().scale(this.x).orient('bottom').ticks(5);
    this.yAxis = d3.svg.axis().scale(this.y).orient('left').ticks(5);

    this.line = d3.svg.line().interpolate('basis')
      .x((d: any) => this.x(d.date))
      .y((d: any) => this.y(d.value));

    this.svg = d3.select(this.element.nativeElement)
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform', 'translate(' + this.margin.left + ',' + this.margin.top + ')');

  }

  update() {
    this.data.forEach((d: any) => {
      d.date = this.parseDate(d.date);
      d.value = +d.value;
    });

    // Scale the range of the data
    this.x.domain(d3.extent(this.data, (d) => d.date ));
    this.y.domain([0, d3.max(this.data, (d) => d.value )]);

    // Nest the entries by symbol
    let dataNest = d3.nest()
      .key((d: any) => d.type)
      .entries(this.data);

    // Loop through each symbol / key
    dataNest.forEach((d) => {
      this.svg.append('path')
        .attr('class', 'line')
        .attr('d', this.line(d.values));
    });

    // Add the X Axis
    this.svg.append('g')
        .attr('class', 'x axis')
        .attr('transform', 'translate(0,' + this.height + ')')
        .call(this.xAxis);

    // Add the Y Axis
    this.svg.append('g')
        .attr('class', 'y axis')
        .call(this.yAxis);
  }

}
