import {
  Component,
  AfterViewInit,
  ViewChild,
  Input,
  ElementRef,
  ViewEncapsulation
} from '@angular/core';

import * as d3 from 'd3';

@Component({
  selector: 'cs-sparkline',
  templateUrl: 'sparkline.component.html',
  styleUrls: ['sparkline.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SparklineComponent implements AfterViewInit {

  @ViewChild('element') element: ElementRef;
  @Input() data = [];

  public height = 0;
  public width = 0;

  private base: d3.Selection<any> = null;
  private ballRadius = 2;
  private duration = 3000;
  private x = null;
  private y = null;
  private line = null;
  private circle = null;
  private path = null;
  private y_start = 0;
  private currentX = 0;
  private transition = null;

  ngAfterViewInit() {
    setTimeout(() => this.render(), 0);
  }

  private render() {
    this.height = this.element.nativeElement.clientHeight;
    this.width = this.element.nativeElement.clientWidth;

    this.x = d3.scale.linear().domain([0, 1]).range([0, this.width / (this.data.length - 1)]);
    this.y = d3.scale.linear().domain([0, 10]).range([this.ballRadius, this.height - this.ballRadius]);
    this.line = d3.svg.line().interpolate('cardinal').x((d, i) => this.x(i)).y((d: any) => this.height - this.y(d));

    this.base = d3.select(this.element.nativeElement)
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%');

    this.base.append('clipPath')
      .attr('id', 'clippy')
      .append('rect');

    this.path = this.base.append('g')
      .attr('clip-path', 'url(#clippy)')
      .selectAll('path')
      .data([this.data])
      .enter().append('path')
      .attr('class', 'path')
      .attr('d', this.line);

    this.y_start = this.y(this.data[0]);

    this.circle = this.base.append('circle')
      .attr('class', 'circle')
      .attr('cy', this.y_start)
      .attr('r', this.ballRadius);

    this.base.selectAll('rect').attr('height', this.height);

    this.transition = this.base.transition()
      .duration(this.duration)
      .ease('linear');

    this.transition.selectAll('rect')
      .attrTween('width', () => (t) => this.currentX);

    this.transition.selectAll('circle')
      .attrTween('transform', () => {
        return (t) => {
          return this.followPath(this.path.node(), t);
        };
      })
      .each('end', function () { this.style.display = 'none'; });
  }

  private followPath(pathElement, t) {
    let l = pathElement.getTotalLength();
    let p = pathElement.getPointAtLength(t * l);
    this.currentX = p.x;
    return `translate( ${ p.x }, ${ p.y - this.y_start })`;
  }

}
