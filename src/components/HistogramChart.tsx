import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export function HistogramChart({
  xDomain,
  width,
  height,
  data,
  highlight,
}: {
  xDomain: ReadonlyArray<number>
  width: number
  height: number
  data: Array<number>
  highlight: ReadonlyArray<number>
}) {
  const [redraw, setRedraw] = useState(true)
  useEffect(() => {
    requestAnimationFrame(() => setRedraw(true))
  }, [width, height])
  useEffect(() => {
    if (redraw) {
      requestAnimationFrame(() => setRedraw(false))
    }
  }, [redraw])
  if (!data) {
    return null
  }

  const barData = {
    labels: data.map((_, i) => xDomain[0] + i * (xDomain[1] - xDomain[0])),
    datasets: [
      {
        backgroundColor: data.map((_, i) =>
          i >= highlight[0] && i <= highlight[1]
            ? 'rgba(26, 86, 219, 1)'
            : 'rgba(108, 117, 125, 0.3)'
        ),
        data,
        xAxisID: 'xAxis',
        yAxisID: 'yAxis',
      },
    ],
  }
  const options = {
    responsive: false,
    maintainAspectRatio: false,
    animation: {
      duration: 0,
    },
    scales: {
      xAxis: {
        display: false,
        ticks: {
          display: false,
        },
      },
      yAxis: {
        display: false,
        ticks: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  }
  return (
    <div
      className='overflow-hidden absolute'
      style={{ left: 20, right: 20, width, height }}
    >
      <div className='overflow-hidden relative' style={{ width, height }}>
        <Bar
          data={barData}
          options={options}
          redraw={redraw}
          width={width}
          height={height}
          style={{ width, height }}
        />
      </div>
    </div>
  )
}
