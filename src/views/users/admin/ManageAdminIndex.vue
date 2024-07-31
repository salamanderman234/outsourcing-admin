<script setup>
    import {ref, watchEffect} from 'vue';
    import fetcher from '@/api/fetcher';
    import { CIcon } from '@coreui/icons-vue';
    import { cilPlus, cilSearch, cilX, cilSave, cilPencil, cilFilter} from '@coreui/icons';
    import AdminCreateForm from './forms/AdminCreateForm.vue';
    import AdminEditForm from './forms/AdminEditForm.vue';

    const page = ref(1);
    const datas = ref([]);
    const paginationPrevious = ref(1);
    const paginationCurrent = ref(1);
    const paginationNext = ref(1);
    const paginationMax = ref(1);
    const q = ref("");
    const selectedRegency = ref(0);
    const regencies = ref([]);

    const showAddModal = ref(false);
    const showEditModal = ref(false);
    const editData = ref(null);
    const editForm  = ref(null);
    const createForm = ref(null);
    const editOnLoad = ref(false);
    const createOnLoad = ref(false);

    const emits = defineEmits(['toast']);

    const toast = (data) => {
        emits("toast", data)
    }

    const getDatas = async () => {
        const getUrl = `/users/role/admin/?page=${page.value}&query=${q.value}${selectedRegency ? "&regency_id="+selectedRegency.value : ""}`
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();
        if(json.datas){
            datas.value = json.datas;
        }else {
            datas.value = [];
        }
        if(json.pagination) {
            paginationPrevious.value = json.pagination.previous_page;
            paginationCurrent.value = json.pagination.current_page;
            paginationNext.value = json.pagination.next_page;
            paginationMax.value = json.pagination.max_page;
        }else {
            paginationPrevious.value = 1;
            paginationCurrent.value = 1;
            paginationNext.value = 1;
            paginationMax.value = 1;
        }
    }

    watchEffect(async () => {
        getDatas();
    });

    function setPage(p) {
        page.value = p;
    }

    function toggleEdit(data) {
        showEditModal.value = true;
        editData.value = data;
    }

    function submitEditHandler(){
        editForm.value.push();
    }

    const submitCreate = () => {
        createForm.value.push();
    }
    const fetchRegencies = async () => {
        const getUrl = "/regencies/";
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();

        if(resp.status == 200){
            regencies.value = json.datas;
        }
    }
    fetchRegencies();
