<script setup>
    import {ref} from 'vue';
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const props = defineProps({
        question: {
            type: Object,
            required: true,
        },
    });
    
    const id = props.question ? props.question.id? props.question.id: 0 : 0;
    const questionStr= ref(props.question ? props.question.question ? props.question.question : "" : "");
    const hintStr= ref(props.question ? props.question.hint ? props.question.hint : "" : "");

    const questionError = ref("");
    const hintError = ref("");

    const onValidationFail = (json) => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "question"){
                questionError.value = error.error;
            }else if(field == "hint"){
                hintError.value = error.error;
            }
        });
    }

    const push = async () => {
        const data = JSON.stringify({
            question: questionStr.value,
            hint: hintStr.value,
        });

        const postUrl = `/questions/${id}/`;
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
            <CFormLabel for="question">Pertanyaan</CFormLabel>
            <CFormInput :class="questionError ? 'border-danger' : ''" v-model="questionStr" type="text" id="question" placeholder="Pertanyaan tentang performa karyawan"/>
            <div class="text-end text-danger" v-if="questionError">
                <small>{{ questionError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="hint">Hint</CFormLabel>
            <CFormInput :class="hintError ? 'border-danger' : ''" v-model="hintStr" type="text" id="hint" placeholder="Penjelasan maksud dari pertanyaan"/>
            <div class="text-end text-danger" v-if="hintError">
                <small>{{ hintError }}</small>
            </div>
        </div>
    </CForm>
</template>