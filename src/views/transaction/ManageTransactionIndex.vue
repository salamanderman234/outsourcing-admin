<script setup>
    import apiConfig from '@/api/apiConfig';
    import avatar from '@/assets/images/avatars/8.jpg'
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilMoney, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import TransactionDetailForm from "@/views/transaction/forms/TransactionDetailForm.vue";
    import TransactionCreatePlacementForm from "@/views/transaction/forms/TransactionCreatePlacementForm.vue";
    import TransactionSetStatusForm from "@/views/transaction/forms/TransactionSetStatusForm.vue";
    import TransactionPaymentHistoryForm from "@/views/transaction/forms/TransactionPaymentHistoryForm.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;
    const resourceUrl = "/transactions/";
    const columns = ["ID"];
    const fields = ["id"];

    const detailForm = ref(null);
    const setStatusForm = ref(null);
    const placementForm = ref(null);
    const setStatusModal = ref(null);
    const showDetailModal = ref(false);
    const placementModal = ref(false);
    const showPaymentModal = ref(false);
    const showSetStatusModal = ref(false);
    const showPlacementModal = ref(false);
    const detailData = ref({});

    const layout = ref(null);
    const statusMap = {
        waiting_for_confirmation: {
            text:"Menunggu Konfirmasi",
            color:"warning"
        },
        waiting_for_mou: {
            text:"Menunggu MOU",
            color: "warning"
        },
        waiting_for_mou_confirmation: {
            text:"Menunggu Konfirmasi MOU",
            color: "warning"
        },
        waiting_for_placement: {
            text:"Menunggu Penempatan",
            color: "warning"
        },
        waiting_for_initial_payment: {
            text:"Menunggu Pembayaran Awal",
            color:"info"
        },
        waiting_for_further_payments: {
            text:"Menunggu Pembayaran Lanjutan",
            color:"info"
        },
        ongoing: {
            text: "Sedang Berjalan",
            color: "primary"
        },
        suspended: {
            text:"Suspend",
            color:"danger"
        },
        done: {
            text:"Selesai",
            color:"success"
        },
    }
    const statusAray = [];
    for(const key in statusMap){
        statusAray.push({
            label: statusMap[key].text,
            value: key,
        });
    }

    const confirmTransaction = async (id) => {
        const postUrl = `/transactions/${id}/confirm/`
        const resp = await fetcher.fetch(postUrl, "PATCH", false);
        const json = await resp.json();

        if(resp.status == 200){
            layout.value.refresh()
        }
        const content = resp.status == 200 ? `Transaksi #${id} berhasil dikonfirmasi !` : json.detail;
        const toastData = {
            "title": json.message,
            "content": content,
            "status": resp.status,
        }
        layout.value.toast(toastData)
    }
    const askForMOU = async (id) => {
        const postUrl = `/transactions/${id}/ask_mou/`
        const resp = await fetcher.fetch(postUrl, "PATCH", false);
        const json = await resp.json();

        if(resp.status == 200){
            layout.value.refresh()
        }
        const content = resp.status == 200 ? `Berhasil mengirim permintaan MOU pada transaksi #${id} !` : json.detail;
        const toastData = {
            "title": json.message,
            "content": content,
            "status": resp.status,
        }
        layout.value.toast(toastData)
    }
    watchEffect(() => {
        if(id && layout.value) {
            const datas = layout.value.exposeDatas();
            if(datas){
                const filtered = datas.filter((e) => {
                    return e.id == id;
                })
                if(filtered.length == 1){
                    showDetailModal.value = true;
                    detailData.value = filtered[0];
                }
            }
        }
    });
</script>

