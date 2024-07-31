<script setup>
    import {ref} from "vue"
    import { cilPlus, cilSave, cilSettings, cilTrash } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";
    import fetcher from "@/api/fetcher";

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const data = ref({
        transaction_id: props.data.id,
        note: "",
        supervisor_id: "0",
    });
    const errors = ref({
        transaction_id: "",
        note: "",
        supervisor_id: "",
    });
    const supervisors = ref([]);
    const fetchSupervisors = async () => {
        const regencyID = data.value.regency_id;
        const getUrl = `/users/role/supervisor/?regency_id=${regencyID}`;
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            const datas = json.datas;
            supervisors.value = datas;
        }
    }
    fetchSupervisors();
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
        const postUrl = `/placements/`;
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
        const content = resp.status == 201 ? `Data penempatan pada transaksi #${props.data.id} dibuat !` : json.detail;
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
        data.value.supervisor_id = parseInt(data.value.supervisor_id) || 0;
    }
    defineExpose({
        push,
    });
</script>
<template>
    <div class="mb-3">
        <CFormLabel for="category">Supervisor</CFormLabel>
        <CFormSelect
            aria-label="Pilih Supervisor"
            v-model="data.supervisor_id"
        >
            <option value="0">Pilih Supervisor</option>
            <option :value="supervisor.supervisor_profile.id" v-for="supervisor in supervisors" :key="supervisor.supervisor_profile.id">
                {{ supervisor.supervisor_profile.fullname }}
            </option>
        </CFormSelect>
        <div class="text-end text-danger" v-if="errors.supervisor_id">
            <small>{{ errors.supervisor_id }}</small>
        </div>
    </div>
    <div class="mb-3">
        <CFormLabel for="description">Catatan</CFormLabel>
        <CFormTextarea 
            :class="errors.note ? 'border-danger' : ''" 
            v-model="data.note"
            id="note" 
            placeholder="Catatan penempatan"
            rows="3"
        ></CFormTextarea>
        <div class="text-end text-danger" v-if="errors.note">
            <small>{{ errors.note }}</small>
        </div>
    </div>
</template>