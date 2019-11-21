<template>
  <div id="profitAndLoss" style="height:560px;"></div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        profitAndLoss: null,
        option: {
          title: {
            text: '盈亏图表',
            textStyle: {
              fontWeight: 'normal',
              fontSize: 16,
              color: '#F1F1F3'
            },
            left: '3%'
          },
          tooltip: {
            trigger: 'axis',
            padding: 12,
            axisPointer: {                     // 坐标轴指示器，坐标轴触发有效
              type: 'shadow'                   // 默认为直线，可选为：'line' |
            }
          },
          legend: {
            selectedMode: true,
            data: ['盈亏'],
            itemWidth: 20,
            itemHeight: 12,
            right: '10%',
            itemGap: 30
          },
          grid: {
            left: '2.5%',
            right: '0',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            type: 'category',
            data: []
          },
          yAxis: {
            type: 'value',
            axisLabel: {
              formatter: '{value}'
            }
          },
          series: [
            {
              name: '盈亏',
              type: 'line',
              barWidth: 'auto',
              smooth: true,
              symbol: 'circle',
              symbolSize: 5,
              showSymbol: false,
              lineStyle: {
                normal: {
                  width: 1
                }
              },
              data: [],
              color: ['#049DF8']
            }
          ]
        }
      }
    },
    props: {
      profitAndLoss_chart: Array,
      width_chart: String
    },
    methods: {
      initChart() {
        this.option.xAxis.data = []
        this.option.series[0].data = []
        for(let i=0;i<this.profitAndLoss_chart.length;i++){
            this.option.xAxis.data.push(this.profitAndLoss_chart[i].day)
            this.option.series[0].data.push(this.profitAndLoss_chart[i].total)
        } 
        this.profitAndLoss = echarts.init(document.getElementById('profitAndLoss'))
        this.profitAndLoss.setOption(this.option)
        this.profitAndLoss.resize()
      },
      
    },
    mounted() {
      document.getElementById('profitAndLoss').style.width = this.width_chart
    }
  }
</script>
