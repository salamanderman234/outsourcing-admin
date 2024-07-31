<script setup>
    import {ref, watchEffect, watch} from 'vue';
    import fetcher from "@/api/fetcher";
    import VueApexCharts from 'vue3-apexcharts';
    

    const props = defineProps({
        datas: {
            type: Array,
            required: true,
            default: [0,0,0,0,0,0,0,0,0,0,0,0]
        },
        year: {
            type: String,
            default: `${new Date().getFullYear()}`
        }
    })

    const chartRef = ref(null);
    const datasRef = ref(props.datas);
    const yearRef = ref(props.year);

    const series = ref([
        {
            name: `Rating pada keseluruhan penempatan`,
            data: datasRef.value
        }
    ],)
    const chartOptions = ref({
        chart: {
            height: 350,
            type: 'line',
            zoom: {
            enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            curve: 'straight'
        },
        title: {
            text: `Performa Karyawan Pertahun`,
            align: 'left'
        },
        grid: {
            row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', "Nov", "Dec"],
        }
    });
    const updateChart = (datas)=>{
        series.value[0].data = datas;
        chartRef.value.updateSeries(series.value);
    }

    defineExpose({
        updateChart,
    })
</script>

<template>
    <div class="container">
      <VueApexCharts 
        type="line" 
        height="350" 
        :options="chartOptions" 
        :series="series" 
        ref="chartRef"
    />
    </div>
</template>