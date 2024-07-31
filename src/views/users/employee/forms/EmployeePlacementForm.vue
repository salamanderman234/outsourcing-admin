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
                <span>ID Supervisor</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.supervisor_profile.id" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Penempatan Aktif</span>
        </small>
        <hr />
        <CAccordion class="mb-3">
            <CAccordionItem :item-key="detail.id" v-for="detail in data.supervisor_profile.placements.filter((e) => e.status == 'ongoing')">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between w-100 px-2">
                        <span>
                            <span>
                                {{ detail.address ? detail.name : '-' }}
                                <a :href="`/#/placements?id=${detail.id}`">#{{ detail.id }}</a>
                            </span>
                            <small class="d-block text-secondary">
                                {{ detail.address ? detail.address : "" }}
                            </small>
                        </span>
                        <div class="d-flex align-items-center">
                            <CBadge 
                                class="ms-2" 
                                :color="detail.status == 'ongoing' ? 'primary' : detail.status == 'suspend' ? 'warning' : 'success'"
                            >
                                {{ detail.status == 'ongoing' ? 'Sedang Berjalan' : detail.status == 'suspend' ? 'Suspend' : 'Selesai' }}
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
                            :value="`#${detail.id}`" 
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
                            :value="`${detail.name}`" 
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
                            :value="`${detail.name}`" 
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
                            :value="`${new Date(detail.start_date).toISOString().slice(0,10)}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary mb-3" v-if="data.supervisor_profile.placements.filter((e) => e.status == 'ongoing').length <= 0">
            Data tidak ditemukan
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Penempatan Tidak Aktif</span>
        </small>
        <hr />
        <CAccordion class="mb-3">
            <CAccordionItem :item-key="detail.id" v-for="detail in data.supervisor_profile.placements.filter((e) => e.status != 'ongoing')">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between w-100 px-2">
                        <span>
                            <span>
                                {{ detail.address ? detail.name : '-' }}
                                <a :href="`/#/placements?id=${detail.id}`">#{{ detail.id }}</a>
                            </span>
                            <small class="d-block text-secondary">
                                {{ detail.address ? detail.address : "" }}
                            </small>
                        </span>
                        <div class="d-flex align-items-center">
                            <CBadge 
                                class="ms-2" 
                                :color="detail.status == 'ongoing' ? 'primary' : detail.status == 'suspend' ? 'warning' : 'success'"
                            >
                                {{ detail.status == 'ongoing' ? 'Sedang Berjalan' : detail.status == 'suspend' ? 'Suspend' : 'Selesai' }}
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
                            :value="`#${detail.id}`" 
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
                            :value="`${detail.name}`" 
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
                            :value="`${detail.name}`" 
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
                            :value="`${new Date(detail.start_date).toISOString().slice(0,10)}`" 
                            type="text" 
                            disabled
                        />
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary mb-3" v-if="data.supervisor_profile.placements.filter((e) => e.status != 'ongoing').length <= 0">
            Data tidak ditemukan
        </div>
    </CForm>
</template>