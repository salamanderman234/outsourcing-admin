<script setup>
    import {ref} from "vue"
    import fetcher from '@/api/fetcher';

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const regencies = ref([]);
    const serviceUser = ref({
        id: props.data.id, 
        email: "",
        password: "",   
        service_user_profile: {
            fullname: props.data.service_user_profile.fullname,
            regency_id: props.data.service_user_profile.regency_id,
            full_address: props.data.service_user_profile.full_address,
            birth_place: props.data.service_user_profile.birth_place,
            birth_date: new Date(props.data.service_user_profile.birth_date).toISOString().slice(0,10),
            phone: props.data.service_user_profile.phone,
            gender: props.data.service_user_profile.gender,
            nik: props.data.service_user_profile.nik,
        }
    });

    const errors = ref({
        email: "",
        password: "",   
        fullname: "",
        regency_id: "",
        full_address: "",
        birth_place: "",
        birth_date: "",
        phone: "",
        gender: "",
        nik: "",
    });

    const onValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            const field = error.field;
            if(errors.value.hasOwnProperty(field)){
                errors.value[field] = error.error;
            }
        });
    };

    const push = async () => {
        resetError();
        if(serviceUser.value.service_user_profile.birth_date){
            serviceUser.value.service_user_profile.birth_date = new Date(serviceUser.value.service_user_profile.birth_date).toISOString();
        }
        if(serviceUser.value.service_user_profile.regency_id){
            serviceUser.value.service_user_profile.regency_id = parseInt(serviceUser.value.service_user_profile.regency_id);
        }
        const data = JSON.stringify(serviceUser.value);
        const postUrl = `/users/${serviceUser.value.id}/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "PATCH", data);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 200 ? `Data pengguna jasa ${serviceUser.value.service_user_profile.fullname} berhasil diedit !` : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    const resetError = () => {
        for(const key in errors.value){
            const error = errors.value[key];
            if(error){
                errors.value[key] = "";
            }
        }
    }

    const fetchRegencies = async () => {
        const getUrl = "/regencies/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            regencies.value = json.datas;
        }
    }

    fetchRegencies();

    defineExpose({
        push,
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="email">Email</CFormLabel>
            <CFormInput :class="errors.email ? 'border-danger' : ''" v-model="serviceUser.email" type="text" id="email" placeholder="Email pengguna"/>
            <div class="text-end text-danger" v-if="errors.email">
                <small>{{ errors.email }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="password">Password</CFormLabel>
            <CFormInput :class="errors.password ? 'border-danger' : ''" v-model="serviceUser.password" type="password" id="password" placeholder="*******"/>
            <div class="text-end text-danger" v-if="errors.password">
                <small>{{ errors.password }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="fullname">Nama Lengkap</CFormLabel>
            <CFormInput :class="errors.fullname ? 'border-danger' : ''" v-model="serviceUser.service_user_profile.fullname" type="text" id="fullname" placeholder="Nama Lengkap Pengguna"/>
            <div class="text-end text-danger" v-if="errors.fullname">
                <small>{{ errors.fullname }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="nik">NIK</CFormLabel>
            <CFormInput :class="errors.nik ? 'border-danger' : ''" v-model="serviceUser.service_user_profile.nik" type="text" id="nik" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.nik">
                <small>{{ errors.nik }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="gender">Jenis Kelamin</CFormLabel>
            <CFormSelect
                aria-label="Jenis Kelamin Karyawan"
                v-model="serviceUser.service_user_profile.gender"
            >
                <option value="l">Laki-laki</option>
                <option value="p">Perempuan</option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.gender">
                <small>{{ errors.gender }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="regency">Daerah Tinggal</CFormLabel>
            <CFormSelect
                aria-label="Pilih Daerah tinggal pengguna"
                v-model="serviceUser.service_user_profile.regency_id"
            >
                <option value="0">Pilih Daerah</option>
                <option :value="regency.id" v-for="regency in regencies" :key="regency.id">
                    {{ regency.regency }}
                </option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.regency_id">
                <small>{{ errors.regency_id }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="full_address">Alamat Lengkap</CFormLabel>
            <CFormInput :class="errors.full_address ? 'border-danger' : ''" v-model="serviceUser.service_user_profile.full_address" type="text" id="full_address" placeholder="Alamat Lengkap Pengguna"/>
            <div class="text-end text-danger" v-if="errors.full_address">
                <small>{{ errors.full_address }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="birth_place">Tempat Lahir</CFormLabel>
            <CFormInput :class="errors.birth_place ? 'border-danger' : ''" v-model="serviceUser.service_user_profile.birth_place" type="text" id="birth_place" placeholder="Templat Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.birth_place">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="birth_date">Tanggal Lahir</CFormLabel>
            <CFormInput :class="errors.birth_date ? 'border-danger' : ''" v-model="serviceUser.service_user_profile.birth_date" type="date" id="birth_date" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.birth_date">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="phone">No. Telp</CFormLabel>
            <CFormInput :class="errors.phone ? 'border-danger' : ''" v-model="serviceUser.service_user_profile.phone" type="text" id="phone" placeholder="Kontak Pengguna"/>
            <div class="text-end text-danger" v-if="errors.phone">
                <small>{{ errors.phone }}</small>
            </div>
        </div>
    </CForm>
</template>