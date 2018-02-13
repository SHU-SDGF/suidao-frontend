import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import * as echarts from 'echarts';

@Component({
  selector: 'analysis-page',
  templateUrl: './analysis.component.html',
})
export class AnalysisComponent implements AfterViewInit {
  @ViewChild('pieChart')
  public pieChartContainer: ElementRef;

  @ViewChild('barChart')
  public barChartContainer: ElementRef;

  constructor() { }
  
  ngAfterViewInit() {
    this._initPieChart();
    this._initBarChart();
  }

  private _initBarChart() {
    let ele: HTMLDivElement = this.barChartContainer.nativeElement;
    ele.style.width = '100%';
    ele.style.height = '400px';
    ele.style.padding = '20px';
    let barChart = echarts.init(ele);
    let option = {
      title: {
        text: '一周维修及验收情况',
        x: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      xAxis: {
        type: 'time',
      },
      yAxis: {
        type: 'value',
        boundaryGap: [0, '100%'],
      },
      series: [{
        name: '维修',
        type: 'line',
        data: [
          ['2017/09/05', 10],
          ['2017/09/06', 6],
          ['2017/09/07', 12],
          ['2017/09/08', 15],
          ['2017/09/09', 5],
          ['2017/09/10', 10],
          ['2017/09/11', 8],
        ]
      }, {
          name: '验收',
          type: 'line',
          data: [
            ['2017/09/05', 15],
            ['2017/09/06', 12],
            ['2017/09/07', 6],
            ['2017/09/08',9],
            ['2017/09/09', 13],
            ['2017/09/10', 13],
            ['2017/09/11', 17],
        ]
      }]
    };

    barChart.setOption(option);
  }

  private _initPieChart() {
    let ele: HTMLDivElement = this.pieChartContainer.nativeElement;
    ele.style.width = '100%';
    ele.style.height = '400px';
    ele.style.padding = '20px';
    let pieChart = echarts.init(ele);
    
    // 指定图表的配置项和数据
    let option = {
      title: {
        text: '隧道病害大类占比',
        x: 'center'
      },
      legend: {
        x: 'center',
        y: 'bottom',
        data: ['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
      },
      calculable: true,
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [30, 110],
          center: ['50%', '50%'],
          roseType: 'area',
          data: [
            { value: 7, name: '错台' },
            { value: 9, name: '腐蚀' },
            { value: 17, name: '裂缝' },
            { value: 22, name: '渗漏' },
            { value: 12, name: '缺损' },
            { value: 13, name: '张开' },
          ]
        }
      ]
    };
    // 使用刚指定的配置项和数据显示图表。
    pieChart.setOption(option);
  }

}
