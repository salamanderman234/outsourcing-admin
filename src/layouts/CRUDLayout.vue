<script setup>
    import {ref, watchEffect} from 'vue';
    import fetcher from '@/api/fetcher';
    import { CIcon } from '@coreui/icons-vue';
    import { cilSearch } from '@coreui/icons';
    import AppPagination from "@/components/AppPagination";

    const props = defineProps({
        resource_url:{
            type: String,
            required: true,
        },
        columns: {
            type: Array,
            required: true,
        },
        fields: {
            type: Array,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        disable_search: {
            type:Boolean,
            default: false,
        },
        disable_numbering: {
            type:Boolean,
            default: false,
        }
    });
    const emits = defineEmits(['toast', "afterFetch"]);
    const datas = ref([]);
    const pagination = ref({
        current_page: 1,
        next_page: 1,
        previous_page: 1,
        max_page: 1,

    });
    const queries = ref({
        query: "",
    });

    const setQueries = (key, value) => {
        queries.value[key] = value;
    }
    function setPage(page) {
        pagination.value.current_page = page;
    }
    const toast = (data) => {
        emits("toast", data)
    }
    const refresh = () => {
        getDatas();
    }
    function getProperty(obj, prop) {
        return prop.split('.').reduce((acc, part) => acc && acc[part], obj) || '-';
    }

    const getDatas = async () => {
        let getUrl = `${props.resource_url}?page=${pagination.value.current_page}`;
        for(const key in queries.value){
            getUrl += `&${key}=${queries.value[key]}`;
        }
        // console.log(getUrl)
        const resp = await fetcher.fetch(getUrl, "GET", false);
        const json = await resp.json();
        if(json.datas){
            datas.value = json.datas;
        }else {
            datas.value = [];
        }
        if(json.pagination) {
            pagination.value.previous_page = json.pagination.previous_page;
            pagination.value.current_page = json.pagination.current_page;
            pagination.value.next_page = json.pagination.next_page;
            pagination.value.max_page = json.pagination.max_page;
        }else {
            pagination.value.previous_page = 1;
            pagination.value.current_page = 1;
            pagination.value.next_page = 1;
            pagination.value.max_page = 1;
        }
    }

    const exposeDatas = () => {
        return datas.value;
    }

    watchEffect(async () => {
        getDatas();
    });

    defineExpose({
        setQueries,
        toast,
        refresh,
        exposeDatas,
    });
</script>
<template>
    <slot name="modal-list"></slot>
    <CRow>
      <CCol :xs="12">
        <CCard class="mb-4">
            <CCardHeader class="d-flex align-items-center justify-content-between">
                <strong>{{ props.title }}</strong>
            </CCardHeader>
            <CCardBody>
                <CRow class="mb-3">
                    <CCol :xs="12" :md="4" class="mb-3 mb-md-0">
                        <CInputGroup v-if="!disable_search">
                            <CInputGroupText id="basic-addon1">
                                <CIcon :icon="cilSearch" class="me-2" />
                            </CInputGroupText>
                            <CFormInput
                                placeholder="Search..."
                                aria-label="Search"
                                aria-describedby="Cari kategori"
                                v-model="queries.query"
                            />
                        </CInputGroup>
                    </CCol>
                    <CCol :xs="12" :md="8" class="d-flex align-items-center justify-content-end flex-column flex-md-row">
                        <slot name="button-list"></slot>
                    </CCol>
                </CRow>
                <CTable striped>
                    <CTableHead>
                        <CTableRow>
                            <CTableHeaderCell 
                                class="text-center" 
                                scope="col"
                                v-if="!disable_numbering"
                            >
                                No
                            </CTableHeaderCell>
                            <CTableHeaderCell class="text-center" scope="col" v-for="column in columns">{{ column }}</CTableHeaderCell>
                            <slot name="additional-columns"></slot>
                            <CTableHeaderCell class="text-center" scope="col">Aksi</CTableHeaderCell>
                        </CTableRow>
                    </CTableHead>
                    
                    <CTableBody>
                        <CTableRow :key="index" v-for="(data, index) in datas" v-if="datas.length">
                            <CTableDataCell 
                                class="text-center" 
                                scope="row"
                                v-if="!disable_numbering"
                            >
                                {{ ((pagination.current_page-1)*10) + index + 1 }}
                            </CTableDataCell>
                            <CTableDataCell 
                                class="text-center align-middle"
                                v-for="(column, index) in columns"
                            >
                                {{ fields[index].includes('id') || fields[index].includes('.id') ? '#'+getProperty(data, fields[index]) :  getProperty(data, fields[index]) }}
                            </CTableDataCell>
                            <slot name="additional-fields" :data="data"></slot>
                            <CTableDataCell class="text-center align-middle">
                                <CDropdown variant="btn-group">
                                    <CDropdownToggle color="light" size="sm" class="bg-transparent" />
                                        <CDropdownMenu>
                                            <slot name="action-list" :data="data"></slot>
                                        </CDropdownMenu>
                                    </CDropdown>
                            </CTableDataCell>
                        </CTableRow>
                        <CTableRow v-else>
                            <CTableDataCell :colspan="99" class="text-center">Data Kosong</CTableDataCell>
                        </CTableRow>
                    </CTableBody>
                </CTable>
                <AppPagination 
                    :pagination="pagination"
                    @setPage="(page) => setPage(page)"
                />
            </CCardBody>
        </CCard>
      </CCol>
    </CRow>
</template>