<script setup>
    import {ref} from 'vue';

    let data = localStorage.getItem('user');
    if(!data){
        data = JSON.parse(data);
    }
    const user = ref(data);
    const errors = ref({
        fullname: "",
    });
</script>

<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="fullname">Nama Lengkap</CFormLabel>
            <CFormInput v-model="user.superadmin_profile.fullname" type="text" id="fullname" placeholder="Nama Lengkap"/>
            <div class="text-end text-danger" v-if="errors.fullname">
                <small>{{ errors.fullname }}</small>
            </div>
        </div>
    </CForm>
</template>