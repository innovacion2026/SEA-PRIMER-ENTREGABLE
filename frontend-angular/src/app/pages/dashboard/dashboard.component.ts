import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { NgApexchartsModule, ChartComponent } from 'ng-apexcharts';
import { ApiService } from '../../services/api.service';
import { fmtMoney, fmtDate, totalDeuda, proximasFacturas, gastosMensuales, aging } from '../../data/mock';

import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexYAxis,
  ApexTooltip,
  ApexFill,
  ApexLegend,
  ApexNonAxisChartSeries,
  ApexResponsive
} from "ng-apexcharts";

export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: any;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  colors: string[];
  grid: ApexGrid;
  tooltip: ApexTooltip;
};

export type AreaChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
  dataLabels: ApexDataLabels;
  fill: ApexFill;
  colors: string[];
  grid: ApexGrid;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  colors: string[];
  legend: ApexLegend;
  stroke: ApexStroke;
  tooltip: ApexTooltip;
};

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, NgApexchartsModule],
  template: `
    <div class="space-y-6">
      <!-- Title & Actions -->
      <div class="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold tracking-tight text-primary">Dashboard</h1>
          <p class="text-sm text-muted-foreground mt-1">Visión consolidada de tesorería, gastos y centros de costo (Datos Reales).</p>
        </div>
        <div class="flex flex-wrap gap-2">
          <button class="h-11 px-4 bg-primary hover:bg-primary/95 text-white rounded-xl font-bold text-sm gap-2 shadow-lg shadow-primary/20 flex items-center justify-center transition-all">
            <lucide-icon name="plus" class="h-4 w-4"></lucide-icon> Cargar Factura
          </button>
          <button class="h-11 px-4 border-2 border-slate-300 text-slate-700 hover:bg-slate-55 bg-white rounded-xl font-bold text-sm gap-2 flex items-center justify-center transition-all">
            <lucide-icon name="bar-chart-3" class="h-4 w-4"></lucide-icon> Generar Reporte
          </button>
        </div>
      </div>

      <div class="flex items-center justify-center min-h-[200px]" *ngIf="loading">
        <span class="text-primary font-bold animate-pulse">Analizando flujos financieros...</span>
      </div>

      <ng-container *ngIf="!loading">
        <!-- Stats Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          
          <!-- Card: Deuda Corriente -->
          <div class="card-elevated p-6 relative overflow-hidden group bg-primary/5 text-primary border-primary/10 shadow-primary/5 rounded-2xl border">
            <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <lucide-icon name="wallet" class="h-[120px] w-[120px]"></lucide-icon>
            </div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-white/50">
                  <lucide-icon name="wallet" class="h-5 w-5"></lucide-icon>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-widest opacity-60">Total CXP</div>
              </div>
              <div>
                <div class="text-2xl md:text-3xl font-black tracking-tight">{{ formatMoney(totalDeuda) }}</div>
                <div class="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1">Deuda Corriente</div>
              </div>
            </div>
          </div>

          <!-- Card: Proximos Vencimientos -->
          <div class="card-elevated p-6 relative overflow-hidden group bg-amber-500/5 text-amber-700 border-amber-500/10 shadow-amber-500/5 rounded-2xl border">
            <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <lucide-icon name="calendar-days" class="h-[120px] w-[120px]"></lucide-icon>
            </div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-white/50">
                  <lucide-icon name="calendar-days" class="h-5 w-5"></lucide-icon>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-widest opacity-60">Próximos 14 días</div>
              </div>
              <div>
                <div class="text-2xl md:text-3xl font-black tracking-tight">{{ facturasProximas }}</div>
                <div class="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1">Próximos Vencimientos</div>
              </div>
            </div>
          </div>

          <!-- Card: Gasto Mes -->
          <div class="card-elevated p-6 relative overflow-hidden group bg-primary/5 text-primary border-primary/10 shadow-primary/5 rounded-2xl border">
            <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <lucide-icon name="trending-up" class="h-[120px] w-[120px]"></lucide-icon>
            </div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-white/50">
                  <lucide-icon name="trending-up" class="h-5 w-5"></lucide-icon>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-widest opacity-60">Realizado</div>
              </div>
              <div>
                <div class="text-2xl md:text-3xl font-black tracking-tight">{{ formatMoney(gastoActual) }}</div>
                <div class="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1">Gasto Mes</div>
              </div>
            </div>
          </div>

          <!-- Card: Variacion -->
          <div class="card-elevated p-6 relative overflow-hidden group rounded-2xl border"
               [ngClass]="isUp ? 'bg-rose-500/5 text-rose-700 border-rose-500/10 shadow-rose-500/5' : 'bg-primary/5 text-primary border-primary/10 shadow-primary/5'">
            <div class="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
              <lucide-icon name="trending-up" class="h-[120px] w-[120px]"></lucide-icon>
            </div>
            <div class="relative z-10 flex flex-col h-full justify-between">
              <div class="flex items-center justify-between mb-4">
                <div class="h-10 w-10 rounded-xl bg-white/80 flex items-center justify-center shadow-sm border border-white/50">
                  <lucide-icon name="trending-up" class="h-5 w-5"></lucide-icon>
                </div>
                <div class="text-[10px] font-bold uppercase tracking-widest opacity-60">Mensual</div>
              </div>
              <div>
                <div class="text-2xl md:text-3xl font-black tracking-tight">
                  {{ isUp ? '+' : '' }}{{ variacionPct.toFixed(1) }}%
                </div>
                <div class="text-[11px] font-bold uppercase tracking-[0.2em] opacity-60 mt-1">Variación</div>
              </div>
            </div>
          </div>

        </div>

        <!-- Aging Bar Chart and Upcoming Invoices -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="card-elevated p-8 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="flex items-center justify-between mb-6">
              <div>
                <h2 class="text-xl font-bold tracking-tight text-primary">Envejecimiento de Deuda</h2>
                <p class="text-sm font-medium text-muted-foreground mt-1">Distribución de cuentas por pagar por antigüedad</p>
              </div>
            </div>
            <div class="h-80" *ngIf="agingChartOptions">
              <apx-chart
                [series]="agingChartOptions.series"
                [chart]="agingChartOptions.chart"
                [xaxis]="agingChartOptions.xaxis"
                [yaxis]="agingChartOptions.yaxis"
                [dataLabels]="agingChartOptions.dataLabels"
                [colors]="agingChartOptions.colors"
                [plotOptions]="agingChartOptions.plotOptions"
                [grid]="agingChartOptions.grid"
                [tooltip]="agingChartOptions.tooltip"
              ></apx-chart>
            </div>
          </div>

          <div class="card-elevated p-8 bg-white overflow-hidden rounded-2xl border border-slate-200 shadow-sm">
            <div class="mb-6">
              <h2 class="text-xl font-bold tracking-tight text-primary">Próximos Vencimientos</h2>
              <p class="text-sm font-medium text-muted-foreground mt-1">Top 5 facturas prioritarias</p>
            </div>
            <div class="space-y-4">
              <div *ngFor="let f of proximasFacturas" class="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-transparent hover:border-primary/20 hover:bg-white hover:shadow-sm transition-all duration-300">
                <div class="min-w-0">
                  <div class="text-sm font-bold truncate text-foreground">{{ f.proveedor }}</div>
                  <div class="text-[11px] font-bold text-muted-foreground mt-0.5">{{ formatDate(f.fecha) }}</div>
                </div>
                <div class="text-sm font-black text-primary tabular-nums">{{ formatMoney(f.monto) }}</div>
              </div>
              <div *ngIf="proximasFacturas.length === 0" class="text-center py-12">
                <div class="h-12 w-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <lucide-icon name="check" class="h-6 w-6"></lucide-icon>
                </div>
                <p class="text-sm font-bold text-muted-foreground">Sin facturas pendientes</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Trend Line Area Chart and comparison card -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="card-elevated p-8 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="mb-6">
              <h2 class="text-xl font-bold tracking-tight text-primary">Tendencia de Egresos</h2>
              <p class="text-sm font-medium text-muted-foreground mt-1">Histórico mensual de ejecución de pagos</p>
            </div>
            <div class="h-80" *ngIf="trendChartOptions">
              <apx-chart
                [series]="trendChartOptions.series"
                [chart]="trendChartOptions.chart"
                [xaxis]="trendChartOptions.xaxis"
                [yaxis]="trendChartOptions.yaxis"
                [stroke]="trendChartOptions.stroke"
                [fill]="trendChartOptions.fill"
                [dataLabels]="trendChartOptions.dataLabels"
                [colors]="trendChartOptions.colors"
                [grid]="trendChartOptions.grid"
                [tooltip]="trendChartOptions.tooltip"
              ></apx-chart>
            </div>
          </div>

          <div class="card-elevated p-8 bg-primary text-white overflow-hidden relative group rounded-2xl">
            <div class="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
              <lucide-icon name="trending-up" class="h-[140px] w-[140px]"></lucide-icon>
            </div>
            <div class="relative z-10 flex flex-col h-full">
              <div class="mb-auto">
                <h2 class="text-xl font-bold tracking-tight">Comparativo</h2>
                <p class="text-xs font-bold uppercase tracking-widest opacity-60 mt-1">Mes Actual vs Anterior</p>
              </div>
              <div class="space-y-6 mt-12">
                <div>
                  <div class="text-[11px] font-bold uppercase tracking-widest opacity-60">Mes en Curso</div>
                  <div class="text-4xl font-black tracking-tighter mt-1">{{ formatMoney(gastoActual) }}</div>
                </div>
                <div class="pt-6 border-t border-white/10">
                  <div class="text-[11px] font-bold uppercase tracking-widest opacity-60">Mes Anterior</div>
                  <div class="text-2xl font-bold tracking-tight opacity-80 mt-1">{{ formatMoney(gastoAnterior) }}</div>
                </div>
                <div class="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-wider"
                     [ngClass]="isUp ? 'bg-white/10 text-white' : 'bg-emerald-500/20 text-emerald-400'">
                  <lucide-icon name="trending-up" class="h-4 w-4"></lucide-icon>
                  {{ variacionPct.toFixed(1) }}% de variación
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Cost Center Distribution Pie Chart & Top executions list -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-10">
          <div class="card-elevated p-8 lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="mb-6">
              <h2 class="text-xl font-bold tracking-tight text-primary">Gastos por Centro de Costo</h2>
              <p class="text-sm font-medium text-muted-foreground mt-1">Distribución estratégica de la ejecución presupuestaria</p>
            </div>
            <div class="h-80 flex items-center justify-center" *ngIf="pieChartOptions">
              <apx-chart
                [series]="pieChartOptions.series"
                [chart]="pieChartOptions.chart"
                [labels]="pieChartOptions.labels"
                [colors]="pieChartOptions.colors"
                [legend]="pieChartOptions.legend"
                [stroke]="pieChartOptions.stroke"
                [tooltip]="pieChartOptions.tooltip"
              ></apx-chart>
            </div>
          </div>

          <div class="card-elevated p-8 bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div class="mb-6">
              <h2 class="text-xl font-bold tracking-tight text-primary">Top Ejecución</h2>
              <p class="text-sm font-medium text-muted-foreground mt-1">Centros de costo con mayor movimiento</p>
            </div>
            <div class="space-y-6">
              <div *ngFor="let c of topCentros; let idx = index" class="group">
                <div class="flex items-center justify-between mb-3">
                  <div class="flex items-center gap-3">
                    <div class="h-8 w-8 rounded-lg bg-primary/5 text-primary text-xs font-black flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                      {{ idx + 1 }}
                    </div>
                    <span class="text-sm font-bold text-foreground">{{ c.name }}</span>
                  </div>
                  <span class="text-sm font-semibold text-primary">{{ formatMoney(c.value) }}</span>
                </div>
                <div class="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div class="h-full bg-primary rounded-full transition-all duration-1000" [style.width.%]="getCostCenterPct(c.value)"></div>
                </div>
                <div class="flex justify-between mt-2">
                  <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                    {{ getCostCenterPct(c.value).toFixed(1) }}% Participación
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ng-container>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  loading = true;
  totalDeuda = 0;
  facturasProximas = 0;
  proximasFacturas: any[] = [];
  gastosMensuales: any[] = [];
  aging: any[] = [];
  centrosCosto: any[] = [];
  
  gastoActual = 0;
  gastoAnterior = 0;
  variacionPct = 0;
  isUp = false;
  topCentros: any[] = [];

  // Chart Configurations
  @ViewChild("chart") chart!: ChartComponent;
  agingChartOptions!: BarChartOptions;
  trendChartOptions!: AreaChartOptions;
  pieChartOptions!: PieChartOptions;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadDashboardData();
  }

  loadDashboardData() {
    this.loading = true;
    this.apiService.fetchDashboardStats().subscribe({
      next: (res) => {
        const stats = res || {};
        this.totalDeuda = stats.totalDeuda || 0;
        this.facturasProximas = stats.facturasProximas || 0;
        this.proximasFacturas = stats.proximasFacturas || [];
        this.gastosMensuales = stats.gastosMensuales || [];
        this.aging = stats.aging || [];
        this.centrosCosto = stats.centrosCosto || [];

        this.gastoActual = this.gastosMensuales[this.gastosMensuales.length - 1]?.monto || 0;
        this.gastoAnterior = this.gastosMensuales[this.gastosMensuales.length - 2]?.monto || 0;
        this.variacionPct = this.gastoAnterior ? ((this.gastoActual - this.gastoAnterior) / this.gastoAnterior) * 100 : 0;
        this.isUp = this.variacionPct >= 0;
        this.topCentros = [...this.centrosCosto].sort((a, b) => b.value - a.value).slice(0, 3);

        this.initCharts();
        this.loading = false;
      },
      error: () => {
        this.totalDeuda = totalDeuda;
        this.facturasProximas = proximasFacturas.length;
        this.proximasFacturas = proximasFacturas;
        this.gastosMensuales = gastosMensuales;
        this.aging = aging;
        this.centrosCosto = [
          { name: "Operaciones", value: 125000 },
          { name: "Tecnología", value: 84000 },
          { name: "Ventas", value: 45000 },
          { name: "Administración", value: 31000 }
        ];
        this.gastoActual = this.gastosMensuales[this.gastosMensuales.length - 1]?.monto || 0;
        this.gastoAnterior = this.gastosMensuales[this.gastosMensuales.length - 2]?.monto || 0;
        this.variacionPct = this.gastoAnterior ? ((this.gastoActual - this.gastoAnterior) / this.gastoAnterior) * 100 : 0;
        this.isUp = this.variacionPct >= 0;
        this.topCentros = [...this.centrosCosto].sort((a, b) => b.value - a.value).slice(0, 3);

        this.initCharts();
        this.loading = false;
      }
    });
  }

  getCostCenterTotal(): number {
    return this.centrosCosto.reduce((acc, c) => acc + Number(c.value || 0), 0);
  }

  getCostCenterPct(val: number): number {
    const total = this.getCostCenterTotal();
    return total ? (val / total) * 100 : 0;
  }

  formatMoney(val: any) {
    return fmtMoney(Number(val) || 0);
  }

  formatDate(val: any) {
    return fmtDate(String(val) || '');
  }

  private initCharts() {
    // 1. Envejecimiento de Deuda (Aging) Bar Chart
    this.agingChartOptions = {
      series: [
        {
          name: "Monto",
          data: this.aging.map(a => Number(a.monto || 0))
        }
      ],
      chart: {
        type: "bar",
        height: 320,
        toolbar: { show: false }
      },
      plotOptions: {
        bar: {
          horizontal: false,
          columnWidth: "40%",
          borderRadius: 4
        }
      },
      dataLabels: {
        enabled: false
      },
      xaxis: {
        categories: this.aging.map(a => a.rango),
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "11px",
            fontWeight: 600
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
          style: {
            colors: "#94a3b8",
            fontSize: "11px",
            fontWeight: 600
          }
        }
      },
      colors: ["#3b82f6", "#f59e0b", "#ef4444"],
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
        yaxis: {
          lines: { show: true }
        }
      },
      tooltip: {
        y: {
          formatter: (val) => fmtMoney(val)
        }
      }
    };

    // 2. Tendencia de Egresos Area Chart
    this.trendChartOptions = {
      series: [
        {
          name: "Monto",
          data: this.gastosMensuales.map(g => Number(g.monto || 0))
        }
      ],
      chart: {
        type: "area",
        height: 320,
        toolbar: { show: false }
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width: 3,
        colors: ["#3b82f6"]
      },
      xaxis: {
        categories: this.gastosMensuales.map(g => g.mes),
        labels: {
          style: {
            colors: "#94a3b8",
            fontSize: "11px",
            fontWeight: 600
          }
        },
        axisBorder: { show: false },
        axisTicks: { show: false }
      },
      yaxis: {
        labels: {
          formatter: (value) => `$${(value / 1000).toFixed(0)}k`,
          style: {
            colors: "#94a3b8",
            fontSize: "11px",
            fontWeight: 600
          }
        }
      },
      colors: ["#3b82f6"],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 1,
          opacityFrom: 0.15,
          opacityTo: 0.0,
          stops: [0, 90, 100]
        }
      },
      grid: {
        borderColor: "#f1f5f9",
        strokeDashArray: 4,
        yaxis: {
          lines: { show: true }
        }
      },
      tooltip: {
        y: {
          formatter: (val) => fmtMoney(val)
        }
      }
    };

    // 3. Gastos por Centro de Costo Pie Chart
    this.pieChartOptions = {
      series: this.centrosCosto.map(c => Number(c.value || 0)),
      chart: {
        type: "donut",
        height: 320
      },
      labels: this.centrosCosto.map(c => c.name),
      colors: ["#3b82f6", "#10b981", "#f59e0b", "#6366f1"],
      legend: {
        position: "bottom",
        fontFamily: "Inter, sans-serif",
        fontSize: "11px",
        fontWeight: 700
      },
      stroke: {
        show: false
      },
      tooltip: {
        y: {
          formatter: (val) => fmtMoney(val)
        }
      },
      responsive: [
        {
          breakpoint: 480,
          options: {
            chart: {
              width: 200
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }
}
