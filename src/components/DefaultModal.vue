<script setup> 
    import { ref } from "vue";
    import { cilX, cilSave } from '@coreui/icons';

    const props = defineProps({
        show: {
            type: Boolean,
            required: true,
            default: false,
        },
        title: {
            type: String,
            required: true,
            default: "Modal"
        },
        disable_save_button: {
            type: Boolean,
            default: false,
        }
    });
    const emits = defineEmits(["toggle", "submit"]);

    const isLoad = ref(false);

    const submitHandler = () => {
        emits("submit", true);
    }
    const setLoad = (val) => {
        isLoad.value = val;
    }

    defineExpose({
        setLoad
    });
</script>

<template>
    <CModal
        scrollable
        :visible="show"
        @close="() => { emits('toggle', false) }"
        :aria-labelledby="title"
    >
        <CModalHeader>
            <CModalTitle>{{ title }}</CModalTitle>
            <div class="ms-1">
                <slot name="tag"></slot>
            </div>
        </CModalHeader>
        <CModalBody>
            <slot></slot>
        </CModalBody>
        <CModalFooter>
            <CButton color="danger" @click="() => emits('toggle', false)">
                <CIcon :icon="cilX" class="me-2" />
                Batal
            </CButton>
            <CButton v-if="!disable_save_button" color="primary" @click="() => submitHandler()" :disabled="isLoad">
                <CIcon :icon="cilSave" class="me-2" />
                Simpan
            </CButton>
        </CModalFooter>
    </CModal>
</template>