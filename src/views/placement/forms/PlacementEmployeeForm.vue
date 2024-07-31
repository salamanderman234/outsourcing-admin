<script setup>
    import {ref, watchEffect} from "vue"
    import { cilPlus, cilSave, cilSettings, cilTrash } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";
    import fetcher from "@/api/fetcher";

    const props = defineProps({
        placement: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const data = ref({
        placement_detail_id: "",
        employee_id: "",
        category_id: "",
    });
    const errors = ref({
        placement_detail_id: "",
        employee_id: "",
    });
    const employees = ref([]);
    const fetchEmployees = async () => {
        const regencyID = props.placement.regency_id || false;
        const categoryID = data.value.category_id || false;
        if(!regencyID || !categoryID) {
            employees.value = [];
            return
        }
        const getUrl = `/users/role/employee/?regency_id=${regencyID}&placement_status=available&status=ACTIVE&category_id=${categoryID}`;
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            const datas = json.datas;
            employees.value = datas;
        }
    }
    const changeCategoryID = () => {
        const filter = props.placement.details.filter((e) => {
            return e.id == data.value.placement_detail_id;
        });
        const det = filter.length == 1 ? filter[0] : {};
        const category = det.service ? det.service.category_id : 0;
        data.value.category_id = category;
    }
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
        dataParseInt();
        const rawData = JSON.stringify(data.value);
        const postUrl = `/placements/employees/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "POST", rawData);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        emits('refresh','');
        emits('toggle', false);
        const content = resp.status == 201 ? `Berhasil menempatkan karyawan` : json.detail;
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
    const dataParseInt = () => {
        data.value.placement_detail_id = parseInt(data.value.placement_detail_id) || 0;
        data.value.employee_id = parseInt(data.value.employee_id) || 0;
    }
    defineExpose({
        push,
    });
    watchEffect(() => {
        changeCategoryID();
        fetchEmployees();
    });
</script>
<template>
    <div class="mb-3">
        <CFormLabel for="category">Service</CFormLabel>
        <CFormSelect
            aria-label="Pilih Supervisor"
            v-model="data.placement_detail_id"
        >
            <option value="0">Pilih Service</option>
            <template v-for="detail in placement.details" :key="detail.id">
                <option :value="detail.id" v-if="detail.service && detail.filled < detail.total_employee">
                    {{ detail.service.service_name }} ({{ detail.filled }} / {{ detail.total_employee }})
                </option>
            </template>
        </CFormSelect>
        <div class="text-end text-danger" v-if="errors.placement_detail_id">
            <small>{{ errors.placement_detail_id }}</small>
        </div>
    </div>
    <div class="mb-3">
        <CFormLabel for="category">Karyawan</CFormLabel>
        <CFormSelect
            aria-label="Pilih Supervisor"
            v-model="data.employee_id"
        >
            <option value="0">{{ employees.length > 0 ? 'Pilih Karyawan' : 'Tidak ada karyawan yang tersedia' }}</option>
            <template v-for="employee in employees" :key="employee.employee_profile.id">
                <option :value="employee.employee_profile.id" v-if="employee.employee_profile">
                    {{ employee.employee_profile.fullname }}
                </option>
            </template>
        </CFormSelect>
        <div class="text-end text-danger" v-if="errors.employee_id">
            <small>{{ errors.employee_id }}</small>
        </div>
    </div>
</template>