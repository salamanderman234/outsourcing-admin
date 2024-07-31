<script setup>
    import {ref, watchEffect} from "vue";
    import { cilX } from '@coreui/icons';
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(["setShow", "toast"]);
    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
            default: false,
        },
        category: {
            type: Object,
            required: true,
        }
    });

    const questions = ref([]);
    const checkedQuestions = ref([]);

    const fetchQuestions = async () => {
        const getUrl = "/questions/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            questions.value = json.datas;
        }
    }

    const fetchCheckedQuestions = async () => {
        const getUrl = `/questions/?category_id=${props.category.id}`;
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            checkedQuestions.value = json.datas;
        }else {
            checkedQuestions.value = [];
        }
    }

    fetchQuestions();

    watchEffect(() => {
        fetchCheckedQuestions();
    });

    const setShow = (val) => emits("setShow", val);
    const questionChangeHandler = async (e) => {
        const val = e.target.value;
        const body = JSON.stringify({
            category_id: props.category.id,
            question_id: parseInt(val),
        })
        let postUrl = `/questions/assign/`;
        let resp = {};
        if(e.target.checked){
            resp = await fetcher.fetch(postUrl, "POST", body);
        }else {
            postUrl = `/questions/unassign/`;
            resp = await fetcher.fetch(postUrl, "PATCH", body);
        }

        const json = await resp.json();
        const content = resp.status == 200 ? 
            `Berhasil unset pertanyaan dengan id ${val} dengan kategori ${props.category.category_name}` :
            resp.status == 201 ?
            `Berhasil set pertanyaan dengan id ${val} dengan kategori ${props.category.category_name}`:
            "Gagal set pertanyaan";

        emits("toast", {
            "status": resp.status,
            "title": json.message,
            "content": content,
        });
        fetchCheckedQuestions();
    }
</script>

<template>
    <CModal
        scrollable
        :visible="show"
        @close="() => setShow(false)"
        aria-labelledby="Question Modal"
    >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel3">
                Pertanyaan Performa
                ({{ category.category_name }}#{{ category.id }})
            </CModalTitle>
        </CModalHeader>
        <CModalBody>    
            <CFormCheck 
                v-for="question in questions"
                :id="`question-${question.id}`" 
                :value="`${question.id}`" 
                :label="question.question" 
                :checked="checkedQuestions.filter((q) => q.id == question.id).length > 0"
                @change="questionChangeHandler"
            />

        </CModalBody>
        <CModalFooter>
            <CButton color="danger" @click="() => setShow(false)">
                <CIcon :icon="cilX" class="me-2" />
                Batal
            </CButton>
        </CModalFooter>
    </CModal>
</template>