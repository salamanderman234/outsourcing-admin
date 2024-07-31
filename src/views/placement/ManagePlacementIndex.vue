<script setup>
    import apiConfig from '@/api/apiConfig';
    import avatar from '@/assets/images/avatars/8.jpg'
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilMoney, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask, cilNotes, cilCarAlt, cilCart, cilChart } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import PlacementDetailForm from "./forms/PlacementDetailForm.vue";
    import PlacementEditForm from "./forms/PlacementEditForm.vue";
    import PlacementEmployeeForm from "./forms/PlacementEmployeeForm.vue";
    import PlacementFormListForm from "./forms/PlacementFormListForm.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/placements/";
    const columns = ["ID","Nama","Daerah","Durasi (Hari)"];
    const fields = ["id", "name","regency.regency", 'duration'];


    const layout = ref(null);
    const statusMap = {
        ongoing: {
            text: "Sedang Berjalan",
            color: "primary"
        },
        suspended: {
            text:"Suspend",
            color:"danger"
        },
        end: {
            text:"Selesai",
            color:"success"
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

    const addEmployeeModal = ref(null);
    const showAddEmployeeModal = ref(false);
    const addEmployeeForm = ref(null);

    const editModal = ref(null);
    const showEditModal = ref(false);
    const editForm = ref(null);

    const formListModal = ref(null);
    const showFormListModal = ref(false);
    const formListForm = ref(null);

    const setDone = async (data) => {
        console.log(data);
        if(!data.transaction){
            return
        }
        const body = JSON.stringify({
            status: "done"
        });
        const postUrl = `/transactions/${data.transaction_id}/set_status/`;
        const resp = await fetcher.fetch(postUrl, "PATCH", body);
        const json = await resp.json();
        if(resp.status == 200){
            layout.value.refresh();
        }
        const content = resp.status == 200 ? `Berhasil menyelesaikan penempatan !` : json.detail;
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
                    return e.id == id;
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
        title="Manajemen Penempatan"
        :resource_url="resourceUrl"
        :columns="columns"
        :fields="fields"
        :disable_search="true"
        :disable_numbering="true"
        ref="layout"
    >
        <template #modal-list>
            <DefaultModal
                ref="detailModal"
                :show="showDetailModal"
                :title="`Detail Penempatan #${detailData.id}`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <PlacementDetailForm
                    ref="detailForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showDetailModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="formListModal"
                :show="showFormListModal"
                :title="`List Form Performa Penempatan #${detailData.id}`"
                @toggle="(val) => showFormListModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <PlacementFormListForm
                    ref="formListForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showFormListModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="addEmployeeModal"
                :show="showAddEmployeeModal"
                :title="`Tambah Karyawan Penempatan #${detailData.id}`"
                @toggle="(val) => showAddEmployeeModal = val"
                @submit="() => addEmployeeForm.push()"
            >
                <PlacementEmployeeForm
                    ref="addEmployeeForm" 
                    :placement="detailData"
                    @toggle="(val) => showAddEmployeeModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => addEmployeeModal.setLoad(val)"
                />
            </DefaultModal>
            <DefaultModal
                ref="editModal"
                :show="showEditModal"
                :title="`Edit Penempatan #${detailData.id}`"
                @toggle="(val) => showEditModal = val"
                @submit="() => editForm.push()"
            >
                <PlacementEditForm
                    ref="editForm" 
                    :placement="detailData"
                    @toggle="(val) => showEditModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => editModal.setLoad(val)"
                />
            </DefaultModal>
        </template>

        <template #button-list>
            <div>
                <CFormSelect
                    @change="(e) => layout.setQueries('query', e.target.value)"
                    :options="[
                        { label: 'Semua Status', value: '' },
                        ...statusAray
                    ]"
                >
                </CFormSelect>
            </div>
        </template>   

        <template #additional-columns>
            <CTableHeaderCell class="text-center" scope="col">Tgl Mulai</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">ID Transaksi</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Supervisor</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Status</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center align-middle"
            >
                {{ new Date(data.start_date).toISOString().slice(0, 10) }}
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <a v-if="data.transaction" :href="`/transactions?id=${data.transaction_id}`">#{{ data.transaction_id }}</a>
                <span v-if="!data.transaction">-</span>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <template v-if="data.supervisor">
                    <CTooltip 
                        :content="data.supervisor.fullname" 
                        placement="bottom"
                    >
                        <template #toggler="{ id, on }">
                            <CAvatar 
                                :aria-describedby="id" 
                                v-on="on"
                                :src="data.supervisor.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.supervisor.user.id}/profile/` : avatar" 
                                size="md" 
                                v-if="data.supervisor" 
                            />
                        </template>
                    </CTooltip>
                    <a class="ms-2" :href="`/#/supervisors?id=${data.supervisor.id}`" v-if="data.supervisor">#{{ data.supervisor.id }}</a>
                </template>
                <span v-if="!data.supervisor">-</span>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <CBadge :color="statusMap[data.status] ? statusMap[data.status].color : 'dark'">
                    {{ statusMap[data.status] ? statusMap[data.status].text : data.status }}
                </CBadge>
            </CTableDataCell>
        </template>   

        <template #action-list="{data}">
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
                    showFormListModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilChart" class="me-2" />
                List Form
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    showAddEmployeeModal = true;
                    detailData = data;
                }"
                v-if="data.status != 'end'"
            >
                <CIcon :icon="cilPeople" class="me-2" />
                Tambah Karyawan
            </CDropdownItem>
            <CDropdownItem 
                @click="() => {
                    setDone(data);
                }"
                v-if="data.status == 'ongoing'"
            >
                <CIcon :icon="cilCheckAlt" class="me-2" />
                Set Selesai
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
                :href="`/#/transactions?id=${data.transaction_id}`"
                v-if="data.transaction"
            >
                <CIcon :icon="cilCart" class="me-2" />
                Lihat Transaksi
            </CDropdownItem>
        </template>   
    </CRUDLayout>
</template>