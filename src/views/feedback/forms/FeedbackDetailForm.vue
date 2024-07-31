<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import {ref, watchEffect} from "vue"
    import { cilMediaStop, cilPlus, cilSave, cilSettings, cilThumbDown, cilThumbUp, cilTrash, cilX } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";
    import fetcher from "@/api/fetcher";
    import { CButton } from "@coreui/vue";

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const data = ref({
        id: props.data.id,
        service_user_id: props.data.service_user_id || "0",
        service_user: props.data.service_user || false,
        transaction_id: props.data.transaction_id || "0",
        transaction: props.data.transaction || false,
        comment: props.data.comment || "",
        review: props.data.review || 0,
        updated_at: props.data.created_at || "-"
    });

    const refresh = async () => {
        const getUrl = `/complaints/${data.value.id}/`;
        const respX = await fetcher.fetch(getUrl, "GET", false);
        const jsonX = await respX.json();
        if(respX.status == 200){
            data.value = jsonX.data;
        }
    }
</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Feedback</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.id" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Tanggal Feedback</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="new Date(data.updated_at).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Pengguna Jasa</span>
            </CFormLabel>
            <template v-if="data.service_user">
                <CAvatar 
                    :src="data.service_user.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.service_user.user.id}/profile/` : avatar" 
                    size="md" 
                    v-if="data.service_user" 
                />
                {{ data.service_user ? data.service_user.fullname : '-' }}
                <a :href="`/#/service_users?id=${data.service_user.id}`" v-if="data.service_user">#{{ data.service_user.id }}</a>
            </template>
            <small v-if="!data.service_user" class="text-secondary">Pengguna tidak ditemukan</small>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Transaksi</span>
                <a v-if="data.transaction" :href="`/#/transactions?id=${data.transaction.id}`">Lihat Transaksi</a>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.transaction_id" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Review</span>
                <a v-if="data.placement_employee" :href="`/#/placements?id=${data.placement_employee.placement_detail.placement.id}`">Lihat Penempatan</a>
            </CFormLabel>
            <svg v-for="index in data.review" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill text-warning" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <svg v-for="index in 5 - data.review" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <small class="mx-1">({{ data.review }} / 5)</small>
        </div>
        <div class="mb-3">
        <CFormLabel for="description">Detail Feedback</CFormLabel>
            <CFormTextarea 
                disabled
                v-model="data.comment"
                rows="3"
                class=""
            ></CFormTextarea>
        </div>
    </CForm>
</template>