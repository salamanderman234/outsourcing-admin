<script setup>
    import { ref } from 'vue';
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(["toast"]);

    const dp = ref(20);
    const dpError = ref("");
    const onLoad = ref(false);
    const submitHandler = async () => {
        resetError();
        dp.value = parseInt(dp.value) || 0;
        const rawData = JSON.stringify({
            amount: dp.value,
        });
        const postUrl = `/payment_config/set_dp_percentage/`;
        onLoad.value = true;
        const resp = await fetcher.fetch(postUrl, "PATCH", rawData);
        onLoad.value = false;
        const json = await resp.json();
        console.log(json)
        if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 200 ? "Data persenan dp berhasil diubah !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    const onValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            dpError.value = error.error;
        });
    };

    const resetError = () => {
        dpError.value = "";
    }

    const fetch = async () => {
        const postUrl = `/payment_config/`;
        const resp = await fetcher.fetch(postUrl, "GET", false);
        const json = await resp.json();
        if(resp.status == 200){
            const d = json.datas;
            const val = d.filter((data) => data.type == "dp" && data.sub_type == "dp_first");
            if(val.length == 1){
                dp.value = val[0].amount;
            }
            // const firstT = d.filter((data) => data.type == "3_termin" && data.sub_type == "termin_first");
            // if(firstT.length == 1){
            //     datas.value.first_termin = firstT[0].amount;
            // }
            // const secondT = d.filter((data) => data.type == "3_termin" && data.sub_type == "termin_second");
            // if(secondT.length == 1){
            //     datas.value.second_termin = secondT[0].amount;
            // }
        }
    }
    fetch();
</script>

<template>
    <div class="mb-3">
        <CFormLabel for="description">Persenan DP</CFormLabel>
        <div class="d-flex">
            <CInputGroup class="me-3">
                <CFormInput v-model="dp" aria-label="Jumlah maksimal adalah 100%"/>
                <CInputGroupText>%</CInputGroupText>
            </CInputGroup>
            <CButton color="primary" :disabled="onLoad" @click="() => submitHandler()">
                Simpan
            </CButton>
        </div>
        <div class="text-end text-danger" v-if="dpError">
            <small>{{ dpError }}</small>
        </div>
    </div>
</template>