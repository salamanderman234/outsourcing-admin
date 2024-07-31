<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import apiConfig from '@/api/apiConfig';
    import {ref, watchEffect, watch} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilFilter, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask, cilNotes, cilCarAlt, cilX, cilChart } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import PerformanceChart from './modals/PerformanceChart.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/users/role/employee/";
    const columns = ["ID","Nama Lengkap", "Daerah", "Kategori"];
    const fields = ['employee_profile.id',"employee_profile.fullname", "employee_profile.regency.regency", 'employee_profile.category.category_name'];
    const regencies = ref([]);

    const layout = ref(null);
    const statusMap = {
        ACTIVE: {
            text: "Aktif",
            color: "success"
        },
        NONACTIVE: {
            text:"Tidak Aktif",
            color:"danger"
        },
    }
    const statusAray = [];
    for(const key in statusMap){
        statusAray.push({
            label: statusMap[key].text,
            value: key,
        });
    }
    const statusPlacementMap = {
        available: {
            text: "Tersedia",
            color: "success"
        },
        not_available: {
            text:"Tidak TErsedia",
            color:"danger"
        },
    }

    const detailModal = ref(null);
    const showDetailModal = ref(false);
    const detailForm = ref(null);
    const detailData = ref({});
    const selectedYear = ref(`${new Date().getFullYear()}`);

    const showAddModal = ref(false);

    const fetchRegencies = async() => {
        const getUrl = '/regencies/';
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            regencies.value = json.datas;
        }
    }

    fetchRegencies();
    const chartData = ref([0,0,0,0,0,0,0,0,0,0,0,0]);
    const fetchChart = async () => {
        let results = [];
        if(!detailData.value.employee_profile){
            return [0,0,0,0,0,0,0,0,0,0,0,0];
        }
        const fun = async (index) => {
            const from = new Date(selectedYear.value, index-1, 29).toISOString();
            const to = new Date(selectedYear.value, index, 29).toISOString();
            const getUrl = `/performances/?employee_id=${detailData.value.employee_profile.id}&from=${from}&to=${to}`
            const resp = await fetcher.fetch(getUrl, "GET", false);
            const json = await resp.json();

            if(resp.status != 200){
                return 0;
            }
            const apiDatas = json.datas;
            let total = 0;
            let length = apiDatas.length;
            apiDatas.forEach((data, index) => {
                total += data.rate;
            })
            const finale = length ? total/length : 0;
            return finale.toFixed(2);
        }
        
        for(let i = 0; i < 12 ; i++){
            results.push(await fun(i));
        }
        return results
    }
    watch(detailData,async () => {
        const result = await fetchChart();
        chartData.value = result;
        detailForm.value.updateChart(result);
    });
    watch(selectedYear,async () => {
        const result = await fetchChart();
        chartData.value = result;
        detailForm.value.updateChart(result);
    });

    const sumPerformance = (datas) => {
        let total = 0;
        const length = datas.length;
        datas.forEach((e) => {
            total += e.rate;
        })
        const finale = total / length;
        return finale.toFixed(2);
    }
    watchEffect(() => {
        if(id && layout.value) {
            const datas = layout.value.exposeDatas();
            if(datas){
                const filtered = datas.filter((e) => {
                    return e.employee_profile.id == id;
                })
                if(filtered.length == 1){
                    showDetailModal.value = true;
                    detailData.value = filtered[0];
                }
            }
        }
    });
</script>

<template>
    <CRUDLayout
        title="Manajemen Performa Karyawan"
        :resource_url="resourceUrl"
        :columns="columns"
        :fields="fields"
        ref="layout"
        :disable_numbering="true"
    >
        <template #modal-list>
            <DefaultModal
                ref="detailModal"
                :show="showDetailModal"
                :title="`Performa Karyawan`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <CRow>
                    <CCol>
                        <template v-if="detailData">
                            <CAvatar 
                                :src="detailData.profile_pic ? `${apiConfig.baseUrl}/resource/users/${detailData.id}/profile/` : avatar" 
                                size="md" 
                                v-if="detailData.employee_profile" 
                            />
                            {{ detailData.employee_profile ? detailData.employee_profile.fullname : '-' }}
                            <a :href="`/#/employees?id=${detailData.employee_profile.id}`" v-if="detailData.employee_profile">#{{ detailData.employee_profile.id }}</a>
                        </template>
                    </CCol>
                    <CCol>
                        <div class="mb-3">
                            <CFormSelect
                                class="w-100"
                                v-model="selectedYear"
                                :options="[
                                    { label: `Tahun ${new Date().getFullYear()}`, value: `${new Date().getFullYear()}` },
                                    { label: `Tahun ${new Date().getFullYear() - 1}`, value: `${new Date().getFullYear() - 1}` },
                                    { label: `Tahun ${new Date().getFullYear() - 2}`, value: `${new Date().getFullYear() - 2}` },
                                ]"
                            >
                            </CFormSelect>
                        </div>
                    </CCol>
                </CRow>
                
                <PerformanceChart ref="detailForm" :year="selectedYear" :datas="chartData" />
            </DefaultModal>
        </template>

        <template #button-list>
            <div class="w-100 d-flex align-items-center  my-1 my-md-0">
                <CIcon :icon="cilFilter" class="me-2" />
                <CFormSelect
                    class="w-100"
                    @change="(e) => layout.setQueries('status', e.target.value)"
                    :options="[
                        { label: 'Semua Status', value: '' },
                        ...statusAray
                    ]"
                >
                </CFormSelect>
            </div>
            <div class="w-100 ms-md-3 ms-0 d-flex align-items-center  my-1 my-md-0">
                <CIcon :icon="cilFilter" class="me-2" />
                <CFormSelect
                    class="w-100"
                    @change="(e) => layout.setQueries('regency_id', e.target.value)"
                    :options="[
                        { label: 'Semua Daerah', value: '' },
                        ...regencies.map((e) => ({
                            label: e.regency,
                            value: e.id
                        }))
                    ]"
                >
                </CFormSelect>
            </div>
        </template>   

        <template #additional-columns>
            <CTableHeaderCell class="text-center" scope="col">Performa</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Profil</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center align-middle"
            >
                {{ 
                    data.employee_profile.performances ? sumPerformance(data.employee_profile.performances) : 0 
                }}
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <CAvatar 
                    :src="data.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.id}/profile/` : avatar" 
                    size="md" 
                />
            </CTableDataCell>
        </template>   

        <template #action-list="{data}">
            <CDropdownItem 
                @click="() => {
                    showDetailModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilChart" class="me-2" />
                Lihat Performa
            </CDropdownItem>
        </template>   
    </CRUDLayout>
</template>