<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import apiConfig from '@/api/apiConfig';
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilFilter, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask, cilNotes, cilCarAlt, cilX } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import PackageDetailForm from "./forms/PackageDetailForm.vue";
    import PackageEditForm from "./forms/PackageEditForm.vue";
    import PackageCreateForm from "./forms/PackageCreateForm.vue";
    import PackageDeleteForm from "./forms/PackageDeleteForm.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/packages/";
    const columns = ["ID", "Nama Paket", "Minimal Kontrak"];
    const fields = ["id" ,"package_name", 'min_contract'];
    const regencies = ref([]);

    const layout = ref(null);

    const detailModal = ref(null);
    const showDetailModal = ref(false);
    const detailForm = ref(null);
    const detailData = ref({});

    const editModal = ref(null);
    const showEditModal = ref(false);
    const editForm = ref(null);

    const addModal = ref(null);
    const showAddModal = ref(false);
    const addForm = ref(null);

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
        title="Manajemen Paket Layanan"
        :resource_url="resourceUrl"
        :columns="columns"
        :fields="fields"
        ref="layout"
        :disable_numbering="true"
    >
        <template #modal-list>
            <DefaultModal
                ref="detailModal"
                :show="showDetailModal"
                :title="`Detail Layanan Parsial`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <PackageDetailForm
                    ref="detailForm" 
                    :data="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showDetailModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="editModal"
                :show="showEditModal"
                :title="`Edit Paket Layanan`"
                @toggle="(val) => showEditModal = val"
                @submit="() => editForm.push()"
            >
                <PackageEditForm
                    ref="editForm" 
                    :data="detailData"
                    @toggle="(val) => showEditModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => editModal.setLoad(val)"
                />
            </DefaultModal>
            <DefaultModal
                ref="addModal"
                :show="showAddModal"
                :title="`Tambah Paket Layanan`"
                @toggle="(val) => showAddModal = val"
                @submit="() => addForm.push()"
            >
                <PackageCreateForm
                    ref="addForm" 
                    :data="detailData"
                    @toggle="(val) => showAddModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => addModal.setLoad(val)"
                />
            </DefaultModal>
        </template>

        <template #button-list>
            <CButton color="primary" @click="() => showAddModal = true">
                <CIcon :icon="cilPlus" class="me-2" />
                Tambah
            </CButton>
        </template>   

        <template #additional-columns>
            <CTableHeaderCell class="text-center" scope="col">Harga</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center align-middle"
            >
                Rp. {{ Intl.NumberFormat('id-ID').format(data.total_price) }}
                <!-- {{ data.total_price }} -->
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
                @click="() => {
                    showEditModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilPencil" class="me-2" />
                Edit
            </CDropdownItem>
            <CDropdownDivider />
            <PackageDeleteForm 
                :id="data.id" 
                @toast="(data) => layout.toast(data)" 
                @refresh="() => layout.refresh()"
            />
        </template>   
    </CRUDLayout>
</template>