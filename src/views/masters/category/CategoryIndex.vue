<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import apiConfig from '@/api/apiConfig';
    import {ref, watchEffect} from "vue";
    import fetcher from '@/api/fetcher';
    import { cilPlus, cilPencil, cilInfo, cilFilter, cilGroup, cilCheckAlt, cilPaperPlane, cilPeople, cilTask, cilNotes, cilCarAlt, cilX, cilPaperclip } from '@coreui/icons';
    import CRUDLayout from '@/layouts/CRUDLayout.vue';
    import DefaultModal from "@/components/DefaultModal.vue";
    import CategoryDetailForm from "./forms/CategoryDetailForm.vue";
    import CategoryEditForm from "./forms/CategoryEditForm.vue";
    import CategoryCreateForm from "./forms/CategoryCreateForm.vue";
    import CategoryDeleteForm from "./forms/CategoryDeleteForm.vue";
    import QuestionModal from "./modals/QuestionModal.vue";
    import { useRoute } from 'vue-router';

    const route = useRoute();
    const id = route.query.id;

    const resourceUrl = "/categories/";
    const columns = ["ID", "Nama Kategori"];
    const fields = ["id" ,"category_name"];
    const regencies = ref([]);

    const layout = ref(null);

    const detailModal = ref(null);
    const showDetailModal = ref(false);
    const detailForm = ref(null);
    const detailData = ref({});

    const editModal = ref(null);
    const showEditModal = ref(false);
    const editForm = ref(null);

    const showQuestionModal = ref(false);

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
        title="Manajemen Master Data Kategori"
        :resource_url="resourceUrl"
        :columns="columns"
        :fields="fields"
        ref="layout"
        :disable_numbering="true"
    >
        <template #modal-list>
            <QuestionModal
                :show="showQuestionModal"
                :category="detailData"
                @toast="(val) => layout.toast(val)"
                @setShow="(val) => showQuestionModal = val"
            >

            </QuestionModal>
            <DefaultModal
                ref="detailModal"
                :show="showDetailModal"
                :title="`Detail Master Data Kategori`"
                @toggle="(val) => showDetailModal = val"
                @submit="() => false"
                :disable_save_button="true"
            >
                <CategoryDetailForm
                    ref="detailForm" 
                    :category="detailData"
                    @toast="(val) => layout.toast(val)"
                    @toggle="(val) => showDetailModal = val"
                />
            </DefaultModal>
            <DefaultModal
                ref="editModal"
                :show="showEditModal"
                :title="`Edit Master Data Kategori`"
                @toggle="(val) => showEditModal = val"
                @submit="() => editForm.push()"
            >
                <CategoryEditForm
                    ref="editForm" 
                    :category="detailData"
                    @toggle="(val) => showEditModal = val"
                    @refresh="() => layout.refresh()"
                    @toast="(val) => layout.toast(val)"
                    @onLoad="() => (val) => editModal.setLoad(val)"
                />
            </DefaultModal>
            <DefaultModal
                ref="addModal"
                :show="showAddModal"
                :title="`Tambah Master Data Kategori`"
                @toggle="(val) => showAddModal = val"
                @submit="() => addForm.push()"
            >
                <CategoryCreateForm
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
            <CTableHeaderCell class="text-center" scope="col">Gambar Ikon</CTableHeaderCell>
        </template>   

        <template #additional-fields="{data}">
            <CTableDataCell 
                class="text-center align-middle"
            >
                <img 
                    :src="`${apiConfig.baseUrl}/resource/categories/${data.id}/icon/`" 
                    width="50" 
                    alt="-"
                />
            </CTableDataCell>
        </template>   

        <template #action-list="{data}">
            <CDropdownItem 
                @click="() => {
                    showQuestionModal = true;
                    detailData = data;
                }"
            >
                <CIcon :icon="cilPaperclip" class="me-2" />
                Set Pertanyaan
            </CDropdownItem>
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
            <CategoryDeleteForm 
                :id="data.id" 
                @toast="(data) => layout.toast(data)" 
                @refresh="() => layout.refresh()"
            />
        </template>   
    </CRUDLayout>
</template>