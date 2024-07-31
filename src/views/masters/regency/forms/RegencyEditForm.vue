<script setup>
    import {ref} from 'vue';
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const props = defineProps({
        regency: {
            type: Object,
            required: true,
        },
    });
    
    const id = props.regency ? props.regency.id? props.regency.id: 0 : 0;
    const regencyName= ref(props.regency ? props.regency.regency ? props.regency.regency : "" : "");

    const regencyError = ref("");

    const onValidationFail = (json) => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "regency"){
                regencyError.value = error.error;
            }
        });
    }

    const push = async () => {
        const data = JSON.stringify({
            regency: regencyName.value,
        });

        const postUrl = `/regencies/${id}/`;
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
            <CFormLabel for="regency">Daerah</CFormLabel>
            <CFormInput :class="regencyError ? 'border-danger' : ''" v-model="regencyName" type="text" id="regency" placeholder="Nama Daerah"/>
            <div class="text-end text-danger" v-if="regencyError">
                <small>{{ regencyError }}</small>
            </div>
        </div>
    </CForm>
</template>