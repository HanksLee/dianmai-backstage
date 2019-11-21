<template>
  <div id="entryAndExit" style="height:560px;"></div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        entryAndExit: null,
        option: {
          title: {
            text: '出入金图表',
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
            data: ['入金量','出金量'],
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
              name: '入金量',
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
            },
            {
              name: '出金量',
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
              color: ['#8E44AD']
            }
          ]
        }
      }
    },
    props: {
      entryAndExit_chart: Object,
      width_chart: String
    },
    methods: {
      initChart() {
        console.log(this.entryAndExit_chart)
        const depositData = this.entryAndExit_chart.deposit || []
        const outOfGold = this.entryAndExit_chart.outOfGold || []
        this.option.xAxis.data = []
        this.option.series[0].data = []
        for(let i=0;i<depositData.length;i++){
            this.option.xAxis.data.push(depositData[i].day)
            this.option.series[0].data.push(depositData[i].total)
        } 
        for(let i=0;i<outOfGold.length;i++){
           this.option.series[1].data.push(outOfGold[i].total)
        }
        this.entryAndExit = echarts.init(document.getElementById('entryAndExit'))
        this.entryAndExit.setOption(this.option)
        this.entryAndExit.resize()
      },
      
    },
    mounted() {
      document.getElementById('entryAndExit').style.width = this.width_chart
    }
  }
</script>
