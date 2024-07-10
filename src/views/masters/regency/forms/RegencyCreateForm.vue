<script setup>
    import {ref} from "vue"
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);
    const regency = ref("");
    const provinceID = ref(0);
    const provinces = ref([]);

    const regencyError = ref("");
    const provinceError = ref("");

    const onValidationFail = (json) => {
        console.log(json);
        const errors = json.errors;
        errors.forEach((error, index) => {
            const field = error.field;
            if(field == "regency"){
                regencyError.value = error.error;
            }else if(field == "province_id"){
                provinceError.value = error.error;
            }
        });
    };

    const push = async () => {
        const rawData = {
            regency: regency.value,
            province_id: parseInt(provinceID.value),
        }
        const data = JSON.stringify(rawData);
        const postUrl = `/regencies/`;
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
        const content = resp.status == 201 ? "Data berhasil dibuat !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    const getProvinces = async () => {
        const getUrl = "/provinces/"
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200 && json.datas){
            const datas = json.datas;
            provinces.value = datas;
        }
    }

    getProvinces();

    defineExpose({
        push,
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="province">Provinsi</CFormLabel>
            <CFormSelect
                aria-label="Pilih Provinsi"
                @change="(e) => provinceID = e.target.value"
            >
                <option>Pilih Provinsi</option>
                <option :value="province.id" v-for="province in provinces" :key="province.id">
                    {{ province.province }}
                </option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="provinceError">
                <small>{{ provinceError }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="regency">Daerah</CFormLabel>
            <CFormInput :class="regencyError ? 'border-danger' : ''" v-model="regency" type="text" id="regency" placeholder="Nama Daerah"/>
            <div class="text-end text-danger" v-if="regencyError">
                <small>{{ regencyError }}</small>
            </div>
        </div>
    </CForm>
</template>