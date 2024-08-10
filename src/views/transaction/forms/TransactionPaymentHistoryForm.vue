<script setup>
    const props = defineProps({
        history: {
            type: Array,
            required: true,
            default: [],
        }
    });
</script>

<template>
    <CAccordion>
        <CAccordionItem :item-key="payment.id" v-for="payment in history">
            <CAccordionHeader >
                <div class="d-flex justify-content-between w-100 px-2">
                    <span>
                        <span>{{ new Date(payment.created_at).toISOString().slice(0,10) }}</span>
                        
                        <small class="d-block text-secondary">
                            {{ payment.billing_name }}
                        </small>
                        <small class="d-block text-secondary">
                            {{ payment.billing_address }}
                        </small>
                    </span>
                    <div>
                        <span>
                            Rp. {{ Intl.NumberFormat('id-ID').format(payment.total_amount) }}
                        </span>
                        <CBadge class="d-block mt-1" :color="payment.status == 'pending' ? 'warning' : payment.status == 'failed' ? 'danger' : 'success'">
                            {{ payment.status == 'pending' ? 'Tertunda' : payment.status == 'failed' ? 'Gagal' : 'Berhasil' }}
                        </CBadge>
                    </div>
                </div>
            </CAccordionHeader>
            <CAccordionBody>
                <div class="mb-3">
                    <CFormLabel>Nama Billing</CFormLabel>
                    <CFormInput 
                        type="text"
                        disabled
                        :value="payment.billing_name"
                    />
                </div>
                <div class="mb-3">
                    <CFormLabel>Alamat Billing</CFormLabel>
                    <CFormInput 
                        type="text"
                        disabled
                        :value="payment.billing_address"
                    />
                </div>
                <div class="mb-3">
                    <CFormLabel>Kontak</CFormLabel>
                    <CFormInput 
                        type="text"
                        disabled
                        :value="payment.billing_contact"
                    />
                </div>
                <div class="mb-3">
                    <CFormLabel>Tanggal Dibayar</CFormLabel>
                    <CFormInput 
                        type="date"
                        disabled
                        :value="new Date(payment.updated_at).toISOString().slice(0,10)"
                    />
                </div>
            </CAccordionBody>
        </CAccordionItem>
    </CAccordion>
    <div class="text-center text-secondary" v-if="history.length <= 0">
        Tidak ada histori pembayaran
    </div>
</template>