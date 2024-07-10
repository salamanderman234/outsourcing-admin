<script setup>
    import {ref} from 'vue';
    import fetcher from '@/api/fetcher';
    import apiConfig from '@/api/apiConfig';

    const baseUrl = apiConfig.baseUrl;

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const props = defineProps({
        province: {
            type: Object,
            required: true,
        },
    });
    
    const id = props.province ? props.province.id? props.province.id: 0 : 0;
    const provinceName= ref(props.province ? props.province.province ? props.province.province : "" : "");

    const provinceError = ref("");

    const onValidationFail = () => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "province"){
                provinceError.value = error.error;
            }
        });
    }

    const push = async () => {
        const data = JSON.stringify({
            province: provinceName.value,
        });

        const postUrl = `/provinces/${id}/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "PATCH", data);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors){
            onValidationFail(json);
        }
        const content = resp.status == 200 ? "Data berhasil diupdate !" : json.message;
        emits("toast", {
            "status": resp.status,
            "title": json.message,
            "content": content,
        });
    }

    defineExpose({
        push,
    });

</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="province_name">Provinsi</CFormLabel>
            <CFormInput v-model="provinceName" type="text" id="province_name" placeholder="Nama Provinsi"/>
            <div class="text-end text-danger" v-if="provinceError">
                <small>{{ provinceError }}</small>
            </div>
        </div>
    </CForm>
</template>