<script setup>
    const props = defineProps({
        pagination: {
            type: Object,
            required: true,
        }
    });
    const emits = defineEmits(["setPage"]);
</script>
<template>
    <CPagination aria-label="Pagination" class="d-flex justify-content-center">
        <CPaginationItem 
            aria-label="Previous" 
            @click="emits('setPage',pagination.previous_page != pagination.current_page ? pagination.previous_page : pagination.current_page)"       
            :disabled="pagination.previous_page == pagination.current_page ? true : false"
            href="#"
        >
            <span aria-hidden="true">&laquo;</span>
        </CPaginationItem>

        <template v-for="index in 3">
            <CPaginationItem 
                :key="`previousPagination${index}`"
                v-if="1 + index < pagination.current_page" 
                @click="emits('setPage',1 + index)" 
                href="#"
            >
                {{ pagination.max_page }}
            </CPaginationItem>
        </template>

        <CPaginationItem href="#" active>
            {{ pagination.current_page }}
        </CPaginationItem>

        <template v-for="index in 3">
            <CPaginationItem 
                :key="`nextPagination${index}`"
                v-if="pagination.current_page + index + 1 < pagination.max_page" 
                @click="emits('setPage',pagination.current_page + index + 1)" 
                href="#"
            >
                {{ pagination.max_page }}
            </CPaginationItem>
        </template>

        <CPaginationItem 
            aria-label="Next" 
            @click="emits('setPage',pagination.next_page != page && pagination.next_page <= pagination.max_page ? pagination.next_page : pagination.current_page)"       
            :disabled="pagination.next_page == pagination.current_page ? true : false"
            href="#"
        >
            <span aria-hidden="true">&raquo;</span>
        </CPaginationItem>
    </CPagination>
</template>