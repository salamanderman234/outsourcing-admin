<script setup>
    import {ref} from 'vue';
    import { CContainer } from '@coreui/vue';
    import AppFooter from '@/components/AppFooter.vue';
    import AppHeader from '@/components/AppHeader.vue';
    import AppSidebar from '@/components/AppSidebar.vue';

    const toasts = ref([]);
</script>

<template>
  <div>
    <AppSidebar />
    <div class="wrapper d-flex flex-column min-vh-100">
      <AppHeader />
      <div class="body flex-grow-1">
        <CToaster class="p-3" placement="top-end">
          <CToast v-for="(toast, index) in toasts" visible :key="index">
              <CToastHeader closeButton>
                <span class="me-auto fw-bold">{{toast.status}} - {{toast.title}}</span>
                <small>sekarang</small>
              </CToastHeader>
              <CToastBody>
                {{ toast.content }}
              </CToastBody>  
          </CToast>
        </CToaster>
        <CContainer class="px-4" lg>
          <router-view @toast="(data) => toasts.push(data)" />
        </CContainer>
      </div>
      <AppFooter />
    </div>
  </div>
</template>
