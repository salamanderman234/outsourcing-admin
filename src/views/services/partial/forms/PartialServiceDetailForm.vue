<script setup>
    import {ref, watchEffect} from "vue"
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilSave, cilTrash } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const totalPrice = ref(0);
    const additionalPrice = ref(0);
    const data = ref({
        id: props.data.id,
        "category_id" : `${props.data.category_id}`,
        "service_name" : props.data.service_name,
        "description" : props.data.description,
        "includes" : props.data.includes,
        "employee_price" : props.data.employee_price,
        "service_price" : props.data.service_price,
        "hour_work" : props.data.hour_work,
        "required_items" : props.data.required_items || [],
        "additional_items" : props.data.additional_items || [],
        "main_image": "",
        "icon": "",
    });
    const errors = ref({
        "category_id" : "",
        "service_name" : "",
        "description" : "",
        "includes" : "",
        "employee_price" : "",
        "service_price" : "",
        "hour_work" : "",
        "required_items" : "",
        "additional_items" : "",
        "main_image": "",
        "icon": ""
    });
    const categories = ref([]);
    const newRequiredItems = ref([]);
    const newAdditionalItems = ref([]);

    const onValidationFail = (json) => {
        const jsonErrors = json.errors;
        jsonErrors.forEach((error, index) => {
            const field = error.field;
            if(errors.value.hasOwnProperty(field)){
                errors.value[field] = error.error;
            }
        });
    };

    const removeRequiredItem = async (id, index) => {
        const postUrl = `/services/remove-required-item/${id}/`;
        const resp = await fetcher.fetch(postUrl, "DELETE", false);
        const json = await resp.json();
        const content = resp.status == 200 ? `Data item tambahan berhasil dihapus !` : json.detail;
        if(resp.status == 200){
            deleteRequiredItem(index);
            emits('refresh','');
        }
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
        
    }
    const removeAdditionalItem = async (id, index) => {
        const postUrl = `/services/remove-additional-item/${id}/`;
        const resp = await fetcher.fetch(postUrl, "DELETE", false);
        const json = await resp.json();
        const content = resp.status == 200 ? `Data item tambahan berhasil dihapus !` : json.detail;
        if(resp.status == 200){
            deleteAdditionalItem(index);
            emits('refresh','');
        }
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
        
    }

    const saveRequiredItem = async (index) => {
        const postUrl = `/services/add-required-item/`;
        const body = newRequiredItems.value[index];
        body.quantity = parseInt(body.quantity) || 0;
        body.price_per_item = parseInt(body.price_per_item) || 0;
        body.service_id = data.value.id;
        const resp = await fetcher.fetch(postUrl, "POST", JSON.stringify(body));
        const json = await resp.json();
        const content = resp.status == 201 ? `Data item tambahan berhasil ditambahkan !` : json.detail;
        if(resp.status == 201){
            deleteNewRequiredItem(index);
            const getUrl = `/services/${data.value.id}/`;
            const resp = await fetcher.fetch(getUrl, "GET", false);
            const json = await resp.json();
            if(resp.status == 200){
                const serv = json.data;
                if(!serv.required_items){
                    serv.required_items = [];
                } 
                if(!serv.additional_items){
                    serv.additional_items = [];
                } 
            }
            emits('refresh','');
        }
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
        
    }
    const saveAdditionalItem = async (index) => {
        const postUrl = `/services/add-additional-item/`;
        const body = newAdditionalItems.value[index];
        body.min_quantity = parseInt(body.min_quantity) || 0;
        body.max_quantity = parseInt(body.max_quantity) || 0;
        body.price_per_item = parseInt(body.price_per_item) || 0;
        body.service_id = data.value.id;
        const resp = await fetcher.fetch(postUrl, "POST", JSON.stringify(body));
        const json = await resp.json();
        const content = resp.status == 201 ? `Data item tambahan berhasil ditambahkan !` : json.detail;
        if(resp.status == 201){
            deleteNewAdditionalItem(index);
            const getUrl = `/services/${data.value.id}/`;
            const resp = await fetcher.fetch(getUrl, "GET", false);
            const json = await resp.json();
            if(resp.status == 200){
                const serv = json.data;
                if(!serv.required_items){
                    serv.required_items = [];
                } 
                if(!serv.additional_items){
                    serv.additional_items = [];
                } 
                if(serv.required_items){
                    data.value = serv;
                }
            }
            emits('refresh','');
        }
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
        
    }

    const push = async () => {
        resetError();
        dataParseInt();
        if(!data.value.main_image) {
            data.value.main_image = null;
        }
        if(!data.value.icon) {
            data.value.icon = null;
        }
        const rawData = JSON.stringify(data.value);
        const postUrl = `/services/${data.value.id}/`;
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
        const content = resp.status == 200 ? `Data layanan parsial#${data.value.id} berhasil diedit !` : json.detail;
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
        data.value.category_id = parseInt(data.value.category_id) || 0;
        data.value.service_price = parseInt(data.value.service_price) || 0;
        data.value.employee_price = parseInt(data.value.employee_price) || 0;
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

    const fetchCategories = async () => {
        const getUrl = "/categories/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            categories.value = json.datas;
        }
    }

    const addNewRequiredItem = () => {
        newRequiredItems.value.push({
            item_name: "",
            quantity: 0,
            price_per_item: 0,
        });
    }
    const addNewAdditionalItem = () => {
        newAdditionalItems.value.push({
            item_name: "",
            min_quantity: 0,
            max_quantity: 0,
            price_per_item: 0,
        });
    }

    const deleteNewRequiredItem = (index) => {
        newRequiredItems.value = newRequiredItems.value.filter((v, i) => {
            return i != index;
        });
    }
    const deleteRequiredItem = (index) => {
        data.value.required_items = data.value.required_items.filter((v, i) => {
            return i != index;
        });
    }

    const deleteNewAdditionalItem = (index) => {
        newAdditionalItems.value = newAdditionalItems.value.filter((v, i) => {
            return i != index;
        });
    }
    const deleteAdditionalItem = (index) => {
        data.value.additional_items = data.value.additional_items.filter((v, i) => {
            return i != index;
        });
    }

    const sumAdditionalPrice = () => {
        let total = 0;
        data.value.required_items.forEach((e) => {
            const price = parseInt(e.price_per_item) || 0;
            const qty = parseInt(e.quantity) || 0;
            const temp = price*qty;
            total += temp;
        });
        additionalPrice.value = total;
        return total
    }

    const sumTotalPrice = () => {
        const addtionalPrice = sumAdditionalPrice();
        const servicePrice = parseInt(data.value.service_price) || 0;
        const employeePrice = parseInt(data.value.employee_price) || 0;
        
        totalPrice.value = addtionalPrice + servicePrice + employeePrice;
    }

    fetchCategories();

    watchEffect(() => {
        sumAdditionalPrice();
        sumTotalPrice();
    });

    defineExpose({
        push,
    });
