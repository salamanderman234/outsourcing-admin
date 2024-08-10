<script setup>
    import { ref, onMounted } from 'vue';
    import PaymentDPForm from './forms/PaymentDPForm.vue';
    import PaymentTerminForm from './forms/PaymentTerminForm.vue';
    import fetcher from '@/api/fetcher';

    const emits = defineEmits(["toast"]);

    const datas = ref({
        dp: 20,
        first_termin: 20,
        second_termin: 80,
    });

    const fetch = async () => {
        const postUrl = `/payment_config/`;
        const resp = await fetcher.fetch(postUrl, "GET", false);
        const json = await resp.json();
        if(resp.status == 200){
            const d = json.datas;
            const dp = d.filter((data) => data.type == "dp" && data.sub_type == "dp_first");
            if(dp.length == 1){
                datas.value.dp = dp[0].amount;
            }
            const firstT = d.filter((data) => data.type == "3_termin" && data.sub_type == "termin_first");
            if(firstT.length == 1){
                datas.value.first_termin = firstT[0].amount;
            }
            const secondT = d.filter((data) => data.type == "3_termin" && data.sub_type == "termin_second");
            if(secondT.length == 1){
                datas.value.second_termin = secondT[0].amount;
            }
        }
    }
    onMounted(() => {
        fetch();
    });
</script>

<template>
    <PaymentDPForm 
        @toast="(val) => emits('toast', val)"
        :data="datas.dp" 
    />
    <PaymentTerminForm 
        :firstTermin="datas.first_termin"
        :secondTermin="datas.second_termin" 
        @toast="(val) => emits('toast', val)"
    />
</template>