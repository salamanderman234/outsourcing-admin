<script setup>
    import {ref, watchEffect} from 'vue';
    import fetcher from '@/api/fetcher';
    import apiConfig from '@/api/apiConfig';

    const baseUrl = apiConfig.baseUrl;

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const props = defineProps({
        category: {
            type: Object,
            required: true,
        },
    });
    
    const id = props.category ? props.category.id? props.category.id: 0 : 0;
    const categoryName = ref(props.category ? props.category.category_name ? props.category.category_name : "" : "");
    const icon = ref(props.category ? props.category.icon ? props.category.icon : "": "");
    const description = ref(props.category ? props.category.description ? props.category.description : "": "");

    const categoryError = ref("");
    const descriptionError = ref("");
    const iconError = ref("");

    const onValidationFail = (json) => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "category"){
                categoryError.value = error.error;
            }else if(field == "description"){
                descriptionError.value = error.error;
            }else if(field == "icon"){
                iconError.value = error.error;
            }
        });
    }

    let iconFile = "";

    const push = async () => {
        const data = JSON.stringify({
            category_name: categoryName.value,
            description: description.value
        });
        if(iconFile) {
            data.icon = iconFile;
        }
        const postUrl = `/categories/${id}/`;
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

    const uploadFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            iconFile = reader.result;
        };
    }

    defineExpose({
        push,
    });

    const checkedQuestions = ref([]);
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

    watchEffect(() => {
        fetchCheckedQuestions();
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Kategori</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="category_name">ID</CFormLabel>
            <CFormInput :value="'#'+category.id" disabled type="text" id="category_name" placeholder="Nama Kategori"/>
        </div>
        <div class="mb-3">
            <CFormLabel for="category_name">Nama Kategori</CFormLabel>
            <CFormInput disabled v-model="categoryName" type="text" id="category_name" placeholder="Nama Kategori"/>
            <div class="text-end text-danger" v-if="categoryError">
                <small>{{ categoryError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="icon" class="d-flex justify-content-between">
                <span>Ikon</span>
                <a :href="`${baseUrl}/resource/categories/${id}/icon/`" target="_blank" v-if="icon">Lihat Ikon</a>
            </CFormLabel>
            <CFormInput disabled @change="uploadFile" accept="image/*" type="file" id="icon" placeholder="Icon kategori"/>
            <div class="text-end text-danger" v-if="iconError">
                <small>{{ iconError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="description">Deskripsi</CFormLabel>
            <CFormTextarea disabled v-model="description" id="description" rows="3" placeholder="Deskripsi"></CFormTextarea>
            <div class="text-end text-danger" v-if="descriptionError">
                <small>{{ descriptionError }}</small>
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>List Pertanyaan Performa</span>
        </small>
        <hr />
        <CInputGroup  v-for="question in checkedQuestions" class="mb-3">
            <CInputGroupText id="basic-addon1">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-question-lg" viewBox="0 0 16 16">
                    <path fill-rule="evenodd" d="M4.475 5.458c-.284 0-.514-.237-.47-.517C4.28 3.24 5.576 2 7.825 2c2.25 0 3.767 1.36 3.767 3.215 0 1.344-.665 2.288-1.79 2.973-1.1.659-1.414 1.118-1.414 2.01v.03a.5.5 0 0 1-.5.5h-.77a.5.5 0 0 1-.5-.495l-.003-.2c-.043-1.221.477-2.001 1.645-2.712 1.03-.632 1.397-1.135 1.397-2.028 0-.979-.758-1.698-1.926-1.698-1.009 0-1.71.529-1.938 1.402-.066.254-.278.461-.54.461h-.777ZM7.496 14c.622 0 1.095-.474 1.095-1.09 0-.618-.473-1.092-1.095-1.092-.606 0-1.087.474-1.087 1.091S6.89 14 7.496 14"/>
                </svg>
            </CInputGroupText>
            <CFormInput 
                disabled 
                type="text"
                :value="question.question"
            />
        </CInputGroup>
        <div class="text-center text-secondary">Tidak ada pertanyaan yang diset</div>
    </CForm>
</template>