<script setup>
    import { ref } from 'vue';
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(["toast"]);

    const datas = ref({
        first: 20,
        second: 50,
    });
    const onLoadFirst = ref(false);
    const onLoadSecond = ref(false);
    const errors = ref({
        first: "",
        second: "",
    });
    const firstTerminSubmitHandler = async () => {
        resetFirstError();
        datas.value.first = parseInt(datas.value.first) || 0;
        const rawData = JSON.stringify({
            amount: datas.value.first,
        });
        const postUrl = `/payment_config/set_3_termin_first_percentage/`;
        onLoadFirst.value = true;
        const resp = await fetcher.fetch(postUrl, "PATCH", rawData);
        onLoadFirst.value = false;
        const json = await resp.json();
        console.log(json)
        if(resp.status == 400 && json.errors) {
            onFirstValidationFail(json);
        }
        const content = resp.status == 200 ? "Data persenan termin pertama berhasil diubah !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
    const secondTerminSubmitHandler = async () => {
        resetSecondError();
        datas.value.second = parseInt(datas.value.second) || 0;
        const rawData = JSON.stringify({
            amount: datas.value.second,
        });
        const postUrl = `/payment_config/set_3_termin_second_percentage/`;
        onLoadSecond.value = true;
        const resp = await fetcher.fetch(postUrl, "PATCH", rawData);
        onLoadSecond.value = false;
        const json = await resp.json();
        console.log(json)
        if(resp.status == 400 && json.errors) {
            onSecondValidationFail(json);
        }
        const content = resp.status == 200 ? "Data persenan termin kedua berhasil diubah !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
    const onFirstValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            error.value.first = error.error;
        });
    };
    const onSecondValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            error.value.second = error.error;
        });
    };

    const resetFirstError = () => {
        errors.value.first = "";
    }
    const resetSecondError = () => {
        errors.value.second = "";
    }

    const fetch = async () => {
        const postUrl = `/payment_config/`;
        const resp = await fetcher.fetch(postUrl, "GET", false);
        const json = await resp.json();
        if(resp.status == 200){
            const d = json.datas;
            const firstT = d.filter((data) => data.type == "3_termin" && data.sub_type == "termin_first");
            if(firstT.length == 1){
                datas.value.first = firstT[0].amount;
            }
            const secondT = d.filter((data) => data.type == "3_termin" && data.sub_type == "termin_second");
            if(secondT.length == 1){
                datas.value.second = secondT[0].amount;
            }
        }
    }
    fetch();
</script>

<template>
    <div>
        <div class="mb-3">
            <CFormLabel for="description">Persenan Termin Pertama</CFormLabel>
            <div class="d-flex">
                <CInputGroup class="me-3">
                    <CFormInput v-model="datas.first" aria-label="Jumlah maksimal adalah 100%"/>
                    <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
                <CButton color="primary" :disabled="onLoadFirst" @click="() => firstTerminSubmitHandler()">
                    Simpan
                </CButton>
            </div>
            <div class="text-end text-danger" v-if="errors.first">
                <small>{{ errors.first }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="description">Persenan Termin Kedua</CFormLabel>
            <div class="d-flex">
                <CInputGroup class="me-3">
                    <CFormInput v-model="datas.second" aria-label="Jumlah maksimal adalah 100%"/>
                    <CInputGroupText>%</CInputGroupText>
                </CInputGroup>
                <CButton color="primary" :disabled="onLoadSecond" @click="() => secondTerminSubmitHandler()">
                    Simpan
                </CButton>
            </div>
            <div class="text-end text-danger" v-if="errors.second">
                <small>{{ errors.second }}</small>
            </div>
        </div>
    </div>
</template>