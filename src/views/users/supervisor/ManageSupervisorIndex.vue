<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import apiConfig from '@/api/apiConfig';
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilFilter, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask, cilNotes, cilCarAlt, cilX } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import SupervisorDetailForm from "./forms/SupervisorDetailForm.vue";
    import SupervisorEditForm from "./forms/SupervisorEditForm.vue";
    import SupervisorCreateForm from "./forms/SupervisorCreateForm.vue";
    import SupervisorPlacementForm from "./forms/SupervisorPlacementForm.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/users/role/supervisor/";
    const columns = ["ID","Email", "Nama Lengkap", "Daerah","No.Telp"];
    const fields = ["supervisor_profile.id","email" ,"supervisor_profile.fullname", "supervisor_profile.regency.regency", 'supervisor_profile.phone'];
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

    watchEffect(() => {
        if(id && layout.value) {
            const datas = layout.value.exposeDatas();
            if(datas){
                const filtered = datas.filter((e) => {
                    return e.supervisor_profile.id == id;
                })
                if(filtered.length == 1){
                    showDetailModal.value = true;
                    detailData.value = filtered[0];
                }
            }
        }
    });

    const setActive = async (id, status) => {
        const postUrl = `/users/${id}/`;
        const body = JSON.stringify({
            supervisor_profile: {
                status: status,
            }
        });
        const resp = await fetcher.fetch(postUrl, "PATCH", body);
        const json = await resp.json();
        if(resp.status == 200 ){
            layout.value.refresh();
        }
        const content = resp.status == 200 ? `Status supervisor berhasil diubah !` : json.detail;
        layout.value.toast({
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
</script>

<template>
    <CRUDLayout
        title="Manajemen Supervisor"
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
                :title="`List Penempatan Supervisor`"
                @toggle="(val) => showplacementsModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <SupervisorPlacementForm
                    ref="placementsForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showplacementsModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="detailModal"
                :show="showDetailModal"
                :title="`Detail Supervisor`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <SupervisorDetailForm
                    ref="detailForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showDetailModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="editModal"
                :show="showEditModal"
                :title="`Edit Supervisor`"
                @toggle="(val) => showEditModal = val"
                @submit="() => editForm.push()"
            >
                <SupervisorEditForm
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
                :title="`Tambah Supervisor`"
                @toggle="(val) => showAddModal = val"
                @submit="() => addForm.push()"
            >
                <SupervisorCreateForm
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
            <CTableHeaderCell class="text-center" scope="col">Profile</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center"
            >
                <CBadge :color="statusMap[data.supervisor_profile.status] ? statusMap[data.supervisor_profile.status].color : 'dark'">
                    {{ statusMap[data.supervisor_profile.status] ? statusMap[data.supervisor_profile.status].text : data.status }}
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
                v-if="data.supervisor_profile.status != 'ACTIVE'"
            >
                <CIcon :icon="cilCheckAlt" class="me-2" />
                Set Aktif
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    setActive(data.id, 'NONACTIVE')
                }"
                v-if="data.supervisor_profile.status == 'ACTIVE'"
            >
                <CIcon :icon="cilX" class="me-2" />
                Set Tidak Aktif
            </CDropdownItem>
        </template>   
    </CRUDLayout>
</template>