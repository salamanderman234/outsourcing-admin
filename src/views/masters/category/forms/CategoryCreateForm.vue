<script setup>
    import {ref} from "vue"
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const category = ref("");
    let icon = "";
    const description = ref("");

    const categoryError = ref("");
    const descriptionError = ref("");

    const onValidationFail = (json) => {
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "category_name"){
                categoryError.value = error.error;
            }else if(field == "description"){
                descriptionError.value = error.error;
            }
        });
    };

    const push = async () => {
        const rawData = {
            category_name: category.value,
            description: description.value,
        }
        if(icon){
            rawData.icon = icon;
        }
        const data = JSON.stringify(rawData);
        const postUrl = `/categories/`;
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

    const uploadFile = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            icon = reader.result;
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
            <CFormInput :class="categoryError ? 'border-danger' : ''" v-model="category" type="text" id="category_name" placeholder="Nama Kategori"/>
            <div class="text-end text-danger" v-if="categoryError">
                <small>{{ categoryError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="icon">Icon</CFormLabel>
            <CFormInput @change="uploadFile" accept="image/*" type="file" id="icon" placeholder="Icon kategori"/>
        </div>
        <div class="mb-3">
            <CFormLabel for="description">Deskripsi</CFormLabel>
            <CFormTextarea :class="descriptionError ? 'border-danger' : ''" v-model="description" id="description" rows="3" placeholder="Deskripsi"></CFormTextarea>
            <div class="text-end text-danger" v-if="descriptionError">
                <small>{{ descriptionError }}</small>
            </div>
        </div>
    </CForm>
</template>