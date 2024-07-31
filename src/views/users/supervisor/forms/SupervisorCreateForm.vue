<script setup>
    import fetcher from "@/api/fetcher";
    import {ref} from "vue";
    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const supervisor = ref({
        email: "",
        password: "",
        supervisor_profile: {
            fullname: "",
            status: "ACTIVE",
            regency_id: "",
            full_address: "",
            birth_place: "",
            birth_date: Date.now(),
            nik: "",
            gender: "l",
            phone: "",
        }
    });
    const errors = ref({
        email: "",
        password: "",
        fullname: "",
        status: "",
        regency_id: "",
        full_address: "",
        birth_place: "",
        birth_date: "",
        nik: "",
        gender: "",
        phone: "",
    });
    const regencies = ref([]);

    const onValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            const field = error.field;
            if(errors.value.hasOwnProperty(field)){
                errors.value[field] = error.error;
            }
        });
    };
    const resetError = () => {
        for(const key in errors.value){
            const error = errors.value[key];
            if(error){
                errors.value[key] = "";
            }
        }
    }
    const dataParseInt = () => {
        supervisor.value.supervisor_profile.birth_date = new Date(supervisor.value.supervisor_profile.birth_date).toISOString();
        supervisor.value.supervisor_profile.regency_id = parseInt(supervisor.value.supervisor_profile.regency_id) || 0;
    }
    const push = async () => {
        resetError();
        dataParseInt();
        const rawData = JSON.stringify(supervisor.value);
        const postUrl = `/supervisor/register/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "POST", rawData);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 200 ? `Berhasil membuat supervisor ! Silahkan check email yang terdaftar untuk mengkonfirmasi supervisor` : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    const fetchRegencies = async () => {
        const getUrl = '/regencies/';
        const resp = await fetcher.fetch(getUrl, 'GET', false);
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
                v-model="supervisor.email"
                type="text" 
                placeholder="Email Pengguna"
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Password</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.password ? 'border-danger' : ''"
                v-model="supervisor.password"
                type="password" 
                placeholder="******"
            />
            <div class="text-end text-danger" v-if="errors.password">
                <small>{{ errors.password }}</small>
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Supervisor</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Status</span>
            </CFormLabel>
            <CFormSelect
                aria-label="Pilih Status"
                v-model="supervisor.supervisor_profile.status"
            >
                <option value="ACTIVE">Aktif</option>
                <option value="NONACTIVE">Tidak Aktif</option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.status">
                <small>{{ errors.status }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Nama Lengkap</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.fullname ? 'border-danger' : ''"
                v-model="supervisor.supervisor_profile.fullname" 
                type="text" 
                placeholder="Nama Lengkap Pengguna"
            />
            <div class="text-end text-danger" v-if="errors.fullname">
                <small>{{ errors.fullname }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Daerah</span>
            </CFormLabel>
            <CFormSelect
                aria-label="Pilih Daerah"
                v-model="supervisor.supervisor_profile.regency_id"
            >
                <option value="0">Pilih Daerah</option>
                <option 
                    :value="regency.id" 
                    v-for="regency in regencies" 
                    :key="regency.id"
                >
                    {{ regency.regency }}
                </option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.regency_id">
                <small>{{ errors.regency_id }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Alamat Lengkap</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.full_address ? 'border-danger' : ''"
                v-model="supervisor.supervisor_profile.full_address" 
                type="text" 
                placeholder="Alamat Lengkap Pengguna"
            />
            <div class="text-end text-danger" v-if="errors.full_address">
                <small>{{ errors.full_address }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Tempat Lahir</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.birth_place ? 'border-danger' : ''"
                v-model="supervisor.supervisor_profile.birth_place" 
                type="text" 
                placeholder="Tempat Lahir Pengguna"
            />
            <div class="text-end text-danger" v-if="errors.birth_place">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Tanggal Lahir</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.birth_date ? 'border-danger' : ''"
                v-model="supervisor.supervisor_profile.birth_date" 
                type="date" 
            />
            <div class="text-end text-danger" v-if="errors.birth_date">
                <small>{{ errors.birth_date }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>NIK</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.nik ? 'border-danger' : ''"
                v-model="supervisor.supervisor_profile.nik" 
                type="text" 
                placeholder="NIK Pengguna"
            />
            <div class="text-end text-danger" v-if="errors.nik">
                <small>{{ errors.nik }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Jenis Kelamin</span>
            </CFormLabel>
            <CFormSelect
                aria-label="Pilih Gender"
                v-model="supervisor.supervisor_profile.gender"
            >
                <option value="l">Laki-laki</option>
                <option value="p">Perempuan</option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.gender">
                <small>{{ errors.gender }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>No. Telp</span>
            </CFormLabel>
            <CFormInput 
                :class="errors.phone ? 'border-danger' : ''"
                v-model="supervisor.supervisor_profile.phone" 
                type="text" 
                placeholder="No. Telp Pengguna"
            />
            <div class="text-end text-danger" v-if="errors.phone">
                <small>{{ errors.phone }}</small>
            </div>
        </div>
    </CForm>
</template>