</script>
<template>
    <CForm class="px-4 py-4">
        <small class="fw-bold text-secondary text-uppercase">
            Data Layanan Parsial
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="category" class="d-flex justify-content-between">
                <span>Kategori Layanan</span>
                <a :href="`/categories?id=${data.category_id}`">Lihat Kategori</a>
            </CFormLabel>
            <CFormSelect
                aria-label="Pilih Kategori Layanan"
                v-model="data.category_id"
                disabled
            >
                <option value="0">Pilih Kategori</option>
                <option :value="`${category.id}`" v-for="category in categories" :key="category.id">
                    {{ category.category_name }}
                </option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.category_id">
                <small>{{ errors.category_id }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_name">Nama Layanan</CFormLabel>
            <CFormInput disabled :class="errors.service_name ? 'border-danger' : ''" v-model="data.service_name" type="text" id="service_name" placeholder="Nama layanan parsial"/>
            <div class="text-end text-danger" v-if="errors.service_name">
                <small>{{ errors.service_name }}</small>
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
                disabled
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
                disabled
            ></CFormTextarea>
            <div class="text-end text-danger" v-if="errors.includes">
                <small>{{ errors.includes }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="main_image" class="d-flex justify-content-between">
                <span>Gambar Layanan</span>
                <a :href="apiConfig.baseUrl+'/resource/services/'+data.id+'/main_image/'" target="_blank">Lihat Gambar</a>
            </CFormLabel>
            <CFormInput 
                :class="errors.main_image ? 'border-danger' : ''" 
                type="file" 
                id="main_image" 
                text="Ukuran maksimal file adalah 5 MB" 
                @change="(e) => uploadFile(e, 'main_image')" 
                accept="image/*"
                disabled
            />
            <div class="text-end text-danger" v-if="errors.main_image">
                <small>{{ errors.main_image }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="icon" class="d-flex justify-content-between">
                <span>Ikon</span>
                <a :href="apiConfig.baseUrl+'/resource/services/'+data.id+'/icon/'" target="_blank">Lihat Ikon</a>
            </CFormLabel>
            <CFormInput 
                :class="errors.icon ? 'border-danger' : ''" 
                type="file" 
                id="icon" 
                text="Ukuran maksimal file adalah 5 MB" 
                @change="(e) => uploadFile(e, 'icon')" 
                accept="image/*"
                disabled
            />
            <div class="text-end text-danger" v-if="errors.icon">
                <small>{{ errors.icon }}</small>
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            Item Tambahan (Wajib)
        </small>
        <hr />
        <div class="mb-3">
            <div v-for="(item,index) in data.required_items">
                <CRow>
                    <CCol :xs="6" :md="5" class="mb-3 mb-md-0">
                        <CFormLabel>Nama Item</CFormLabel>
                        <CFormInput disabled placeholder="Nama Item" v-model="data.required_items[index].item_name"/>
                    </CCol>
                    <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                        <CFormLabel>Qty</CFormLabel>
                        <CFormInput disabled placeholder="0" v-model="data.required_items[index].quantity"/>
                    </CCol>
                    <CCol :xs="12" :md="5" class="mb-3 mb-md-0">
                        <CFormLabel>Harga/item</CFormLabel>
                        <CFormInput disabled placeholder="Harga Per Item" v-model="data.required_items[index].price_per_item"/>
                    </CCol>
                </CRow>
                <hr />
            </div>
            <div class="text-center" v-if="data.required_items.length == 0 && newRequiredItems.length == 0">
                <span>Tidak ada item tambahan (wajib)</span>
            </div>
            <div v-for="(item,index) in newRequiredItems">
                <CRow>
                    <CCol :xs="6" :md="5" class="mb-3 mb-md-0">
                        <CFormLabel>Nama Item</CFormLabel>
                        <CFormInput disabled placeholder="Nama Item" v-model="newRequiredItems[index].item_name"/>
                    </CCol>
                    <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                        <CFormLabel>Qty</CFormLabel>
                        <CFormInput disabled placeholder="0" v-model="newRequiredItems[index].quantity"/>
                    </CCol>
                    <CCol :xs="12" :md="5" class="mb-3 mb-md-0">
                        <CFormLabel>Harga/item</CFormLabel>
                        <CFormInput disabled placeholder="Harga Per Item" v-model="newRequiredItems[index].price_per_item"/>
                    </CCol>
                </CRow>
                <hr />
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            Item Tambahan (Opsional)
        </small>
        <hr />
        <div class="mb-3">
            <div class="mb-3">
                <div v-for="(item,index) in data.additional_items">
                    <CRow>
                        <CCol :xs="6" :md="4" class="mb-3 mb-md-0">
                            <CFormLabel>Nama Item</CFormLabel>
                            <CFormInput disabled placeholder="Nama Item" v-model="data.additional_items[index].item_name"/>
                        </CCol>
                        <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                            <CFormLabel>Min</CFormLabel>
                            <CFormInput disabled placeholder="0" v-model="data.additional_items[index].min_quantity"/>
                        </CCol>
                        <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                            <CFormLabel>Max</CFormLabel>
                            <CFormInput 
                                disabled 
                                placeholder="0" 
                                v-model="data.additional_items[index].max_quantity"
                            />
                        </CCol>
                        <CCol :xs="12" :md="4" class="mb-3 mb-md-0">
                            <CFormLabel>Harga/item</CFormLabel>
                            <CFormInput 
                                disabled 
                                placeholder="Harga Per Item" 
                                v-model="data.additional_items[index].price_per_item"
                            />
                        </CCol>
                    </CRow>
                    <hr />
                </div>
                <div 
                    class="text-center text-secondary" 
                    v-if="data.additional_items.length == 0 && newAdditionalItems.length == 0"
                >
                    <span>Tidak ada item tambahan</span>
                </div>
                <div v-for="(item,index) in newAdditionalItems">
                    <CRow>
                        <CCol :xs="6" :md="4" class="mb-3 mb-md-0">
                            <CFormLabel>Nama Item</CFormLabel>
                            <CFormInput disabled placeholder="Nama Item" v-model="newAdditionalItems[index].item_name"/>
                        </CCol>
                        <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                            <CFormLabel>Min</CFormLabel>
                            <CFormInput disabled placeholder="0" v-model="newAdditionalItems[index].min_quantity"/>
                        </CCol>
                        <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                            <CFormLabel>Max</CFormLabel>
                            <CFormInput disabled placeholder="0" v-model="newAdditionalItems[index].max_quantity"/>
                        </CCol>
                        <CCol :xs="12" :md="4" class="mb-3 mb-md-0">
                            <CFormLabel>Harga/item</CFormLabel>
                            <CFormInput disabled placeholder="Harga Per Item" v-model="newAdditionalItems[index].price_per_item"/>
                        </CCol>
                    </CRow>
                    <hr />
                </div>
            </div>
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            Harga
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_price">Biaya Layanan</CFormLabel>
            <CFormInput 
                :class="errors.service_price ? 'border-danger' : ''" 
                v-model="data.service_price" 
                type="text" 
                id="service_price" 
                placeholder="Biaya layanan"
                text="Harga yang tertera merupakan harga perhari"
                disabled
            />
            <div class="text-end text-danger" v-if="errors.service_price">
                <small>{{ errors.service_price }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="employee_price">Biaya Gaji Karyawan</CFormLabel>
            <CFormInput 
                :class="errors.employee_price ? 'border-danger' : ''" 
                v-model="data.employee_price" 
                type="text" 
                id="employee_price" 
                placeholder="Biaya gaji karyawan"
                text="Harga yang tertera merupakan harga gaji satu karyawan"
                disabled
            />
            <div class="text-end text-danger" v-if="errors.employee_price">
                <small>{{ errors.employee_price }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel>Biaya Tambahan</CFormLabel>
            <CFormInput v-model="additionalPrice" disabled/>
        </div>
        <div class="mb-3">
            <CFormLabel>Biaya Total</CFormLabel>
            <CFormInput 
                v-model="totalPrice" 
                disabled
                text="Harga yang tertera merupakan harga 1 karyawan perhari"
            />
        </div>
    </CForm>
</template>