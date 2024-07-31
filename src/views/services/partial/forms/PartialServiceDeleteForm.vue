<script setup>
    import { cilTrash } from '@coreui/icons';
    import fetcher from '@/api/fetcher';

    const props = defineProps({
        id: {
            type: Number,
            required: true,
        },
    })
    const emits = defineEmits(['toast', 'refresh']);

    const push = async () => {
        const postUrl = `/services/${props.id}/`;
        const resp = await fetcher.fetch(postUrl, "DELETE", {});
        const json = await resp.json();
        if(resp.status >= 200 && resp.status <= 299){
            emits('refresh','');
        }
        const content = resp.status == 200 ? "Data berhasil dihapus !" : json.detail;
        emits("toast", {
            "title": json.message,
            "content": content,
            "status": resp.status,
        })
    }
</script>

<template>
    <CDropdownItem @click="push()">
        <CIcon :icon="cilTrash" class="me-2" />
        Delete
    </CDropdownItem>
</template>