<script setup>
    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
</script>

<template>
    <CForm class="px-4 py-4">
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Karyawan</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.employee_profile.id" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Penempatan Aktif</span>
        </small>
        <hr />
        <CAccordion class="mb-3">
            <CAccordionItem :item-key="detail.placement.placement.id" v-for="detail in data.employee_profile.placements.filter((e) => e.placement.placement.status == 'ongoing')">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between w-100 px-2">
                        <span>
                            <span>
                                {{ detail.placement.placement.address ? detail.placement.placement.name : '-' }}
                                <a :href="`/#/placements?id=${detail.placement.placement.id}`">#{{ detail.placement.placement.id }}</a>
                            </span>
                            <small class="d-block text-secondary">
                                {{ detail.placement.placement.address ? detail.placement.placement.address : "" }}
                            </small>
                        </span>
                        <div class="d-flex align-items-center">
                            <CBadge 
                                class="ms-2" 
                                :color="detail.placement.placement.status == 'ongoing' ? 'primary' : detail.placement.placement.status == 'suspend' ? 'warning' : 'success'"
                            >
                                {{ detail.placement.placement.status == 'ongoing' ? 'Sedang Berjalan' : detail.placement.placement.status == 'suspend' ? 'Suspend' : 'Selesai' }}
                            </CBadge>
                        </div>
                    </div>
                </CAccordionHeader>
                <CAccordionBody>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>ID Penempatan</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`#${detail.placement.placement.id}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>Nama</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`${detail.placement.placement.name}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>Alamat Lengkap</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`${detail.placement.placement.name}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>Tanggal Mulai</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`${new Date(detail.placement.placement.start_date).toISOString().slice(0,10)}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary mb-3" v-if="data.employee_profile.placements.filter((e) => e.placement.placement.status == 'ongoing').length <= 0">
            Data tidak ditemukan
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Penempatan Tidak Aktif</span>
        </small>
        <hr />
        <CAccordion class="mb-3">
            <CAccordionItem :item-key="detail.placement.placement.id" v-for="detail in data.employee_profile.placements.filter((e) => e.placement.placement.status != 'ongoing')">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between w-100 px-2">
                        <span>
                            <span>
                                {{ detail.placement.placement.address ? detail.placement.placement.name : '-' }}
                                <a :href="`/#/placements?id=${detail.placement.placement.id}`">#{{ detail.placement.placement.id }}</a>
                            </span>
                            <small class="d-block text-secondary">
                                {{ detail.placement.placement.address ? detail.placement.placement.address : "" }}
                            </small>
                        </span>
                        <div class="d-flex align-items-center">
                            <CBadge 
                                class="ms-2" 
                                :color="detail.placement.placement.status == 'ongoing' ? 'primary' : detail.placement.placement.status == 'suspend' ? 'warning' : 'success'"
                            >
                                {{ detail.placement.placement.status == 'ongoing' ? 'Sedang Berjalan' : detail.placement.placement.status == 'suspend' ? 'Suspend' : 'Selesai' }}
                            </CBadge>
                        </div>
                    </div>
                </CAccordionHeader>
                <CAccordionBody>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>ID Penempatan</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`#${detail.placement.placement.id}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>Nama</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`${detail.placement.placement.name}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>Alamat Lengkap</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`${detail.placement.placement.name}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                    <div class="mb-3">
                        <CFormLabel for="service_user" class="d-flex justify-content-between">
                            <span>Tanggal Mulai</span>
                        </CFormLabel>
                        <CFormInput 
                            class=""
                            :value="`${new Date(detail.placement.placement.start_date).toISOString().slice(0,10)}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary mb-3" v-if="data.employee_profile.placements.filter((e) => e.placement.placement.status != 'ongoing').length <= 0">
            Data tidak ditemukan
        </div>
    </CForm>
</template>