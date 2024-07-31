<script setup>
    import {ref} from "vue"
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const question = ref("");
    const hint = ref("");

    const questionError = ref("");
    const hintError = ref("");

    const onValidationFail = (json) => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "question"){
                questionError.value = error.error;
            }else if (field == "hint"){
                hintError.value = error.error;
            }
        });
    };

    const push = async () => {
        const rawData = {
            question: question.value,
            hint: hint.value,
        }
        const data = JSON.stringify(rawData);
        const postUrl = `/questions/`;
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
        const content = resp.status == 201 ? "Data Pertanyaan berhasil dibuat !" : json.detail;
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
            <CFormLabel for="question">Pertanyaan</CFormLabel>
            <CFormInput :class="questionError ? 'border-danger' : ''" v-model="question" type="text" id="question" placeholder="Pertanyaan tentang performa karyawan"/>
            <div class="text-end text-danger" v-if="questionError">
                <small>{{ questionError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="hint">Hint</CFormLabel>
            <CFormInput :class="hintError ? 'border-danger' : ''" v-model="hint" type="text" id="hint" placeholder="Penjelasan maksud dari pertanyaan"/>
            <div class="text-end text-danger" v-if="hintError">
                <small>{{ hintError }}</small>
            </div>
        </div>
    </CForm>
</template>