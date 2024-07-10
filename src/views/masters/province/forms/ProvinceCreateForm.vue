<script setup>
    import {ref} from "vue"
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const province = ref("");

    const provinceError = ref("");

    const onValidationFail = (json) => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "province"){
                provinceError.value = error.error;
            }
        });
    };

    const push = async () => {
        const rawData = {
            province: province.value,
        }
        const data = JSON.stringify(rawData);
        const postUrl = `/provinces/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "POST", data);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400) {
            onValidationFail(json);
        }
        const content = resp.status == 201 ? "Data berhasil dibuat !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    defineExpose({
        push,
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="province">Provinsi</CFormLabel>
            <CFormInput :class="provinceError ? 'border-danger' : ''" v-model="province" type="text" id="province" placeholder="Nama Provinsi"/>
            <div class="text-end text-danger" v-if="provinceError">
                <small>{{ provinceError }}</small>
            </div>
        </div>
    </CForm>
</template>