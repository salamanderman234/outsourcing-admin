<script setup>
  import avatar from '@/assets/images/avatars/8.jpg';
  import apiConfig from '@/api/apiConfig';
  import { useRouter } from 'vue-router';
import { cilUser } from '@coreui/icons';

  const router = useRouter();
  const logout = () => {
    localStorage.removeItem("user");
    router.push("/login");
  }
  
  const props = defineProps({
    user: {
      type: Object,
      required: true,
    }
  });
  const pp = props.user ? props.user.profile_pic ? `${apiConfig.baseUrl}/resource/users/${props.user.id}/profile/` : avatar : avatar;
</script>

<template>
  <CDropdown placement="bottom-end" variant="nav-item">
    <CDropdownToggle class="py-0 pe-0" :caret="false">
      <CAvatar :src="pp" size="md" />
    </CDropdownToggle>
    <CDropdownMenu class="pt-0">
      <CDropdownHeader
        component="h6"
        class="bg-body-secondary text-body-secondary fw-semibold mb-2 rounded-top"
      >
        {{ user.role == "super_admin" ? "Super Admin" : "Admin" }}
      </CDropdownHeader>
      <CDropdownItem> 
        <CIcon :icon="cilUser" class="me-2" />
        {{ user.email }}
      </CDropdownItem>
      <!-- <CDropdownItem> 
        <CIcon icon="cil-user" /> Profile 
      </CDropdownItem> -->
      <CDropdownDivider />
      <CDropdownItem @click="() => logout()"> 
        <CIcon icon="cil-lock-locked" /> Logout 
      </CDropdownItem>
    </CDropdownMenu>
  </CDropdown>
</template>
