<template>
  <div id="accountChart" style="height:560px;width:92%;"></div>
</template>
<script>
  import echarts from 'echarts'

  export default {
    data() {
      return {
        accountchart: null,
        option: {
          title: {
            text: '客户图表',
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
            data: ['新增客户'],
            itemWidth: 20,
            itemHeight: 12,
            right: '0',
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
              formatter: '{value} 个'
            }
          },
          series: [
            {
              name: '新增客户',
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
      account_chart: Array
    },
  watch: {
    account_chart(){ //监听数据变化
      this.initChart()
    }
},
    methods: {
      initChart() {
        this.option.xAxis.data = []
        this.option.series[0].data = []
        for(let i=0;i<this.account_chart.length;i++){
            this.option.xAxis.data.push(this.account_chart[i].day)
            this.option.series[0].data.push(this.account_chart[i].total)
        } 
        this.accountchart = echarts.init(document.getElementById('accountChart'))
        this.accountchart.setOption(this.option)
        this.accountchart.resize()
      },
      
    },
    mounted() {
      this.initChart()
    }
  }
</script>
