<script setup>
    import {ref} from 'vue';
    import fetcher from '@/api/fetcher';
    import apiConfig from '@/api/apiConfig';

    const baseUrl = apiConfig.baseUrl;

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const props = defineProps({
        category: {
            type: Object,
            required: true,
        },
    });emailError
    
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

</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="category_name">Nama Kategori</CFormLabel>
            <CFormInput v-model="categoryName" type="text" id="category_name" placeholder="Nama Kategori"/>
            <div class="text-end text-danger" v-if="categoryError">
                <small>{{ categoryError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="icon" class="d-flex justify-content-between">
                <span>Ikon</span>
                <a :href="`${baseUrl}/resource/categories/${id}/icon/`" target="_blank" v-if="icon">Lihat Ikon</a>
            </CFormLabel>
            <CFormInput @change="uploadFile" accept="image/*" type="file" id="icon" placeholder="Icon kategori"/>
            <div class="text-end text-danger" v-if="iconError">
                <small>{{ iconError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="description">Deskripsi</CFormLabel>
            <CFormTextarea v-model="description" id="description" rows="3" placeholder="Deskripsi"></CFormTextarea>
            <div class="text-end text-danger" v-if="descriptionError">
                <small>{{ descriptionError }}</small>
            </div>
        </div>
    </CForm>
</template>