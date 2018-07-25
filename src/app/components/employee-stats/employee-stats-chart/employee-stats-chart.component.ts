import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as d3 from 'd3';
import { Employee, DayPunch } from '../../../models/employee';

@Component({
  selector: 'app-emp-stats-chart',
  templateUrl: './employee-stats-chart.component.html',
  styleUrls: [
    './employee-stats-chart.component.scss'
  ]
})
export class EmployeeStatsChartComponent implements OnInit, AfterViewInit {

  @Input() employee: Employee;
  margin;
  width;
  height;
  data = [];
  xAxisExtentData = [];
  hoursData = [];
  hoursKey = ['Total Office Hrs.', 'Total Productive Hrs.'];
  punchKeys = ['In Time', 'Out Time'];

  constructor() {
    this.margin = { top: 20, right: 50, bottom: 100, left: 60 };
    this.width = 1100 - this.margin.left - this.margin.right;
    this.height = 570 - this.margin.top - this.margin.bottom;
  }

  ngOnInit() {
    const self = this;
    const hoursData = this.hoursData;
    const xAxisExtentData = this.xAxisExtentData;
    this.employee.dayLevelStats.forEach((day: DayPunch) => {
      day.date = d3.time.format('%Y-%m-%d').parse(day.date);
      day.punchIn = d3.time.format('%Y-%m-%dT%H:%M:%S').parse(day.punchIn);
      day.punchOut = d3.time.format('%Y-%m-%dT%H:%M:%S').parse(day.punchOut);
      xAxisExtentData.push(day.punchIn);
      xAxisExtentData.push(day.punchOut);
      hoursData.push(day.totalHours);
      hoursData.push(day.totalProductiveHours);
    });
    this.xAxisExtentData = self.xAxisExtentData;
    this.data = self.employee.dayLevelStats;
  }

  ngAfterViewInit() {
    const self = this;
    const height = self.height;
    const width = self.width;
    const margin = self.margin;

    const x = d3.time.scale().range([0, this.width]);
    const x0 = d3.scale.ordinal().rangeRoundBands([0, width], .1);

    const y1 = d3.time.scale().range([this.height, 0]);
    const y2 = d3.scale.linear().range([this.height, 0]);

    const z = d3.scale.ordinal().range(['#2d45fc', '#43ad48']);
    const w = d3.scale.ordinal().range(['#e56429', '#e59628']);

    const xAxis = d3.svg.axis().scale(x).orient('bottom')
      .ticks(23)
      .tickFormat(d3.time.format('%b-%d'));

    const y1Axis = d3.svg.axis().scale(y1).orient('left')
      .ticks(d3.time.hour, 1)
      .tickFormat(d3.time.format('%H %M'));

    const y2Axis = d3.svg.axis().scale(y2).orient('right');

    const valueline1 = d3.svg.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y1(d.punchIn); });

    const valueline2 = d3.svg.line()
      .x(function (d) { return x(d.date); })
      .y(function (d) { return y1(d.punchOut); });

    const svg = d3.select('#chart')
      .append('svg')
        .attr('width', this.width + this.margin.left + this.margin.right)
        .attr('height', this.height + this.margin.top + this.margin.bottom)
      .append('g')
        .attr('transform',
          'translate(' + this.margin.left + ',' + this.margin.top + ')');

    x.domain(d3.extent(this.data, function(d) { return d.date; }));
    x0.domain(this.hoursKey.map(function (d) { return d; }));

    y1.domain(d3.extent(this.xAxisExtentData, function(d) { return d; }));
    y2.domain([0, d3.max(this.hoursData, function(d) { return d; })]);

    svg.selectAll('.productive')
      .data(this.data)
      .enter().append('rect')
        .style('fill', '#2d45fc')
        .attr('x', function(d) { return x(d.date); })
        .attr('width', 10)
        .attr('y', function(d) { return y2(d.totalProductiveHours); })
        .attr('height', function(d) { return height - y2(d.totalProductiveHours); });

    svg.selectAll('.total')
      .data(this.data)
      .enter().append('rect')
        .style('fill', '#43ad48')
        .attr('x', function(d) { return x(d.date); })
        .attr('width', 5)
        .attr('y', function(d) { return y2(d.totalHours); })
        .attr('height', function(d) { return height - y2(d.totalHours); });

    svg.append('path')
      .style('stroke', '#e56429')
      .attr('d', valueline1(this.data));

    svg.append('path')
      .style('stroke', '#e59628')
      .attr('d', valueline2(this.data));

    svg.append('g')
      .attr('class', 'x axis')
      .attr('transform', 'translate(0,' + height + ')')
      .call(xAxis).selectAll('text').attr('y', 0)
      .attr('x', '-48')
      .attr('dy', '.25em')
      .attr('transform', 'rotate(-50)')
      .style('text-anchor', 'start');

    svg.append('text')
      .attr('transform',
        'translate(' + (width / 2) + ' ,' + (height + margin.top + 25) + ')')
      .style('text-anchor', 'middle')
      .style('font-weight', 600)
      .text('Days');

    svg.append('g')
      .attr('class', 'y axis')
      .call(y1Axis);

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-weight', 600)
      .text('Time (HH:MM)');

    const group = svg.selectAll('.group')
      .data(this.hoursKey)
      .enter().append('g')
        .attr('class', 'group')
        .attr('transform', function (d) { return 'translate(' + x0(d) + ',0)'; });

    svg.append('g')
      .attr('class', 'y axis')
      .attr('transform', 'translate(' + (width + 11) + ' ,0)')
      .call(y2Axis)
      .attr('dy', '-.1em');

    svg.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y',  (width + 35))
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('font-weight', 600)
      .text('No. of Hours');

    const barLegend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
        .selectAll('g')
        .data(this.hoursKey.slice().reverse())
        .enter().append('g')
          .attr('transform', function(d, i) { return 'translate(0,' + (height + 30 + (i + 3) * 15) + ')'; });

    barLegend.append('rect')
      .attr('x', width - 85)
      .attr('width', 19)
      .attr('height', 5)
      .attr('fill', z);

    barLegend.append('text')
      .attr('x', width - 90)
      .attr('y', 3.5)
      .attr('dy', '0.32em')
      .text(function(d) { return d; });

    const lineLegend = svg.append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'end')
        .selectAll('g')
        .data(this.punchKeys.slice().reverse())
        .enter().append('g')
          .attr('transform', function(d, i) { return 'translate(0,' + (height + 30 + (i + 3) * 15) + ')'; });

    lineLegend.append('rect')
      .attr('x', width - 19)
      .attr('width', 19)
      .attr('height', 5)
      .attr('fill', w);

    lineLegend.append('text')
      .attr('x', width - 19)
      .attr('y', 3.5)
      .attr('dy', '0.32em')
      .text(function(d) { return d; });
  }

}
