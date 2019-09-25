import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';

declare const $: any;

@Component({
  selector: 'ev-history-chart',
  templateUrl: './history-chart.component.html'
})
export class HistoryChartComponent implements OnInit {

  graphId = 'chart-container';
  @Input() coinShortName;

  private chart;
  private seriesOptions = [];

  ngOnInit(): void {
    this.loadDataFull();
    // this.init();
  }

  initChart() {
    const that = this;
    Highcharts.stockChart(this.graphId, {

      chart: {
        zoomType: 'x'
      },
      legend: {
        enabled: true
      },
      xAxis: {
        type: 'datetime'
      },
      yAxis: [{
        labels: {
          formatter: function () {
            return (this.value > 0 ? ' + ' : '') + this.value + 'TL';
          }
        },
        /* plotLines: [{
           value: 0,
           width: 2,
           color: 'silver'
         }]*/
      },
        {
          labels: {
            formatter: function () {
              return (this.value > 0 ? ' + ' : '') + this.value + '%';
            },
            style: {color: '#009933'},
            align: 'left',
            x: 15
          },
          title: {
            text: 'Değer (USD)',
            style: {
              color: '#009933', 'font-weight': 'bold'
            }
          },
          showEmpty: false,
          height: '80%',
          opposite: true,
          floor: 0
        }
      ],

      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },

      // plotOptions: {
      //   series: {
      //     compare: 'percent',
      //     showInNavigator: true
      //   }
      // },
      credits: {
        enabled: true,
        href: 'https://www.evarlik.com',
        text: 'evarlik.com'
      },


      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 4,
        split: true
      },
      rangeSelector: {
        allButtonsEnabled: true,
        buttons: [
          {
            type: 'day',
            count: 1,
            text: '1G'
          }, {
            type: 'week',
            count: 1,
            text: '7G'
          }, {
            type: 'month',
            count: 1,
            text: '1A'
          },
          {
            type: 'month',
            count: 3,
            text: '3A'
          }, {
            type: 'year',
            count: 1,
            text: '1Y'
          }],
        selected: 4,
        inputEnabled: true,
        enabled: true
      },
      series: this.seriesOptions
    });
  }

  loadData() {
    let seriesCounter = 0;
    const names = ['DOGE'];
    $.each(names, (i, name) => {
// https://graphs.coinmarketcap.com/currencies/bitcoin/1463687109110/1466365509110/
      // $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',
      $.getJSON(`https://min-api.cryptocompare.com/data/histoday?aggregate=1&fsym=${name}&limit=360&tsym=TRY`,
        (data) => {

          if (data.Response === 'Success') {
            const serieData = [];

            data.Data.forEach(value => {
              serieData.push([value.time * 1000, (value.high + value.low) / 2]);
            });
            this.seriesOptions[i] = {
              name: name,
              data: serieData
            };
          }

          seriesCounter += 1;

          if (seriesCounter === names.length) {
            this.initChart();
          }
        });
    });
  }

  loadDataFull() {
    let seriesCounter = 0;
    const now = new Date().getTime();
// https://graphs.coinmarketcap.com/currencies/bitcoin/1463687109110/1466365509110/
    // $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' + name.toLowerCase() + '-c.json&callback=?',
    $.getJSON(`https://min-api.cryptocompare.com/data/histohour?aggregate=1&fsym=${this.coinShortName}&limit=2000&tsym=TRY`,
      (data) => {

        if (data.Response === 'Success') {
          const serieData = [];

          data.Data.forEach(value => {
            serieData.push([value.time * 1000, (value.high + value.low) / 2]);
          });
          this.seriesOptions[0] = {
            name: this.coinShortName,
            data: serieData
          };
          $.getJSON(`https://min-api.cryptocompare.com/data/histohour?aggregate=1&fsym=${this.coinShortName}&limit=2000&tsym=TRY&toTs=${data.TimeFrom}`,
            (data2) => {

              if (data2.Response === 'Success') {

                data2.Data.forEach(value => {
                  serieData.push([value.time * 1000, (value.high + value.low) / 2]);
                });
                $.getJSON(`https://min-api.cryptocompare.com/data/histohour?aggregate=1&fsym=${this.coinShortName}&limit=2000&tsym=TRY&toTs=${data2.TimeFrom}`,
                  (data3) => {
                    if (data3.Response === 'Success') {

                      data3.Data.forEach(value => {
                        serieData.push([value.time * 1000, (value.high + value.low) / 2]);
                      });
                    }

                    seriesCounter += 1;
                    this.seriesOptions[0].data.sort(function (a, b) {
                      return a[0] - b[0];
                    });
                    this.initChart();

                  });
              }
            });
        }
      });
  }

  init(start?, end?) {
    this.fetchAndLoad(this.initCharts, start, end);
  }

  private initCharts(seriesData) {

    $('#' + this.graphId).highcharts('StockChart', {
      chart: {type: 'line', zoomType: 'x', height: this.isMobile() ? 520 : 620, ignoreHiddenSeries: true},
      responsive: {
        rules: [{
          condition: {maxWidth: 500},
          chartOptions: {chart: {zoomType: 'none'}, credits: {enabled: false}, scrollbar: {enabled: false}}
        }]
      },
      tooltip: {shared: true, hideDelay: 50, xDateFormat: '%A, %b %d %Y, %H:%M:%S UTC'},
      legend: {
        enabled: true,
        align: 'center',
        backgroundColor: '#FFFFFF',
        borderColor: 'black',
        borderWidth: 0,
        layout: 'horizontal',
        verticalAlign: 'bottom',
        y: 0,
        shadow: false,
        floating: false
      },
      navigator: {adaptToUpdatedData: false},
      scrollbar: {liveRedraw: false},
      // title: {
      //   text: 'BitCoin',
      //   align: "left",
      //   style: {fontSize: "24px"}
      // },
      subtitle: {text: ''},
      credits: {href: 'https://evarlik.com', text: 'evarlik.com'},
      rangeSelector: {
        allButtonsEnabled: true,
        buttons: [
          {
            type: 'day',
            count: 1,
            text: '1G'
          }, {
            type: 'week',
            count: 1,
            text: '7G'
          }, {
            type: 'month',
            count: 1,
            text: '1A'
          },
          {
            type: 'month',
            count: 3,
            text: '3A'
          }, {
            type: 'year',
            count: 1,
            text: '1Y'
          }, {
            type: 'ytd',
            count: 1,
            text: 'YDT'
          }, {
            type: 'all',
            text: 'TÜMÜ'
          }],
        selected: 6,
        inputEnabled: true,
        enabled: true
      },
      xAxis: [{
        events: {
          afterSetExtremes: (e) => {
            this.afterSetExtremes(e);
          }
        }, minRange: 24 * 3600 * 1000
      }],
      yAxis: [
        {
          labels: {
            formatter: function () {
              return '$' + this.axis.defaultLabelFormatter.call(this);
            }, align: 'right', style: {color: '#7cb5ec'}
          },
          title: {
            text: 'Market',
            style: {color: '#7cb5ec', 'font-weight': 'bold'}
          },
          showEmpty: false,
          height: '80%',
          opposite: false,
          floor: 0,
        },
        {
          labels: {
            // formatter: label_format_fiat,
            style: {color: '#009933'},
            align: 'left',
            x: 15
          },
          title: {
            text: 'Değer (USD)',
            style: {
              color: '#009933', 'font-weight': 'bold'
            }
          },
          showEmpty: false,
          height: '80%',
          opposite: true,
          floor: 0
        },
        {
          labels: {
            // formatter: label_format_crypto,
            style: {color: '#f7931a'},
            align: 'left',
            x: 15
          },
          title: {
            text: 'Değer (BTC)',
            style: {
              color: '#f7931a',
              'font-weight': 'bold'
            }
          },
          showEmpty: false,
          height: '80%',
          opposite: true,
          floor: 0
        },
        {
          labels: {
            align: 'right',
            style: {
              color: '#777'
            }
          },
          title: {
            text: 'Volume',
            style: {
              color: '#777',
              'font-weight': 'bold'
            }
          },
          showEmpty: false,
          top: '80%',
          height: '20%',
          offset: 2,
          lineWidth: 1,
          opposite: false
        }],
      series: [
        {
          name: 'Market',
          color: '#7cb5ec',
          tooltip: {
            // pointFormatter: tooltip_format_market_cap
          },
          data: seriesData['market_cap_by_available_supply'],
          visible: true, // this.seriesIsVisible(this.chartName, 0, true),
          dataGrouping: {enabled: false}
        }, {
          name: 'Değer (USD)',
          yAxis: 1,
          color: '#009933',
          // tooltip: {pointFormatter: tooltip_format_fiat},
          data: seriesData['price_usd'],
          visible: true, // series_is_visible(this.chartName, 1, (!is_altcoin(this.slug) || !is_mobile())),
          dataGrouping: {enabled: false}
        }, {
          name: 'Değer (BTC)',
          color: '#f7931a',
          yAxis: 2,
          // tooltip: {pointFormatter: tooltip_format_crypto},
          data: seriesData['price_btc'],
          visible: true, // series_is_visible(this.chartName, 2, is_altcoin(this.slug)),
          dataGrouping: {enabled: false}
        }, {
          type: 'column',
          name: 'Volume',
          color: '#777',
          yAxis: 3,
          // tooltip: {pointFormatter: tooltip_format_market_cap},
          data: seriesData['volume_usd'],
          visible: true, // series_is_visible(this.chartName, 3, true),
          dataGrouping: {
            approximation: 'average', enabled: false
          }
        }],
      plotOptions: {
        series: {
          events: {
            legendItemClick: function (event) {
              // var index = event.target.index;
              // save_preferences(that.chartName, index, this.chart);
            }
          }
        }
      },
    });
  }


  private isMobile() {
    const mobile = $('#metadata').data('mobile');
    return mobile === 'True';
  }

  private afterSetExtremes(e) {
    if (e.dataMin !== e.min || e.dataMax !== e.max) {
      const min = Math.round(e.min);
      const max = Math.round(e.max);
      this.updateCharts(min, max);
    }
  }

  private updateCharts(min, max) {
    const chart = $('#' + this.graphId).highcharts();
    chart.showLoading('Loading data from server...');
    this.fetchAndLoad(this.finishUpdateCharts, min, max);
  }

  private fetchAndLoad(callback, start?, end?) {
    const slug = 'bitcoin'; //  $('#metadata').data('slug');
    let timeParams = '';
    if (start !== undefined && end !== undefined) {
      timeParams = start + '/' + end + '/';
    }
    $.ajax({
      url: '/market/history/api/' + slug + '/' + timeParams, type: 'GET', dataType: 'json', error: function () {
        // that.hideLoading();
        // that.showNoData();
      }, success: (data) => {
        callback(data);
      }
    });
  }


  private finishUpdateCharts(seriesData) {
    const chart = $('#' + this.graphId).highcharts();
    chart.series[0].setData(seriesData['market_cap_by_available_supply']);
    chart.series[1].setData(seriesData['price_usd']);
    chart.series[2].setData(seriesData['price_btc']);
    chart.series[3].setData(seriesData['volume_usd']);
    chart.hideLoading();
  }

  /*private label_format_fiat() {
    if (this.isMobile()) {
      val = format_fiat_short(this.value);
    } else {
      val = format_fiat(this.value);
    }
  }*/

  private seriesIsVisible(chartName, index, defaultState) {
    // var preferences=Cookies.getJSON('highcharts_'+chartName);
    // if(preferences===undefined){return defaultState;}
    // return preferences[index];
    return true;
  }

}
