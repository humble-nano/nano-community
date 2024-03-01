import React from 'react'
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js'
import ReactEChartsCore from 'echarts-for-react/lib/core'
import * as echarts from 'echarts/core'
import { LineChart } from 'echarts/charts'
import {
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import { useTranslation } from 'react-i18next'

import LedgerChartMetrics from '@components/ledger-chart-metrics'

echarts.use([
  TooltipComponent,
  LegendComponent,
  LineChart,
  CanvasRenderer,
  GridComponent
])

export default function LedgerChartBlocks({ data, isLoading }) {
  const { t } = useTranslation()
  const spanStyle =
    'float:right;margin-left:20px;font-size:14px;color:#666;font-weight:900'
  const option = {
    grid: {
      containLabel: true
    },
    legend: {
      show: true,
      bottom: 0
    },
    tooltip: {
      className: 'echarts-tooltip',
      trigger: 'axis',
      formatter: (series) => {
        const values = series.map(
          (s) =>
            `${s.marker} ${s.seriesName} <span style="${spanStyle}">${BigNumber(
              s.data[1]
            )
              .shiftedBy(-30)
              .toFormat(0)}</span>`
        )

        values.unshift(series[0].axisValueLabel)

        return values.join('<br/>')
      }
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'value',
      name: 'Nano',
      axisLabel: {
        formatter: (value) => `${BigNumber(value).shiftedBy(-30).toFormat(0)}`
      }
    },
    series: [
      {
        type: 'line',
        name: t('block_type.send', 'Send'),
        showSymbol: false,
        lineStyle: {
          width: 1
        },
        data: data.send_volume
      },
      {
        type: 'line',
        name: t('block_type.change', 'Change'),
        showSymbol: false,
        lineStyle: {
          width: 1
        },
        data: data.change_volume
      }
    ]
  }

  return (
    <>
      <ReactEChartsCore
        echarts={echarts}
        option={option}
        showLoading={isLoading}
        loadingOption={{ maskColor: 'rgba(255, 255, 255, 0)', text: '' }}
        style={{ width: '100%', height: '400px' }}
      />
      <div className='ledger__chart-sections'>
        <div className='ledger__chart-section'>
          <div className='section__heading'>
            <span>{t('ledger.description', 'Description')}</span>
          </div>
          <div className='ledger__chart-section-body description'>
            {t(
              'ledger.volume.description',
              'The total amount sent (in Nano) and total amount of voting weight changed per day.'
            )}
          </div>
        </div>
        <LedgerChartMetrics
          data={data.send_volume.map((d) => [
            d[0],
            BigNumber(d[1]).shiftedBy(-30).toNumber()
          ])}
          label={t('ledger.volume.send_stats', 'Send Stats')}
          show_total
        />
        <LedgerChartMetrics
          data={data.change_volume.map((d) => [
            d[0],
            BigNumber(d[1]).shiftedBy(-30).toNumber()
          ])}
          label={t('ledger.volume.change_stats', 'Change Stats')}
          show_total
        />
      </div>
    </>
  )
}

LedgerChartBlocks.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
}
