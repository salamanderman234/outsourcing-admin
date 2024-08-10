<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import apiConfig from '@/api/apiConfig';
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilFilter, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask, cilNotes, cilCarAlt, cilX, cilChart } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import EmployeeDetailForm from "./forms/EmployeeDetailForm.vue";
    import EmployeeEditForm from "./forms/EmployeeEditForm.vue";
    import EmployeeCreateForm from "./forms/EmployeeCreateForm.vue";
    import EmployeePlacementForm from './forms/EmployeePlacementForm.vue';
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/users/role/employee/";
    const columns = ["ID","Email", "Nama Lengkap", "Daerah", "Kategori"];
    const fields = ["employee_profile.id","email" ,"employee_profile.fullname", "employee_profile.regency.regency", 'employee_profile.category.category_name'];
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

    const editModal = ref(null);
    const showEditModal = ref(false);
    const editForm = ref(null);

    const addModal = ref(null);
    const showAddModal = ref(false);
    const addForm = ref(null);

    const placementsModal = ref(null);
    const showplacementsModal = ref(false);
    const placementsForm = ref(null);

    const fetchRegencies = async() => {
        const getUrl = '/regencies/';
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            regencies.value = json.datas;
        }
    }

    fetchRegencies();

    const setActive = async (id, status) => {
        const postUrl = `/users/${id}/`;
        const body = JSON.stringify({
            employee_profile: {
                status: status,
            }
        });
        const resp = await fetcher.fetch(postUrl, "PATCH", body);
        const json = await resp.json();
        if(resp.status == 200 ){
            layout.value.refresh();
        }
        const content = resp.status == 200 ? `Status karyawan berhasil diubah !` : json.detail;
        layout.value.toast({
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
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
        title="Manajemen Karyawan"
        :resource_url="resourceUrl"
        :columns="columns"
        :fields="fields"
        ref="layout"
        :disable_numbering="true"
    >
        <template #modal-list>
            <DefaultModal
                ref="placementsModal"
                :show="showplacementsModal"
                :title="`List Penempatan Karyawan`"
                @toggle="(val) => showplacementsModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <EmployeePlacementForm
                    ref="placementsForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showplacementsModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="detailModal"
                :show="showDetailModal"
                :title="`Detail Karyawan`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <EmployeeDetailForm
                    ref="detailForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showDetailModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="editModal"
                :show="showEditModal"
                :title="`Edit Employee`"
                @toggle="(val) => showEditModal = val"
                @submit="() => editForm.push()"
            >
                <EmployeeEditForm
                    ref="editForm" 
                    :data="detailData"
                    @toggle="(val) => showEditModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => editModal.setLoad(val)"
                />
            </DefaultModal>
            <DefaultModal
                ref="addModal"
                :show="showAddModal"
                :title="`Tambah Employee`"
                @toggle="(val) => showAddModal = val"
                @submit="() => addForm.push()"
            >
                <EmployeeCreateForm
                    ref="addForm" 
                    :data="detailData"
                    @toggle="(val) => showAddModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => addModal.setLoad(val)"
                />
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
            <div class="w-100 ms-0 ms-md-3 my-1 my-md-0">
                <CButton color="primary" class="w-100" @click="() => showAddModal = true">
                    <CIcon :icon="cilPlus" class="me-2" />
                    Tambah
                </CButton>
            </div>
        </template>   

        <template #additional-columns>
            <CTableHeaderCell class="text-center" scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Status Penempatan</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Profile</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center align-middle"
            >
                <CBadge :color="statusMap[data.employee_profile.status] ? statusMap[data.employee_profile.status].color : 'dark'">
                    {{ statusMap[data.employee_profile.status] ? statusMap[data.employee_profile.status].text : data.status }}
                </CBadge>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <CBadge :color="statusPlacementMap[data.employee_profile.placement_status ] ? statusPlacementMap[data.employee_profile.placement_status ].color : 'dark'">
                    {{ statusPlacementMap[data.employee_profile.placement_status ] ? statusPlacementMap[data.employee_profile.placement_status ].text : data.employee_profile.placement_status }}
                </CBadge>
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
                    showplacementsModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilGroup" class="me-2" />
                Lihat List Penempatan
            </CDropdownItem>
            <CDropdownItem :href="`/#/performances?id=${data.employee_profile.id}`">
                <CIcon :icon="cilChart" class="me-2" />
                Lihat Performa
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    showDetailModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilInfo" class="me-2" />
                Detail
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    showEditModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilPencil" class="me-2" />
                Edit
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    setActive(data.id, 'ACTIVE')
                }"
                v-if="data.employee_profile.status != 'ACTIVE'"
            >
                <CIcon :icon="cilCheckAlt" class="me-2" />
                Set Aktif
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    setActive(data.id, 'NONACTIVE')
                }"
                v-if="data.employee_profile.status == 'ACTIVE'"
            >
                <CIcon :icon="cilX" class="me-2" />
                Set Tidak Aktif
            </CDropdownItem>
        </template>   
    </CRUDLayout>
</template>