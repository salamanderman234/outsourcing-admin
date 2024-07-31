<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import apiConfig from '@/api/apiConfig';
    import { cilPencil, cilInfo, cilCheckAlt, cilPeople, cilCart, cilStar } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import FeedbackDetailForm from "./forms/FeedbackDetailForm.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/feedbacks/";
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
        title="Manajemen Feedback"
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
                :title="`Detail Feeback #${detailData.id}`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <FeedbackDetailForm
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
            <CTableHeaderCell class="text-center" scope="col">ID Transaksi</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Review</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Tanggal</CTableHeaderCell>
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
                <a :href="`/#/transactions?id=${data.transaction.id}`" v-if="data.transaction">#{{ data.transaction.id }}</a>
                <span v-if="!data.transaction">-</span>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <div>

                    <svg v-for="index in data.review" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill text-warning" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                    <svg v-for="index in 5 - data.review" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                    </svg>
                </div>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                {{ new Date(data.updated_at).toISOString().slice(0, 10) }}
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