<script setup>
    import {ref, watchEffect} from "vue"
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilSettings, cilTrash } from '@coreui/icons';


    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const totalPrice = ref(0);

    const data = ref({
        "package_name" : "",
        "description" : "",
        "includes" : "",
        "min_contract" : "1",
        "services" : [],
        "discount": "0",
        "main_image": "",
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
    const services = ref([]);

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
        const dataServices = data.value.services;
        dataServices.forEach((dataService, index) => {
            const dataServiceItems = dataService.additional_package_service_items;
            data.value.services[index].additional_package_service_items = setAdditional(dataServiceItems);
        });
        const rawData = JSON.stringify(data.value);
        const postUrl = `/packages/`;
        emits('onLoad', true);
        const resp = await fetcher.fetch(postUrl, "POST", rawData);
        emits('onLoad', false);
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
            emits('toggle', false);
        }else if(resp.status == 400 && json.errors) {
            onValidationFail(json);
        }
        const content = resp.status == 201 ? "Data paket berhasil dibuat !" : json.detail;
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

    const setAdditional = (additionals) => {
        const cont = [];
        additionals.forEach((additional, additionalIndex) => {
            const qty = parseInt(additional.quantity) || 0;
            if(qty){
                const n = {
                    quantity : qty,
                    additional_item_service_id : parseInt(additional.additional_item_service_id) || 0,
                }
                cont.push(n)
            }
        });
        return cont;
    }

    const dataParseInt = () => {
        data.value.discount = parseInt(data.value.discount) || 0;
        data.value.min_contract = parseInt(data.value.min_contract) || 0;
        data.value.services.forEach((service, index) => {
            data.value.services[index].service_id = parseInt(data.value.services[index].service_id) || 0;
            data.value.services[index].total_employee = parseInt(data.value.services[index].total_employee) || 0;

            const additionals = service.additional_package_service_items;

            additionals.forEach((additional, additionalIndex) => {
                data.value.services[index].additional_package_service_items[additionalIndex].quantity = parseInt(data.value.services[index].additional_package_service_items[additionalIndex].quantity)  || 0;
                data.value.services[index].additional_package_service_items[additionalIndex].additional_item_service_id = parseInt(data.value.services[index].additional_package_service_items[additionalIndex].additional_item_service_id) || 0;
            });
        });
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

    const fetchServices = async () => {
        const getUrl = "/services/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            services.value = json.datas;
        }
    }

    const addNewService = () => {
        data.value.services.push({
            service_id: "0",
            service: {},
            total_employee: "0",
            additional_package_service_items: [],
        });
    }

    const removeService = (index) => {
        data.value.services = data.value.services.filter((v, i) => {
            return i != index;
        });
    }

    const setServiceAndDetail = (v, index) => {
        const chosenServ = services.value.filter((i) => v == i.id)[0];
        data.value.services[index].service = chosenServ;
        data.value.services[index].additional_package_service_items = chosenServ.additional_items.map((val) => {
            return {
                additional_item_service_id: val.id,
                item: val,
                quantity: "0",
            }
        });
    }

    const sumTotalPrice = () => {
        const servicesList = data.value.services;
        let total = 0;
        servicesList.forEach((e, i) => {
            let karyawan = e.total_employee || 0;
            let sub = e.service.total_price*karyawan || 0;
            const additionals = e.additional_package_service_items || [];
            additionals.forEach((additional, y) => {
                const additionalPrice = additional.item.price_per_item || 0;
                const qty = additional.quantity || 0;
                sub += additionalPrice*qty;
            });
            total += sub;
        });
        totalPrice.value = Math.max(total-data.value.discount, 0);
    }


    fetchServices();

    watchEffect(() => {
        sumTotalPrice();
    });

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
            <CFormInput 
                :class="errors.package_name ? 'border-danger' : ''" 
                v-model="data.package_name" 
                type="text" 
                id="package_name" 
                placeholder="Nama paket"
            />
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
                placeholder="Deskripsi paket"
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
            <CFormLabel for="main_image">Gambar Paket</CFormLabel>
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
        <div class="mb-3" v-for="(service,index) in data.services">
            <CRow>
                <CCol :xs="6" :md="7">
                    <CFormLabel for="category">Layanan #{{ index + 1  }}</CFormLabel>
                    <CFormSelect
                        aria-label="Pilih Layanan"
                        v-model="data.services[index].service_id"
                        @change="(e) => setServiceAndDetail(e.target.value, index)" 
                    >
                        <option value="0">Pilih Layanan</option>
                        <option :value="serv.id" v-for="serv in services" :key="serv.id">
                            {{ serv.service_name }}
                        </option>
                    </CFormSelect>
                </CCol>
                <CCol :xs="6" :md="5">
                    <CFormLabel for="total_employee{{ index }}">Jumlah Karyawan</CFormLabel>
                    <CFormInput 
                        v-model="data.services[index].total_employee" 
                        type="text" 
                        id="total_employee{{}}" 
                        placeholder="Jumlah karyawan"
                    />
                </CCol>
                <CCol :xs="12" :md="12" class="mt-3">
                    <CAccordion>
                        <CAccordionItem :item-key="1">
                            <CAccordionHeader>
                                <CIcon :icon="cilSettings" class="me-2"  />
                                Setting Item Tambahan (Opsional)
                            </CAccordionHeader>
                            <CAccordionBody>
                                <div class="mb-3" v-for="(elem, elemIndex) in data.services[index].additional_package_service_items">
                                    <CRow>
                                        <CCol>
                                            <CFormLabel>Item</CFormLabel>
                                            <CFormInput 
                                                type="text" 
                                                v-model="data.services[index].additional_package_service_items[elemIndex].item.item_name"
                                                disabled
                                                :text="'min-max qty : '+data.services[index].additional_package_service_items[elemIndex].item.min_quantity+' - '+data.services[index].additional_package_service_items[elemIndex].item.max_quantity"
                                            />
                                        </CCol>
                                        <CCol>
                                            <CFormLabel>QTY</CFormLabel>
                                            <CFormInput 
                                                type="text" 
                                                v-model="data.services[index].additional_package_service_items[elemIndex].quantity"
                                                text="Bisa dikosongkan jika tidak ingin ditambahkan"
                                            />
                                        </CCol>
                                    </CRow>
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>
                </CCol>
                <CCol :xs="12" :md="12" class="mt-3">
                    <CButton color="danger" class="w-100 text-white" @click="() => removeService(index)">
                        <CIcon :icon="cilTrash" class="me-2"  />
                        Hapus
                    </CButton>
                </CCol>
            </CRow>
            <hr />
        </div>
        <div class="mb-3">
            <CButton color="primary" class="w-100" @click="() => addNewService()">
                <CIcon :icon="cilPlus" class="me-2"  />
                Tambah Layanan
            </CButton>
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
                text="Harga yang tertera merupakan harga perhari"
                v-model="totalPrice"
            />
        </div>
    </CForm>
</template>