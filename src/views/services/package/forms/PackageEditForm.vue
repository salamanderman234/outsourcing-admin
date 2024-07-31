<script setup>
    import {ref, watchEffect} from "vue"
    import fetcher from '@/api/fetcher';
    import { cilSettings } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const data = ref({
        id: props.data.id,
        "package_name" : props.data.package_name || "",
        "description" : props.data.description || "",
        "includes" : props.data.includes || "",
        "min_contract" : props.data.min_contract || "0",
        "services" : props.data.services || [],
        "discount": props.data.discount || "0",
        "main_image": "",
        "total_price": props.data.total_price || "0",
    });
    const errors = ref({
        "package_name" : "",
        "description" : "",
        "includes" : "",
        "min_contract" : "",
        "services" : "",
        "discount": "",
        "main_image": ""
    });

    const onValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            const field = error.field;
            if(errors.value.hasOwnProperty(field)){
                errors.value[field] = error.error;
            }
        });
    };

    const push = async () => {
        resetError();
        dataParseInt();
        if(!data.value.main_image) {
            data.value.main_image = null;
        }
        const rawData = JSON.stringify(data.value);
        const postUrl = `/packages/${data.value.id}/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "PATCH", rawData);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 200 ? "Data paket berhasil diedit !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
    const resetError = () => {
        for(const key in errors.value){
            const error = errors.value[key];
            if(error){
                errors.value[key] = "";
            }
        }
    }

    const dataParseInt = () => {
        data.value.discount = parseInt(data.value.discount) || 0;
    }

    const uploadFile = (e, key) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const file = reader.result.split(",", 2);
            data.value[key] = file[1];
        };
    }

    defineExpose({
        push,
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <small class="fw-bold text-secondary text-uppercase">
            Data Paket
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="package_name">Nama Paket</CFormLabel>
            <CFormInput :class="errors.package_name ? 'border-danger' : ''" v-model="data.package_name" type="text" id="package_name" placeholder="Nama layanan parsial"/>
            <div class="text-end text-danger" v-if="errors.package_name">
                <small>{{ errors.package_name }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="description">Deskripsi</CFormLabel>
            <CFormTextarea 
                :class="errors.description ? 'border-danger' : ''" 
                v-model="data.description"
                id="description" 
                placeholder="Deskripsi layanan"
                rows="3"
            ></CFormTextarea>
            <div class="text-end text-danger" v-if="errors.description">
                <small>{{ errors.description }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="includes">Includes</CFormLabel>
            <CFormTextarea 
                :class="errors.includes ? 'border-danger' : ''" 
                v-model="data.includes"
                id="includes" 
                placeholder="Apa yang didapatkan kostumer"
                rows="3"
            ></CFormTextarea>
            <div class="text-end text-danger" v-if="errors.includes">
                <small>{{ errors.includes }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="min_contract">Minimal Kontrak</CFormLabel>
            <CFormInput 
                :class="errors.min_contract ? 'border-danger' : ''" 
                v-model="data.min_contract"
                id="min_contract" 
                placeholder="Minimal kontrak saat pemesanan"
                rows="3"
            ></CFormInput>
            <div class="text-end text-danger" v-if="errors.min_contract">
                <small>{{ errors.min_contract }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="main_image" class="d-flex justify-content-between">
                <span>Gambar Paket</span>
                <a target="_blank" :href="`${apiConfig.baseUrl}/resource/packages/${data.id}/main_image/`">Lihat Gambar</a>
            </CFormLabel>
            <CFormInput 
                :class="errors.main_image ? 'border-danger' : ''" 
                type="file" 
                id="main_image" 
                text="Ukuran maksimal file adalah 5 MB" 
                @change="(e) => uploadFile(e, 'main_image')" 
                accept="image/*"
            />
            <div class="text-end text-danger" v-if="errors.main_image">
                <small>{{ errors.main_image }}</small>
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            List Layanan
        </small>
        <hr />
        <div class="mb-3">
            <div class="mb-3" v-for="(service,index) in data.services">
                <CRow >
                    <CCol :xs="6" :md="7">
                        <CFormLabel for="category">
                            Layanan 
                            <a :href="`/#/services?id=${service.service_id}`">#{{ index + 1  }}</a>
                        </CFormLabel>
                        <CFormInput 
                            v-model="data.services[index].service.service_name" 
                            type="text" 
                            disabled
                        />
                    </CCol>
                    <CCol :xs="6" :md="5">
                        <CFormLabel for="total_employee{{ index }}">Jumlah Karyawan</CFormLabel>
                        <CFormInput 
                            v-model="data.services[index].total_employee" 
                            type="text" 
                            id="total_employee{{}}" 
                            placeholder="Jumlah karyawan"
                            disabled
                        />
                    </CCol>
                    <CCol :xs="12" :md="12" class="mt-3">
                        <CAccordion>
                            <CAccordionItem :item-key="1">
                                <CAccordionHeader>
                                    <CIcon :icon="cilSettings" class="me-2"  />
                                    Item Tambahan (Opsional)
                                </CAccordionHeader>
                                <CAccordionBody>
                                    <div class="mb-3" v-for="(elem, elemIndex) in service.additional_package_service_items">
                                        <CRow>
                                            <CCol>
                                                <CFormLabel>Item</CFormLabel>
                                                <CFormInput 
                                                    type="text" 
                                                    v-model="elem.additional_item_service.item_name"
                                                    disabled
                                                />
                                            </CCol>
                                            <CCol>
                                                <CFormLabel>QTY</CFormLabel>
                                                <CFormInput 
                                                    type="text" 
                                                    disabled
                                                    v-model="elem.quantity"
                                                />
                                            </CCol>
                                        </CRow>
                                    </div>
                                    <div v-if="service.additional_package_service_items.length <= 0"class="text-center text-secondary">
                                        <small>Data Kosong</small>
                                    </div>
                                </CAccordionBody>
                            </CAccordionItem>
                        </CAccordion>
                    </CCol>
                </CRow>
                <hr />
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            Summary
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel>Diskon</CFormLabel>
            <CFormInput v-model="data.discount" placeholder="Potongan harga paket"/>
            <div class="text-end text-danger" v-if="errors.discount">
                <small>{{ errors.discount }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel>Biaya Total</CFormLabel>
            <CFormInput 
                disabled 
                v-model="data.total_price"
                text="Harga yang tertera merupakan harga perhari"
            />
        </div>
    </CForm>
</template>