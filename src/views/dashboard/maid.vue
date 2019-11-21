<template>
  <div id="maid" style="height:560px;"></div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        maid: null,
        option: {
          title: {
            text: '返佣图表',
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
            data: ['返佣'],
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
              name: '返佣',
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
      maid_chart: Array,
      width_chart: String
    },
    methods: {
      initChart() {
        this.option.xAxis.data = []
        this.option.series[0].data = []
        for(let i=0;i<this.maid_chart.length;i++){
            this.option.xAxis.data.push(this.maid_chart[i].day)
            this.option.series[0].data.push(this.maid_chart[i].total)
        } 
        this.maid = echarts.init(document.getElementById('maid'))
        this.maid.setOption(this.option)
        this.maid.resize()
      },
      
    },
    mounted() {
      document.getElementById('maid').style.width = this.width_chart
    }
  }
</script>