<template>
    <CRUDLayout
        title="Manajemen Transaksi  "
        :resource_url="resourceUrl"
        :columns="columns"
        :fields="fields"
        :disable_search="true"
        :disable_numbering="true"
        ref="layout"
    >
        <template #modal-list>
            <DefaultModal
                :show="showDetailModal"
                :title="`Detail Transaksi #${detailData.id}`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <TransactionDetailForm
                    ref="detailForm" 
                    :data="detailData"
                    @toast="(data) => layout.toast(data)" 
                    @refresh="() => layout.refresh()"
                    @toggle="(val) => showDetailModal = val"
                    @onLoad="() => (val) => false"
                />
            </DefaultModal>
            <DefaultModal
                :show="showPaymentModal"
                :title="`Histori Pembayaran Transaksi #${detailData.id}`"
                @toggle="(val) => showPaymentModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <TransactionPaymentHistoryForm 
                    :history="detailData.payments"
                />
            </DefaultModal>
            <DefaultModal
                ref="setStatusModal"
                :show="showSetStatusModal"
                :title="`Ubah Status Transaksi #${detailData.id}`"
                @toggle="(val) => showSetStatusModal = val"
                @submit="() => setStatusForm.push()"
            >
                <TransactionSetStatusForm
                    ref="setStatusForm"
                    :id="detailData.id"
                    @toast="(data) => layout.toast(data)" 
                    @refresh="() => layout.refresh()"
                    @toggle="(val) => showSetStatusModal = val"
                    @onLoad="() => (val) => setStatusModal.setLoad(val)"
                />
            </DefaultModal>
            <DefaultModal
                ref="placementModal"
                :show="showPlacementModal"
                :title="`Buat Penempatan pada Transaksi #${detailData.id}`"
                @toggle="(val) => showPlacementModal = val"
                @submit="() => placementForm.push()"
            >
                <TransactionCreatePlacementForm
                    ref="placementForm"
                    :data="detailData"
                    @toast="(data) => layout.toast(data)" 
                    @refresh="() => layout.refresh()"
                    @toggle="(val) => showPlacementModal = val"
                    @onLoad="() => (val) => placementModal.setLoad(val)"
                />
            </DefaultModal>
        </template>

        <template #button-list>
            <div>
                <CFormSelect
                    @change="(e) => layout.setQueries('query', e.target.value)"
                    :options="[
                        { label: 'Semua Status', value: '' },
                        ...statusAray
                    ]"
                >
                </CFormSelect>
            </div>
        </template>   

        <template #additional-columns>
            <CTableHeaderCell class="text-center" scope="col">Tanggal</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Total Harga</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Pengguna Jasa</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Metode</CTableHeaderCell>
            <CTableHeaderCell class="text-center" scope="col">Status</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center"
            >
                {{ new Date(data.order_date).toISOString().slice(0, 10) }}
            </CTableDataCell>
            <CTableDataCell 
                class="text-center"
            >
                {{ data.total_price }}
            </CTableDataCell>
            <CTableDataCell 
                class="text-center align-middle"
            >
                <template v-if="data.service_user">
                    <CTooltip 
                        :content="data.service_user.fullname" 
                        placement="bottom"
                    >
                        <template #toggler="{ id, on }">
                            <CAvatar 
                                :aria-describedby="id" 
                                v-on="on"
                                :src="data.service_user.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.service_user.user.id}/profile/` : avatar" 
                                size="md" 
                                v-if="data.service_user" 
                            />
                        </template>
                    </CTooltip>
                    <a class="ms-2" :href="`/#/service_users?id=${data.service_user.id}`" v-if="data.service_user">#{{ data.service_user.id }}</a>
                </template>
                <span v-if="!data.service_user">-</span>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center"
            >
                <CBadge :color="data.payment_method == 'dp' ? 'info' : data.payment_method == '3_termin' ? 'success' : 'primary'">
                    {{ data.payment_method == "dp" ? "DP" : data.payment_method == "3_termin" ? "Termin" : "Full" }}
                </CBadge>
            </CTableDataCell>
            <CTableDataCell 
                class="text-center"
            >
                <CBadge :color="statusMap[data.status] ? statusMap[data.status].color : 'dark'">
                    {{ statusMap[data.status] ? statusMap[data.status].text : data.status }}
                </CBadge>
            </CTableDataCell>
        </template>   

        <template #action-list="{data}">
            <CDropdownItem 
                @click="() => {
                    showDetailModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilInfo" class="me-2" />
                Detail
            </CDropdownItem>
            <CDropdownItem 
                @click="() => confirmTransaction(data.id)"
               v-if="data.status == 'waiting_for_confirmation' || data.status == 'waiting_for_mou_confirmation'"
            >
                <CIcon :icon="cilCheckAlt" class="me-2" />
                Konfirmasi
            </CDropdownItem>
            <CDropdownItem 
                @click="() => askForMOU(data.id)"
               v-if="data.status == 'waiting_for_confirmation' || data.status == 'waiting_for_mou_confirmation'"
            >
                <CIcon :icon="cilPaperPlane" class="me-2" />
                Permintaan MOU
            </CDropdownItem>
            <CDropdownItem
                @click="() => {
                    showSetStatusModal = true;
                    detailData = data;
                }"
                v-if="data.status == 'suspended' || data.status == 'ongoing' || data.status == 'done'" 
            >
                <CIcon :icon="cilPencil" class="me-2" />
                Ubah Status
            </CDropdownItem>
            <CDropdownItem
                @click="() => {
                    showPaymentModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilMoney" class="me-2" />
                Histori Pembayaran
            </CDropdownItem>
            <CDropdownItem
                @click="() => {
                    showPlacementModal = true;
                    detailData = data;
                }"
                v-if="data.status == 'waiting_for_placement'"
            >
                <CIcon :icon="cilTask" class="me-2" />
                Buat Penempatan
            </CDropdownItem>
            <CDropdownItem
                :href="`/#/placements?id=${data.placements.length > 0 ? data.placements[0].id : ''}`"
                v-if="data.placements.length > 0" 
            >
                <CIcon :icon="cilGroup" class="me-2" />
                Lihat Penempatan
            </CDropdownItem>
        </template>   
    </CRUDLayout>
</template>