<template>
  <div class="echart-container">
    <v-chart class="chart" :option="chartOption" autoresize />
  </div>
</template>

<script setup>
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
} from 'echarts/components'
import VChart from 'vue-echarts'
import { computed } from 'vue'

// Register ECharts components
use([
  CanvasRenderer,
  BarChart,
  LineChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent,
])

const props = defineProps({
  title: {
    type: String,
    default: 'ECharts Demo',
  },
  xAxisData: {
    type: Array,
    default: () => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  },
  series: {
    type: Array,
    default: () => [
      {
        name: 'Data 1',
        type: 'bar',
        data: [40, 20, 12, 39, 10, 40],
      },
    ],
  },
  horizontal: {
    type: Boolean,
    default: false,
  },
})

// Determine if we're using a pie chart
const isPieChart = computed(() => {
  return props.series.length > 0 && props.series[0].type === 'pie'
})

// Chart options
const chartOption = computed(() => {
  // Base configuration
  const baseConfig = {
    title: {
      text: props.title,
      left: 'center',
    },
    tooltip: {
      trigger: isPieChart.value ? 'item' : 'axis',
    },
    legend: {
      top: '30px',
    },
  }

  // For pie charts
  if (isPieChart.value) {
    return {
      ...baseConfig,
      series: props.series,
    }
  }

  // For horizontal bar charts
  if (props.horizontal && !isPieChart.value) {
    return {
      ...baseConfig,
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true,
      },
      yAxis: {
        type: 'category',
        data: props.xAxisData,
        axisLabel: {
          width: 120,
          overflow: 'truncate',
          interval: 0,
        },
      },
      xAxis: {
        type: 'value',
      },
      series: props.series.map((item) => ({
        ...item,
        type: 'bar',
      })),
    }
  }

  // For regular bar/line charts
  return {
    ...baseConfig,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: props.xAxisData,
    },
    yAxis: {
      type: 'value',
    },
    series: props.series,
  }
})
</script>

<style scoped>
.echart-container {
  height: 350px;
  width: 100%;
}
.chart {
  height: 100%;
  width: 100%;
}
</style>
