<script setup>
    import avatar from '@/assets/images/avatars/8.jpg'
    import {ref, watchEffect} from "vue"
    import { cilCheck, cilCheckAlt, cilMediaStop, cilPaperclip, cilPlus, cilSave, cilSettings, cilThumbDown, cilThumbUp, cilTrash, cilX } from '@coreui/icons';
    import apiConfig from "@/api/apiConfig";
    import fetcher from "@/api/fetcher";
    import { CButton } from "@coreui/vue";

    const props = defineProps({
        data: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(['toast', 'refresh', 'toggle', 'onLoad']);

    const statusMap = {
        ongoing: {
            text: "Sedang Berjalan",
            color: "primary"
        },
        suspended: {
            text:"Suspend",
            color:"danger"
        },
        end: {
            text:"Selesai",
            color:"success"
        },
    }
    const data = ref({
        id: props.data.id,
        transaction_id: props.data.transaction_id || "0",
        transaction: props.data.transaction || false,
        supervisor_id: props.data.supervisor_id || "0",
        supervisor: props.data.supervisor || "",
        regency_id: props.data.regency_id || "0",
        regency: props.data.regency || "",
        start_date: props.data.start_date || "",
        end_date: props.data.end_date || "",
        status: props.data.status || "",
        note: props.data.note || "",
        duration: props.data.duration || "0",
        total_employee: props.data.total_employee || "0",
        name: props.data.name || "",
        address: props.data.address || "",
        details: props.data.details || [],
        forms: props.data.forms || [],
    });

    const setSuspend = async (id) => {
        const postUrl = `/placements/employees/${id}/suspend/`
        const resp = await fetcher.fetch(postUrl, "PATCH", false);
        const json = await resp.json();

        if(resp.status == 200){
            refresh()
        }
        const content = resp.status == 200 ? `Berhasil suspend penempatan karyawan` : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
    const setOngoing = async (id) => {
        const postUrl = `/placements/employees/${id}/ongoing/`
        const resp = await fetcher.fetch(postUrl, "PATCH", false);
        const json = await resp.json();

        if(resp.status == 200){
            refresh()
        }
        const content = resp.status == 200 ? `Berhasil melanjutkan penempatan karyawan` : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }
    const setDismissed = async (id) => {
        const postUrl = `/placements/employees/${id}/cutoff/`
        const resp = await fetcher.fetch(postUrl, "PATCH", false);
        const json = await resp.json();

        if(resp.status == 200){
            refresh()
        }
        const content = resp.status == 200 ? `Berhasil menghentikan penempatan karyawan` : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    const removeEmployee = async (id) => {
        const postUrl = `/placements/employees/${id}/`
        const resp = await fetcher.fetch(postUrl, "DELETE", false);
        const json = await resp.json();

        if(resp.status == 200){
            refresh()
        }
        const content = resp.status == 200 ? `Berhasil menghapus penempatan karyawan` : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        });
    }

    const refresh = async () => {
        const getUrl = `/placements/${data.value.id}/`;
        const respX = await fetcher.fetch(getUrl, "GET", false);
        const jsonX = await respX.json();
        if(respX.status == 200){
            data.value = jsonX.data;
        }
    }

    const feedbackMap = (feedbacks) => {
        if(!feedbacks){
            return
        }
        let map = {}
        for(const key in feedbacks){
            const feedback = feedbacks[key];
            const employeeID = feedback.placement_detail_employee_id;
            if(!employeeID){
                continue
            }
            if(map[employeeID]){
                map[employeeID].answers.push({
                    question : feedback.question,
                    answer: feedback.rate
                });
                map[employeeID].rate += feedback.rate;
                map[employeeID].totalQuestion += 1;
            }else {
                const data = {
                    answers: [{
                        question : feedback.question,
                        answer: feedback.rate
                    }],
                    rate: feedback.rate,
                    totalQuestion: 1,
                };
                const placementDetail = feedback.placement_detail_employee;
                if(placementDetail){
                    const employee = placementDetail.employee;
                    data.employee = employee;
                }
                map[employeeID] = data
            }
        }
        return map;
    }
</script>
<template>
    <CForm class="px-4 py-4">
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Penempatan</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Penempatan</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.id" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>ID Transaksi</span>
                <a v-if="data.transaction" :href="`/#/transactions?id=${data.transaction_id}`">Lihat Transaksi</a>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="'#'+data.transaction_id" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Status</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="statusMap[data.status] ? statusMap[data.status].text : '-'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Supervisor</span>
            </CFormLabel>
            <template v-if="data.supervisor">
                <CAvatar 
                    :src="data.supervisor.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${data.supervisor.user.id}/profile/` : avatar" 
                    size="md" 
                    v-if="data.supervisor" 
                />
                {{ data.supervisor ? data.supervisor.fullname : '-' }}
                <a :href="`/#/supervisors?id=${data.supervisor.id}`" v-if="data.supervisor">#{{ data.supervisor.id }}</a>
            </template>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Daerah</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.regency ? data.regency.regency : '-'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
        <CFormLabel for="description">Catatan</CFormLabel>
            <CFormTextarea 
                disabled
                v-model="data.note"
                rows="3"
                class=""
            ></CFormTextarea>
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Jumlah Karyawan</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.total_employee ? data.total_employee+' Orang' : '-'" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Durasi Penempatan</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.duration ? data.duration+' Hari' : '-'" 
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
                :value="new Date(data.start_date).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Tanggal Selesai</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="new Date(data.end_date).toISOString().slice(0,10)" 
                type="date" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Data Pemesan</span>
        </small>
        <hr />
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Nama</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.name" 
                type="text" 
                disabled
            />
        </div>
        <div class="mb-3">
            <CFormLabel for="service_user" class="d-flex justify-content-between">
                <span>Alamat</span>
            </CFormLabel>
            <CFormInput 
                class=""
                :value="data.address" 
                type="text" 
                disabled
            />
        </div>
        <small class="fw-bold text-secondary text-uppercase">
            <span>Detail</span>
        </small>
        <hr />
        <CAccordion>
            <CAccordionItem :item-key="detail.id" v-for="detail in data.details">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between w-100 px-2">
                        <span>
                            <span>{{ detail.service ? detail.service.service_name : '-' }}</span>
                            <CBadge v-if="data.status != 'end'" class="ms-2" :color="detail.filled >= detail.total_employee ? 'success' : 'danger'">
                                {{ detail.filled >= detail.total_employee ? 'Terpenuhi' : 'Belum Terpenuhi' }}
                            </CBadge>
                        </span>
                        <div>
                            <span>{{ detail.filled }} / {{ detail.total_employee }}</span>
                        </div>
                    </div>
                </CAccordionHeader>
                <CAccordionBody>
                    <CAccordion>
                        <CAccordionItem :item-key="employee.id" v-for="employee in detail.employees">
                            <CAccordionHeader >
                                <div class="d-flex justify-content-between align-items-center w-100 px-2">
                                    <span>
                                        <span class="d-flex align-items-center">
                                            <CAvatar 
                                                :src="employee.employee.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${employee.employee.user.id}/profile/` : avatar" 
                                                size="md" 
                                                v-if="employee.employee" 
                                            />
                                            <div class="d-block ms-1">
                                                <span class="d-none d-md-inline" v-if="employee.employee">
                                                    {{ employee.employee ? employee.employee.fullname : '-' }}
                                                </span>
                                                <a :href="`/#/employees?id=${employee.employee_id}`">{{ '#'+employee.employee_id }}</a>
                                                <small class="d-none d-md-block text-secondary">
                                                    {{ new Date(employee.placement_date).toISOString().slice(0,10) }}
                                                </small>
                                            </div>
                                        </span>
                                        
                                    </span>
                                    <div >
                                        <CBadge class="ms-2" :color="employee.status == 'ongoing' ? 'primary' : employee.status == 'done' ? 'success' : employee.status == 'suspend' ? 'warning' : 'danger'">
                                            {{ employee.status == 'ongoing' ? ' Berjalan' : employee.status == 'done' ? 'Selesai' : employee.status == 'suspend' ? 'Suspend' : 'Dihentikan' }}
                                        </CBadge>
                                    </div>
                                </div>
                            </CAccordionHeader>
                            <CAccordionBody>
                                <div class="mb-3">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Status</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="employee.status == 'ongoing' ? ' Berjalan' : employee.status == 'done' ? 'Selesai' : employee.status == 'suspended' ? 'Suspend' : 'Dihentikan'" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Durasi Penempatan</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="employee.duration+' Hari'" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Tanggal Penempatan</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="new Date(employee.placement_date).toISOString().slice(0,10)" 
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
                                        :value="new Date(employee.start_date).toISOString().slice(0,10)" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Tanggal Berakhir</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="new Date(employee.end_date).toISOString().slice(0,10)" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Perkiraan Gaji (Perhari)</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="employee.expected_salary" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Perkiraan Gaji (Total)</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="employee.expected_salary_total" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3" v-if="employee.actual_salary">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Gaji Selama Bekerja</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class=""
                                        :value="employee.actual_salary" 
                                        type="text" 
                                        disabled
                                    />
                                </div>
                                <div class="mb-3" v-if="employee.exit_date">
                                    <CFormLabel for="service_user" class="d-flex justify-content-between">
                                        <span>Tanggal Keluar</span>
                                    </CFormLabel>
                                    <CFormInput 
                                        class="bg-danger text-white "
                                        :value="new Date(employee.exit_date).toISOString().slice(0,10)" 
                                        type="date" 
                                        disabled
                                    />
                                </div>

                                <div class="mb-3" v-if="employee.status == 'suspend'">
                                    <CButton color="success" class="text-white w-100" @click="() => setOngoing(employee.id)">
                                        <CIcon :icon="cilThumbUp" />
                                        Lanjutkan
                                    </CButton>
                                </div>
                                <div class="mb-3" v-if="employee.status == 'ongoing'">
                                    <CButton color="warning" class="text-white w-100" @click="() => setSuspend(employee.id)">
                                        <CIcon :icon="cilThumbDown" />
                                        Suspend
                                    </CButton>
                                </div>
                                <div class="mb-3" v-if="employee.status != 'dismiss' && employee.status != 'done'" @click="() => setDismissed(employee.id)">
                                    <CButton color="dark" class="text-white w-100">
                                        <CIcon :icon="cilX" />
                                        Hentikan
                                    </CButton>
                                </div>
                                <div class="mb-3" v-if="employee.status != 'dismiss' && employee.status != 'done'" @click="() => removeEmployee(employee.id)">
                                    <CButton color="danger" class="text-white w-100">
                                        <CIcon :icon="cilTrash" />
                                        Hapus
                                    </CButton>
                                </div>
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>
                    <div class="text-center text-secondary" v-if="detail.employees.length <= 0">
                        Tidak ada karyawan yang ditempatkan
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary" v-if="data.details.length <= 0">
            Tidak ada detail
        </div>
        <small class="fw-bold text-secondary text-uppercase mt-3 d-block">
            <span>List Form Performa</span>
        </small>
        <hr />
        <CAccordion>
            <CAccordionItem :item-key="form.id" v-for="form in data.forms">
                <CAccordionHeader >
                    <div class="d-flex justify-content-between align-items-center w-100 px-2">
                        <span>
                            <CIcon :icon="cilPaperclip" class="me-2" />
                            <span>
                                Penilaian {{ new Date(form.date).toISOString().slice(0,10) }}
                            </span>
                            <small class="d-block text-secondary" v-if="form.filled_date">
                                Diisi : {{ new Date(form.filled_date).toISOString().slice(0,10) }}
                            </small>
                        </span>
                        <div >
                            <CBadge class="me-2" :color="form.filled_date  ? 'success' : 'danger'">
                                {{ form.filled_date  ? 'Sudah Diisi' : 'Belum Diisi' }}
                            </CBadge>
                        </div>
                    </div>
                </CAccordionHeader>
                <CAccordionBody>
                    <CAccordion>
                        <CAccordionItem :item-key="key" v-for="(item,key) in feedbackMap(form.feedbacks)">
                            <CAccordionHeader >
                                <div class="d-flex justify-content-between align-items-center w-100 px-2 align-middle">
                                    <span>
                                        <CAvatar 
                                            :src="item.employee.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${item.employee.user.id}/profile/` : avatar" 
                                            size="md" 
                                            v-if="item.employee" 
                                        />
                                        <span class="d-none d-md-inline ms-1" v-if="item.employee">
                                            {{ item.employee ? item.employee.fullname : '-' }}
                                        </span>
                                        <a class="mx-1" :href="`/#/employees?id=${item.employee.id}`">{{ '#'+item.employee.id }}</a>
                                        <span v-if="!item.employee">-</span>
                                    </span>
                                    <div class="align-middle">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill text-warning" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                        </svg>
                                        {{ item.answers.length > 0 ? item.rate / item.answers.length : 0 }}
                                    </div>
                                </div>
                            </CAccordionHeader>
                            <CAccordionBody>
                                <CInputGroup class="mb-3" v-for="answer in item.answers">
                                    <CFormInput disabled :value="answer.question" />
                                    <CInputGroupText>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-star-fill text-warning mx-1" viewBox="0 0 16 16">
                                            <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                                        </svg>
                                        {{answer.answer }}
                                    </CInputGroupText>
                                </CInputGroup>
                            </CAccordionBody>
                        </CAccordionItem>
                    </CAccordion>
                    <div class="text-center text-secondary" v-if="!form.feedbacks.length > 0">
                        Form belum diisi
                    </div>
                </CAccordionBody>
            </CAccordionItem>
        </CAccordion>
        <div class="text-center text-secondary" v-if="data.forms.length <= 0">
            Tidak ada form yang dibuat supervisor
        </div>
    </CForm>
</template>