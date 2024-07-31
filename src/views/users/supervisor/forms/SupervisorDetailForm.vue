<script setup>
    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
</script>

<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Supervisor</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.supervisor_profile.id" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data User</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Email</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.email" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Supervisor</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Status</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.status == 'ACTIVE' ? 'Aktif' : 'Tidak Aktif'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Nama Lengkap</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.fullname" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Daerah</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.regency ? data.supervisor_profile.regency.regency : '-'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Alamat Lengkap</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.full_address" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Tempat Lahir</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.birth_place" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Tanggal Lahir</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="new Date(data.supervisor_profile.birth_date).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>NIK</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.nik" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Jenis Kelamin</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.gender == 'l' ? 'Laki-laki' : 'Perempuan'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>No. Telp</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.supervisor_profile.phone" 
                type="text" 
                disabled
            />
        </div>
    </CForm>
</template>