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
    const categories = ref([]);
    const employee = ref({
        id: props.data.id, 
        email: props.data.email,
        password: "",   
        employee_profile: {
            fullname: props.data.employee_profile.fullname,
            regency_id: props.data.employee_profile.regency_id,
            full_address: props.data.employee_profile.full_address,
            birth_place: props.data.employee_profile.birth_place,
            birth_date: new Date(props.data.employee_profile.birth_date).toISOString().slice(0,10),
            phone: props.data.employee_profile.phone,
            gender: props.data.employee_profile.gender,
            last_education: props.data.employee_profile.last_education,
            npwp: props.data.employee_profile.npwp,
            nik: props.data.employee_profile.nik,
            category_id: props.data.employee_profile.category_id,
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
        npwp: "-",
        nik: "",
        category_id: ""
    });

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

</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Karyawan</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.employee_profile.id" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data User</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="email">Email</CFormLabel>
            <CFormInput disabled :class="errors.email ? 'border-danger' : ''" v-model="employee.email" type="text" id="email" placeholder="Email pengguna"/>
            <div class="text-end text-danger" v-if="errors.email">
                <small>{{ errors.email }}</small>
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Karyawan</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="category">Kategori Karyawan</CFormLabel>
            <CFormSelect
                aria-label="Pilih Kategori Karyawan"
                v-model="employee.employee_profile.category_id"
                disabled
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
            <CFormInput disabled :class="errors.fullname ? 'border-danger' : ''" v-model="employee.employee_profile.fullname" type="text" id="fullname" placeholder="Nama Lengkap Pengguna"/>
            <div class="text-end text-danger" v-if="errors.fullname">
                <small>{{ errors.fullname }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="nik">NIK</CFormLabel>
            <CFormInput disabled :class="errors.nik ? 'border-danger' : ''" v-model="employee.employee_profile.nik" type="text" id="nik" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.nik">
                <small>{{ errors.nik }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="gender">Jenis Kelamin</CFormLabel>
            <CFormSelect
                aria-label="Jenis Kelamin Karyawan"
                v-model="employee.employee_profile.gender"
                disabled
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
                disabled
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
            <CFormLabel for="full_address">Alamat Lengkap</CFormLabel>
            <CFormInput disabled :class="errors.full_address ? 'border-danger' : ''" v-model="employee.employee_profile.full_address" type="text" id="full_address" placeholder="Alamat Lengkap Pengguna"/>
            <div class="text-end text-danger" v-if="errors.full_address">
                <small>{{ errors.full_address }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="birth_place">Tempat Lahir</CFormLabel>
            <CFormInput disabled :class="errors.birth_place ? 'border-danger' : ''" v-model="employee.employee_profile.birth_place" type="text" id="birth_place" placeholder="Templat Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.birth_place">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="birth_date">Tanggal Lahir</CFormLabel>
            <CFormInput disabled :class="errors.birth_date ? 'border-danger' : ''" v-model="employee.employee_profile.birth_date" type="date" id="birth_date" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.birth_date">
                <small>{{ errors.birth_place }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="phone">No. Telp</CFormLabel>
            <CFormInput disabled :class="errors.phone ? 'border-danger' : ''" v-model="employee.employee_profile.phone" type="text" id="phone" placeholder="Tanggal Lahir Pengguna"/>
            <div class="text-end text-danger" v-if="errors.phone">
                <small>{{ errors.phone }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="regency">Pendidikan Terakhir</CFormLabel>
            <CFormSelect
                aria-label="Pendidikan Terakhir Karyawan"
                v-model="employee.employee_profile.last_education"
                disabled
            >
                <option :selected="employee.employee_profile.last_education == 'sd'" value="sd">SD</option>
                <option :selected="employee.employee_profile.last_education == 'smp'" value="smp">SMP</option>
                <option :selected="employee.employee_profile.last_education == 'sma'" value="sma">SMA</option>
                <option :selected="employee.employee_profile.last_education == 's1'" value="s1">Sarjana</option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.last_education">
                <small>{{ errors.last_education }}</small>
            </div>
        </div>
    </CForm>
</template>