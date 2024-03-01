import React from 'react'
import PropTypes from 'prop-types'
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

export default function LedgerChartAddresses({ data, isLoading }) {
  const { t } = useTranslation()
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
      trigger: 'axis'
    },
    xAxis: {
      type: 'time'
    },
    yAxis: {
      type: 'log',
      name: 'Addresses',
      min: 1
    },
    series: [
      {
        type: 'line',
        showSymbol: false,
        name: 'Active',
        lineStyle: {
          width: 1
        },
        data: data.active_addresses
      },
      {
        type: 'line',
        showSymbol: false,
        name: 'Reused',
        lineStyle: {
          width: 1
        },
        data: data.reused_addresses
      },
      {
        type: 'line',
        showSymbol: false,
        name: 'New',
        lineStyle: {
          width: 1
        },
        data: data.open_count
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
            <p>
              {t(
                'ledger.addresses.total_number',
                'The total number of active, new, and reused addresses used per day.'
              )}
            </p>
            <p>
              {t(
                'ledger.addresses.active_detail',
                'Active shows the number of unique addresses used. New shows the number of addresses created. Reused shows the number of addresses used that were created on a previous day.'
              )}
            </p>
          </div>
        </div>
        <LedgerChartMetrics
          data={data.active_addresses}
          label={t('ledger.addresses.active_stats', 'Active Address Stats')}
        />
        <LedgerChartMetrics
          data={data.open_count}
          label={t('ledger.addresses.new_stats', 'New Address Stats')}
        />
      </div>
    </>
  )
}

LedgerChartAddresses.propTypes = {
  data: PropTypes.object,
  isLoading: PropTypes.bool
}
