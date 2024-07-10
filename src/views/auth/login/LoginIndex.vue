<script setup>
	import {ref} from 'vue';
	import LoginForm from './forms/LoginForm.vue';	

	const loginForm = ref(null);
	const submitLoad = ref(false);

	const submit = () => {
		loginForm.value.push();
	}
</script>

<template>
    <div class="wrapper min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow class="justify-content-center">
          <CCol :md="8">
            <CCardGroup>
              <CCard class="p-4">
                <CCardBody>
                  <CForm>
                    <h1>Login</h1>
                    <p class="text-body-secondary">Masuk menggunakan akun yang terdaftar</p>
					<LoginForm ref="loginForm" @submitOnLoad="(isLoad) => submitLoad = isLoad" />
                    <CRow class="mt-4">
                      <CCol :xs="6">
                        <CButton @click="() => submit()" color="primary" class="px-4" :disabled="submitLoad"> 
							Login 
						</CButton>
                      </CCol>
                      <CCol :xs="6" class="text-right">
                        <CButton color="link" class="px-0" >
                          Lupa password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard class="text-white bg-primary py-5" style="width: 44%">
                <CCardBody class="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                    <CButton color="light" variant="outline" class="mt-3">
                      Register Now!
                    </CButton>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
</template>