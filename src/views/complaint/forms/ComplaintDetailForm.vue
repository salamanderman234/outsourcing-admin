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
        placement_employee_id: props.data.placement_employee_id || "0",
        placement_employee: props.data.placement_employee || false,
        employee_id: props.data.employee_id || "0",
        employee: props.data.employee || false,
        comment: props.data.comment || "",
        replies: props.data.replies || [],
        created_at: props.data.created_at || "-"
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
                <span>ID Komplain</span>
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
                <span>Tanggal Komplain</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="new Date(data.created_at).toISOString().slice(0,10)" 
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
                <span>Karyawan</span>
            </CFormLabel>
            <template v-if="data.employee">
                <CAvatar 
                    :src="data.employee.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.employee.user.id}/profile/` : avatar" 
                    size="md" 
                    v-if="data.employee" 
                />
                {{ data.employee ? data.employee.fullname : '-' }}
                <a :href="`/#/employees?id=${data.employee.id}`" v-if="data.employee">#{{ data.employee.id }}</a>
            </template>
            <small v-if="!data.employee" class="text-secondary">Pengguna tidak ditemukan</small>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Penempatan</span>
                <a v-if="data.placement_employee" :href="`/#/placements?id=${data.placement_employee.placement_detail.placement.id}`">Lihat Penempatan</a>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.placement_employee_id" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
        <CFormLabel for="description">Detail Komplain</CFormLabel>
            <CFormTextarea 
                disabled
                v-model="data.comment"
                rows="3"
                class=""
            ></CFormTextarea>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Balasan</span>
        </small>
        <hr />
        <CAccordion>
            <CAccordionItem :item-key="reply.id" v-for="reply in data.replies">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between w-100 px-2">
                        <span>
                            <span>
                                {{ reply.supervisor ? reply.supervisor.fullname : '-' }}
                                <a :href="`/#/supervisors?id=${reply.supervisor.id}`" v-if="reply.supervisor">#{{ reply.supervisor.id }}</a>
                            </span>
                            <small v-if="reply.supervisor" class="d-block text-secondary">
                                Supervisor
                            </small>
                        </span>
                        <div>
                            <span>{{ new Date(reply.updated_at).toISOString().slice(0,10) }}</span>
                        </div>
                    </div>
                </CAccordionHeader>
                <CAccordionBody>
                    <div class="text-center">
                        {{ reply.reply || 'Balasan kosong' }}
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary" v-if="data.replies.length <= 0">
            Belum ada balasan
        </div>
    </CForm>
</template>