</script>
<template>
    <CModal
        scrollable
        :visible="showAddModal"
        @close="() => { showAddModal = false }"
        aria-labelledby="Add Modal"
    >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel2">Tambah Pengguna Admin</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <AdminCreateForm 
                ref="createForm" 
                @toast="(data) => toast(data)" 
                @refresh="() => getDatas()"
                @toggle="(condition) => showAddModal = condition"
                @onLoad="(cond) => createOnLoad = cond"
            />
        </CModalBody>
        <CModalFooter>
            <CButton color="danger" @click="() => (showAddModal = false)">
                <CIcon :icon="cilX" class="me-2" />
                Batal
            </CButton>
            <CButton color="primary" @click="() => submitCreate()" :disabled="createOnLoad">
                <CIcon :icon="cilSave" class="me-2" />
                Simpan
            </CButton>
        </CModalFooter>
    </CModal>
    <CModal
        scrollable
        :visible="showEditModal"
        @close="() => { showEditModal = false }"
        aria-labelledby="Edit Modal"
    >
        <CModalHeader>
            <CModalTitle id="ScrollingLongContentExampleLabel3">Edit Pengguna Admin#{{ editData.id }}</CModalTitle>
        </CModalHeader>
        <CModalBody>
            <AdminEditForm 
                ref="editForm" :data="editData" 
                @toast="(data) => toast(data)" 
                @refresh="() => getDatas()"
                @toggle="(condition) => showEditModal = condition"
                @onLoad="(cond) => editOnLoad = cond"
            />
        </CModalBody>
        <CModalFooter>
            <CButton color="danger" @click="() => (showEditModal = false)">
                <CIcon :icon="cilX" class="me-2" />
                Batal
            </CButton>
            <CButton color="primary" @click="() => (submitEditHandler())" :disabled="editOnLoad">
                <CIcon :icon="cilSave" class="me-2" />
                Simpan
            </CButton>
        </CModalFooter>
    </CModal>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
            <CCardHeader class="d-flex align-items-center justify-content-between">
                <strong>Manajemen Pengguna Admin</strong>
            </CCardHeader>
            <CCardBody>
                <CRow class="mb-3">
                    <CCol :xs="12" :md="6" class="mb-3 mb-md-0">
                        <CInputGroup>
                            <CInputGroupText id="basic-addon1">
                                <CIcon :icon="cilSearch" class="me-2" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Search..."
                                aria-label="Search"
                                aria-describedby="Cari pengguna admin..."
                                v-model="q"
                            />
                        </CInputGroup>
                    </CCol>
                    <CCol :xs="12" :md="3" class="d-flex align-items-center justify-content-end mb-3 mb-md-0">
                        <CIcon :icon="cilFilter" class="me-2" />
                        <CFormSelect
                            aria-label="Filter Daerah pengguna"
                            v-model="selectedRegency"
                        >
                            <option>Filter Daerah Pengguna</option>
                            <option :value="regency.id" v-for="regency in regencies" :key="regency.id">
                                {{ regency.regency }}
                            </option>
                        </CFormSelect>
                    </CCol>
                    <CCol :xs="12" :md="3" class="d-flex align-items-center justify-content-end">
                        <CButton color="primary" @click="() => (showAddModal = true)">
                            <CIcon :icon="cilPlus" class="me-2" />
                            Tambah
                        </CButton>
                    </CCol>
                </CRow>
                <CTable striped responsive>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell class="text-center" scope="col">No</CTableHeaderCell>
                            <CTableHeaderCell class="text-center" scope="col">Email</CTableHeaderCell>
                            <CTableHeaderCell class="text-center" scope="col">Nama Lengkap</CTableHeaderCell>
                            <CTableHeaderCell class="text-center" scope="col">No.Telp</CTableHeaderCell>
                            <!-- <CTableHeaderCell class="text-center" scope="col">Tgl. Verifikasi</CTableHeaderCell> -->
                            <CTableHeaderCell class="text-center" scope="col">Aksi</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    
                    <CTableBody>
                        <CTableRow :key="index" v-for="(data, index) in datas" v-if="datas.length">
                            <CTableDataCell class="text-center" scope="row">{{ ((paginationCurrent-1)*10) + index + 1 }}</CTableDataCell>
                            <CTableDataCell class="text-center">{{ data.email }}</CTableDataCell>
                            <CTableDataCell class="text-center">{{ data.admin_profile.fullname  }}</CTableDataCell>
                            <CTableDataCell class="text-center">{{ data.admin_profile.phone  }}</CTableDataCell>
                            <!-- <CTableDataCell class="text-center">{{ data.verified_at ? data.verified_at : "-"  }}</CTableDataCell> -->
                            <CTableDataCell class="text-center">
                                <CDropdown variant="btn-group">
                                    <CDropdownToggle color="light" size="sm" class="bg-transparent" />
                                        <CDropdownMenu>
                                            <CDropdownItem @click="() => toggleEdit(data)">
                                                <CIcon :icon="cilPencil" class="me-2" />
                                                Edit
                                            </CDropdownItem>
                                            <CDropdownDivider />
                                        </CDropdownMenu>
                                    </CDropdown>
                            </CTableDataCell>
                        </CTableRow>
                        <CTableRow v-else>
                            <CTableDataCell colspan="6" class="text-center">Data Kosong</CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
                <CPagination aria-label="Pagination" class="d-flex justify-content-center">
                    <CPaginationItem 
                        aria-label="Previous" 
                        @click="setPage(paginationPrevious != page ? paginationPrevious : page)"       
                        :disabled="paginationPrevious == page ? true : false"
                        href="#"
                    >
                        <span aria-hidden="true">&laquo;</span>
                    </CPaginationItem>

                    <template v-for="index in 3">
                        <CPaginationItem 
                            :key="`previousPagination${index}`"
                            v-if="1 + index < paginationCurrent" 
                            @click="setPage(1 + index)" 
                            href="#"
                        >
                            {{ paginationMax }}
                        </CPaginationItem>
                    </template>

                    <CPaginationItem href="#" active>
                        {{ paginationCurrent }}
                    </CPaginationItem>

                    <template v-for="index in 3">
                        <CPaginationItem 
                            :key="`nextPagination${index}`"
                            v-if="paginationCurrent + index + 1 < paginationMax" 
                            @click="setPage(paginationCurrent + index + 1)" 
                            href="#"
                        >
                            {{ paginationMax }}
                        </CPaginationItem>
                    </template>

                    <CPaginationItem 
                        aria-label="Next" 
                        @click="setPage(paginationNext != page && paginationNext <= paginationMax ? paginationNext : page)"       
                        :disabled="paginationNext == page ? true : false"
                        href="#"
                    >
                        <span aria-hidden="true">&raquo;</span>
                    </CPaginationItem>
                </CPagination>
            </CCardBody>
        </CCard>
      </CCol>
    </CRow>
</template>