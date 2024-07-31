<script setup>
    import {ref} from "vue"
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const regencies = ref([]);
    const categories = ref([]);
    const employee = ref({
        email: "",
        password: "",   
        employee_profile: {
            fullname: "",
            regency_id: 0,
            full_address: "",
            birth_place: "",
            birth_date: Date.now(),
            phone: "",
            gender: "l",
            last_education: "sd",
            npwp: "-",
            nik: "",
            category_id: 0,
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
        last_education: "",
        npwp: "",
        nik: "",
        category_id: ""
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
        if(employee.value.employee_profile.birth_date){
            employee.value.employee_profile.birth_date = new Date(employee.value.employee_profile.birth_date).toISOString();
        }
        if(employee.value.employee_profile.regency_id){
            employee.value.employee_profile.regency_id = parseInt(employee.value.employee_profile.regency_id);
        }
        if(employee.value.employee_profile.category_id){
            employee.value.employee_profile.category_id = parseInt(employee.value.employee_profile.category_id);
        }
        const data = JSON.stringify(employee.value);
        const postUrl = `/employee/register/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "POST", data);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 200 ? "Data pengguna karyawan berhasil dibuat !, silahkan cek email yang terdaftar untuk memverifikasi pengguna" : json.detail;
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
    const fetchCategories = async () => {
        const getUrl = "/categories/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            categories.value = json.datas;
        }
    }

    fetchRegencies();
    fetchCategories();

    defineExpose({
        push,
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="email">Email</CFormLabel>
            <CFormInput :class="errors.email ? 'border-danger' : ''" v-model="employee.email" type="text" id="email" placeholder="Email pengguna"/>
            <div class="text-end text-danger" v-if="errors.email">
                <small>{{ errors.email }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="password">Password</CFormLabel>
            <CFormInput :class="errors.password ? 'border-danger' : ''" v-model="employee.password" type="password" id="password" placeholder="*******"/>
            <div class="text-end text-danger" v-if="errors.password">
                <small>{{ errors.password }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="category">Kategori Karyawan</CFormLabel>
            <CFormSelect
                aria-label="Pilih Kategori Karyawan"
                v-model="employee.employee_profile.category_id"
            >
                <option value="0">Pilih Kategori</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">
                    {{ category.category_name }}
                </option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.category_id">
                <small>{{ errors.category_id }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="fullname">Nama Lengkap</CFormLabel>
            <CFormInput :class="errors.fullname ? 'border-danger' : ''" v-model="employee.employee_profile.fullname" type="text" id="fullname" placeholder="Nama Lengkap Pengguna"/>
            <div class="text-end text-danger" v-if="errors.fullname">
                <small>{{ errors.fullname }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="nik">NIK</CFormLabel>
            <CFormInput :class="errors.nik ? 'border-danger' : ''" v-model="employee.employee_profile.nik" type="text" id="nik" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.nik">
                <small>{{ errors.nik }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="gender">Jenis Kelamin</CFormLabel>
            <CFormSelect
                aria-label="Jenis Kelamin Karyawan"
                v-model="employee.employee_profile.gender"
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
                v-model="employee.employee_profile.regency_id"
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
            <CFormInput :class="errors.full_address ? 'border-danger' : ''" v-model="employee.employee_profile.full_address" type="text" id="full_address" placeholder="Alamat Lengkap Pengguna"/>
            <div class="text-end text-danger" v-if="errors.full_address">
                <small>{{ errors.full_address }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="birth_place">Tempat Lahir</CFormLabel>
            <CFormInput :class="errors.birth_place ? 'border-danger' : ''" v-model="employee.employee_profile.birth_place" type="text" id="birth_place" placeholder="Templat Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.birth_place">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="birth_date">Tanggal Lahir</CFormLabel>
            <CFormInput :class="errors.birth_date ? 'border-danger' : ''" v-model="employee.employee_profile.birth_date" type="date" id="birth_date" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.birth_date">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="phone">No. Telp</CFormLabel>
            <CFormInput :class="errors.phone ? 'border-danger' : ''" v-model="employee.employee_profile.phone" type="text" id="phone" placeholder="Kontak Pengguna"/>
            <div class="text-end text-danger" v-if="errors.phone">
                <small>{{ errors.phone }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="regency">Pendidikan Terakhir</CFormLabel>
            <CFormSelect
                aria-label="Pendidikan Terakhir Karyawan"
                v-model="employee.employee_profile.last_education"
            >
                <option value="sd">SD</option>
                <option value="smp">SMP</option>
                <option value="sma">SMA</option>
                <option value="s1">Sarjana</option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.last_education">
                <small>{{ errors.last_education }}</small>
            </div>
        </div>
    </CForm>
</template>