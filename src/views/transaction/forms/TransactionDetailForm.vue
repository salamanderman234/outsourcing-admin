<script setup>
    import {ref, watchEffect} from "vue"
    import { cilPlus, cilSave, cilSettings, cilTrash } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";

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

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const data = ref({
        id: props.data.id,
        "service_user" : props.data.service_user || {},
        "package" : props.data.package || false,
        "order_date" : props.data.order_date || "",
        "contract_duration" : props.data.contract_duration || "0",
        "start_date" : props.data.start_date || "",
        "regency" : props.data.regency || {},
        "address" : props.data.address || {},
        "company_name" : props.data.company_name || "",
        "billing_name" : props.data.billing_name || "",
        "billing_address" : props.data.billing_address || "",
        "payment_method": props.data.payment_method || "",
        "total_price": props.data.total_price || "0",
        "total_paid": props.data.total_paid || "0",
        "status": props.data.status || "",
        "dp_status": props.data.dp_status || "",
        "termin_status": props.data.termin_status || "",
        "next_payment_deadline": props.data.next_payment_deadline || "",
        "details": props.data.details || [],
        "mou": props.data.mou || "",
        placements: props.data.placements || [],
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Transaksi</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Transaksi</span>
                <a v-if="data.placements.length == 1" :href="`/#/placements?id=${data.placements[0].id}`">
                    Lihat Penempatan
                </a>
            </CFormLabel>
            <CFormInput 
                :value="'#'+data.id" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>MOU</span>
                <a target="_blank" :href="`${apiConfig.baseUrl}/resource/transactions/${data.id}/mou/`" v-if="data.mou">Lihat MOU</a>
            </CFormLabel>
            <CFormInput 
                :value="data.mou ? 'MOU Sudah Diupload' : 'MOU Belum Diupload'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Pengguna Jasa</span>
            </CFormLabel>
            <template v-if="data.service_user">
                <CAvatar 
                    :src="data.service_user.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.service_user.user.id}/profile/` : avatar" 
                    size="md" 
                    v-if="data.service_user" 
                />
                {{ data.service_user ? data.service_user.fullname : '-' }}
                <a :href="`/#/service_users?id=${data.service_user.id}`" v-if="data.service_user">#{{ data.service_user.id }}</a>
            </template>
            <small v-if="!data.service_user" class="text-secondary">Pengguna tidak ditemukan</small>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user">Kontak</CFormLabel>
            <CFormInput 
                :value="`${data.service_user.phone}`" 
                type="text" 
                id="service_user" 
                placeholder="Nama pemesan"
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user">Alamaat Lengkap</CFormLabel>
            <CFormInput 
                :value="`${data.service_user.full_address}`" 
                type="text" 
                id="service_user" 
                placeholder="Nama pemesan"
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Menggunakan Paket Layanan</CFormLabel>
            <CFormInput 
                :value="data.package ? 'YA' : 'TIDAK'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3" v-if="data.package">
            <CFormLabel for="package">Paket Layanan</CFormLabel>
            <CFormInput 
                :value="`${data.package.package_name}#${data.package.id}`" 
                type="text" 
                id="package" 
                placeholder="Paket"
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Tanggal Transaksi</CFormLabel>
            <CFormInput 
                :value="new Date(data.order_date).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Durasi Kontrak</CFormLabel>
            <CFormInput 
                :value="data.contract_duration" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Metode Pembayaran</CFormLabel>
            <CFormInput 
                :value="data.payment_method == 'dp' ? 'DP' : data.payment_method == '3_termin' ? 'Termin' : 'Full'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3" v-if="data.payment_method == 'dp'">
            <CFormLabel for="package">Status DP</CFormLabel>
            <CFormInput 
                :value="data.dp_status" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3" v-if="data.payment_method == '3_termin'">
            <CFormLabel for="package">Status Termin</CFormLabel>
            <CFormInput 
                :value="data.dp_status" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Status Transaksi</CFormLabel>
            <CFormInput 
                :value="statusMap[data.status] ? statusMap[data.status].text : data.status" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Pembayaran</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="package">Nama Billing</CFormLabel>
            <CFormInput 
                :value="data.billing_name" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Alamat Billing</CFormLabel>
            <CFormInput 
                :value="data.billing_address" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Total Transaksi</CFormLabel>
            <CFormInput 
                :value="data.total_price" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Total Terbayar</CFormLabel>
            <CFormInput 
                :value="data.total_paid" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package" v-if="data.next_payment_deadline">Tanggal Pembayaran Selanjutnya</CFormLabel>
            <CFormInput 
                :value="new Date(data.next_payment_deadline).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Penempatan</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="package" v-if="data.company_name">Nama Perusahaan</CFormLabel>
            <CFormInput 
                :value="data.company_name" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Daerah</CFormLabel>
            <CFormInput 
                :value="data.regency.regency" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Alamat Lengkap</CFormLabel>
            <CFormInput 
                :value="data.address" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="package">Tanggal Mulai</CFormLabel>
            <CFormInput 
                :value="new Date(data.start_date).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Detail</span>
        </small>
        <hr />
        <div class="mb-3">
            <div class="mb-3" v-for="(detail,index) in data.details">
                <CRow >
                    <CCol :xs="6" :md="7">
                        <CFormLabel for="category">Layanan #{{ index + 1  }}</CFormLabel>
                        <CFormInput 
                            :value="detail.service ? detail.service.service_name : '-'" 
                            type="text" 
                            disabled
                        />
                    </CCol>
                    <CCol :xs="6" :md="5">
                        <CFormLabel for="total_employee{{ index }}">Jumlah Karyawan</CFormLabel>
                        <CFormInput 
                            v-model="detail.total_employee" 
                            type="text" 
                            placeholder="Jumlah karyawan"
                            disabled
                        />
                    </CCol>
                    <CCol :xs="12" :md="12" class="mt-3">
                        <CAccordion>
                            <CAccordionItem :item-key="1">
                                <CAccordionHeader>
                                    <CIcon :icon="cilSettings" class="me-2"  />
                                    Item Tambahan
                                </CAccordionHeader>
                                <CAccordionBody>
                                    <div class="mb-3" v-for="(elem) in detail.etcs">
                                        <CRow>
                                            <CCol>
                                                <CFormLabel>Item</CFormLabel>
                                                <CFormInput 
                                                    type="text" 
                                                    :value="elem.additional_item_service ? elem.additional_item_service.item_name : '-'"
                                                    disabled
                                                />
                                            </CCol>
                                            <CCol>
                                                <CFormLabel>QTY</CFormLabel>
                                                <CFormInput 
                                                    type="text" 
                                                    disabled
                                                    v-model="elem.qty"
                                                />
                                            </CCol>
                                        </CRow>
                                    </div>
                                    <div v-if="!detail.etcs"class="text-center text-secondary">
                                        <small>Data Kosong</small>
                                    </div>
                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>
                    </CCol>
                    <CCol :xs="12" :md="12" class="mt-3">
                        <div class="mb-3">
                            <CFormLabel for="category">Harga Layanan</CFormLabel>
                            <CFormInput 
                                type="text" 
                                disabled
                                :value="'Rp. '+`${Intl.NumberFormat('id-ID').format(detail.service_price)}`"
                            />
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="category">Harga Gaji Karyawan</CFormLabel>
                            <CFormInput 
                                type="text" 
                                disabled
                                :value="'Rp. '+`${Intl.NumberFormat('id-ID').format(detail.employee_price)}`"
                            />
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="category">Harga Tambahan</CFormLabel>
                            <CFormInput 
                                type="text" 
                                disabled
                                :value="'Rp. '+`${Intl.NumberFormat('id-ID').format(detail.etc_price)}`"
                            />
                        </div>
                        <div class="mb-3">
                            <CFormLabel for="category">Sub Total</CFormLabel>
                            <CFormInput 
                                type="text" 
                                disabled
                                :value="'Rp. '+`${Intl.NumberFormat('id-ID').format(detail.sub_total_price)}`"
                            />
                        </div>
                    </CCol>
                </CRow>
                <hr />
            </div>
        </div>
    </CForm>
</template>