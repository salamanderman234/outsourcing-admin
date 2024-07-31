<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import apiConfig from '@/api/apiConfig';
    import { cilPencil, cilInfo, cilCheckAlt, cilPeople, cilCart } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import ComplaintDetailForm from "./forms/ComplaintDetailForm.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/complaints/";
    const columns = ["ID"];
    const fields = ["id"];

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

    const editModal = ref(null);
    const showEditModal = ref(false);
    const editForm = ref(null);

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
        title="Manajemen Komplain"
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
                :title="`Detail Komplain #${detailData.id}`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <ComplaintDetailForm
                    ref="detailForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showDetailModal = val"
                />
            </DefaultModal>
        </template>

        <template #button-list>
        </template>   

        <template #additional-columns>
            <CTableHeaderCell class="text-center" scope="col">Pengguna Jasa</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Karyawan</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Penempatan</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Tanggal</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Status Respon</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center align-middle"
            >
                <template v-if="data.service_user">
                    <CTooltip 
                        :content="data.service_user.fullname" 
                        placement="bottom"
                    >
                        <template #toggler="{ id, on }">
                            <CAvatar 
                                :aria-describedby="id" 
                                v-on="on"
                                :src="data.service_user.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.service_user.user.id}/profile/` : avatar" 
                                size="md" 
                                v-if="data.service_user" 
                            />
                        </template>
                    </CTooltip>
                    <a class="ms-2" :href="`/#/service_users?id=${data.service_user.id}`" v-if="data.service_user">#{{ data.service_user.id }}</a>
                </template>
                <span v-if="!data.service_user">-</span>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <template v-if="data.employee">
                    <CTooltip 
                        :content="data.employee.fullname" 
                        placement="bottom"
                    >
                        <template #toggler="{ id, on }">
                            <CAvatar 
                                :aria-describedby="id" 
                                v-on="on"
                                :src="data.employee.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.employee.user.id}/profile/` : avatar" 
                                size="md" 
                                v-if="data.employee" 
                            />
                        </template>
                    </CTooltip>
                    <a class="ms-2" :href="`/#/employees?id=${data.employee.id}`" v-if="data.employee">#{{ data.employee.id }}</a>
                </template>
                <span v-if="!data.employee">-</span>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                {{ data.placement_employee ? data.placement_employee.placement_detail.placement.id : '-' }}
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                {{ new Date(data.created_at).toISOString().slice(0, 10) }}
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <CBadge :color="data.replies.length > 0 ? 'success' : 'danger'">
                    {{ data.replies.length> 0 ? 'Sudah' : 'Belum' }}
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
        </template>   
    </CRUDLayout>
</template>