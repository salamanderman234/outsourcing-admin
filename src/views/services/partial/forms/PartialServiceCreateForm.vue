<script setup>
    import {ref, watchEffect} from "vue"
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilTrash } from '@coreui/icons';


    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const totalPrice = ref(0);
    const additionalPrice = ref(0);

    const data = ref({
        "category_id" : "0",
        "service_name" : "",
        "description" : "",
        "includes" : "",
        "employee_price" : 0,
        "service_price" : 0,
        "hour_work" : 0,
        "required_items" : [],
        "additional_items" : [],
        "main_image": "",
        "icon": ""
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
        if(!data.value.icon) {
            data.value.icon = null;
        }
        const rawData = JSON.stringify(data.value);
        const postUrl = `/services/`;
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
        const content = resp.status == 201 ? "Data layanan parsial berhasil dibuat !" : json.detail;
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

        data.value.additional_items.forEach((item,index) =>{
            data.value.additional_items[index].min_quantity = parseInt(data.value.additional_items[index].min_quantity) || 0;
            data.value.additional_items[index].max_quantity = parseInt(data.value.additional_items[index].max_quantity) || 0;
            data.value.additional_items[index].price_per_item = parseInt(data.value.additional_items[index].price_per_item) || 0;
        });
        data.value.required_items.forEach((item,index) => {
            data.value.required_items[index].quantity = parseInt(data.value.required_items[index].quantity) || 0;
            data.value.required_items[index].price_per_item = parseInt(data.value.required_items[index].price_per_item) || 0;
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

    const fetchCategories = async () => {
        const getUrl = "/categories/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            categories.value = json.datas;
        }
    }

    const addNewRequiredItem = () => {
        data.value.required_items.push({
            item_name: "",
            quantity: 0,
            price_per_item: 0,
        });
    }

    const deleteRequiredItem = (index) => {
        data.value.required_items = data.value.required_items.filter((v, i) => {
            return i != index;
        });
    }

    const addNewAdditionalItem = () => {
        data.value.additional_items.push({
            item_name: "",
            min_quantity: 0,
            max_quantity: 0,
            price_per_item: 0,
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
            <CFormLabel for="category">Kategori Layanan</CFormLabel>
            <CFormSelect
                aria-label="Pilih Kategori Layanan"
                v-model="data.category_id"
            >
                <option value="0">Pilih Kategori</option>
                <option :value="category.id" v-for="category in categories" :key="category.id">
                    {{ category.category_name }}
                </option>
            </CFormSelect>
            <div class="text-end text-danger" v-if="errors.category_id">
                <small>{{ errors.category_id }}</small>
            </div>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_name">Nama Layanan</CFormLabel>
            <CFormInput :class="errors.service_name ? 'border-danger' : ''" v-model="data.service_name" type="text" id="service_name" placeholder="Nama layanan parsial"/>
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
            <CFormLabel for="main_image">Gambar Layanan</CFormLabel>
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
        <div class="mb-3">
            <CFormLabel for="icon">Ikon</CFormLabel>
            <CFormInput 
                :class="errors.icon ? 'border-danger' : ''" 
                type="file" 
                id="icon" 
                text="Ukuran maksimal file adalah 5 MB" 
                @change="(e) => uploadFile(e, 'icon')" 
                accept="image/*"
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
                        <CFormInput placeholder="Nama Item" v-model="data.required_items[index].item_name"/>
                    </CCol>
                    <CCol :xs="6" :md="2" class="mb-3 mb-md-0">
                        <CFormLabel>Qty</CFormLabel>
                        <CFormInput placeholder="0" v-model="data.required_items[index].quantity"/>
                    </CCol>
                    <CCol :xs="12" :md="5" class="mb-3 mb-md-0">
                        <CFormLabel>Harga/item</CFormLabel>
                        <CFormInput placeholder="Harga Per Item" v-model="data.required_items[index].price_per_item"/>
                    </CCol>
                    <CCol :xs="12" :md="12" class="mb-3 mb-md-0 mt-3 d-flex">
                        <CButton color="danger" class="text-white w-100" @click="() => deleteRequiredItem(index)">
                            <CIcon :icon="cilTrash" />
                            Hapus
                        </CButton>
                    </CCol>
                </CRow>
                <hr />
            </div>
        </div>
        <div class="mb-3">
            <CButton color="primary" class="w-100" @click="() => addNewRequiredItem()">
                <CIcon :icon="cilPlus" class="me-2"  />
                Tambah Item
            </CButton>
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
                            <CFormInput placeholder="Nama Item" v-model="data.additional_items[index].item_name"/>
                        </CCol>
                        <CCol :xs="3" :md="2" class="mb-3 mb-md-0">
                            <CFormLabel>Min</CFormLabel>
                            <CFormInput placeholder="0" v-model="data.additional_items[index].min_quantity"/>
                        </CCol>
                        <CCol :xs="3" :md="2" class="mb-3 mb-md-0">
                            <CFormLabel>Max</CFormLabel>
                            <CFormInput placeholder="0" v-model="data.additional_items[index].max_quantity"/>
                        </CCol>
                        <CCol :xs="12" :md="4" class="mb-3 mb-md-0">
                            <CFormLabel>Harga/item</CFormLabel>
                            <CFormInput placeholder="Harga Per Item" v-model="data.additional_items[index].price_per_item"/>
                        </CCol>
                        <CCol :xs="12" :md="12" class="mb-3 mb-md-0 d-flex mt-3">
                            <CButton color="danger" class="text-white w-100" @click="() => deleteAdditionalItem(index)">
                                <CIcon :icon="cilTrash" />
                            </CButton>
                        </CCol>
                    </CRow>
                    <hr />
                </div>
            </div>
        </div>
        <div class="mb-3">
            <CButton color="primary" class="w-100" @click="() => addNewAdditionalItem()">
                <CIcon :icon="cilPlus" class="me-2" />
                Tambah Item
            </CButton>
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