<script setup>
    import {ref} from "vue";
    import fetcher from '@/api/fetcher';

    const emits =  defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const props = defineProps({
        id: {
            type: Number,
            required: true,
            default: 0,
        }
    });
    const data = ref({
        status: "",
    });
    const errors = ref({
        status: ""
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
        const rawData = JSON.stringify(data.value);
        const postUrl = `/transactions/${props.id}/set_status/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "PATCH", rawData);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 200 ? "Status transaksi berhasil diubah !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
    defineExpose({
        push,
    })
    const statuses = [
        {
            text: 'Sedang Berjalan',
            value:'ongoing'
        }, 
        {
            text: "Suspend",
            value:'suspended'
        },
        {   text:"Selesai",
            value: 'done'
        }
    ];
</script>
<template>
    <div class="mb-3">
        <CFormLabel for="package_name">Status</CFormLabel>
        <CFormSelect
            aria-label="Pilih Status"
            v-model="data.status"
        >
            <option value="0">Pilih Status</option>
            <option :value="status.value" v-for="status in statuses" :key="status.value">
                {{ status.text }}
            </option>
        </CFormSelect>
        <div class="text-end text-danger" v-if="errors.status">
            <small>{{ errors.status }}</small>
        </div>
    </div>
</template>