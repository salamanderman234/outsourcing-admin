<script setup>
    import {ref} from 'vue';
    import fetcher from '@/api/fetcher';
    import Cookies from 'js-cookie';
    import {useRouter} from 'vue-router';

    const router = useRouter()
    const emits = defineEmits(["toast", "submitOnLoad", "success"]);

    const email = ref("");
    const password = ref("");

    const emailError = ref("");
    const passwordError = ref("");

    const postUrl = "/login/";
    const formFailHandler = (json) => {
        const errors = json.errors;
        errors.forEach(error => {
            if(error.field == "email"){
                emailError.value = error.error;
            } else if (error.field == "password") {
                passwordError.value = error.error;
            }
        });
    }
    const formUnauthorizedHandler = (json) => {
        const detail = json.detail;
        emailError.value = detail;
        passwordError.value = detail;
    }

    const onSuccess = (json) => {
        const token = json.data.token;
        Cookies.set('session', token);
    }
    const push = async () => {
        const data = JSON.stringify({
            email: email.value,
            password: password.value
        });
        emits('submitOnLoad', true);
        const resp = await fetcher.fetch(postUrl, "POST", data);
        const json = await resp.json();
        emits('submitOnLoad', false);
        if((resp.status == 400 ) && json.errors) {
            formFailHandler(json);
        }
        if(resp.status == 401) {
            formUnauthorizedHandler(json);
        }
        if(resp.status == 200) {
            onSuccess(json);
            emits('success', true);
            router.push({name: 'categories'});
        }
        emits("toast", {
            "title": json.message,
            "content": resp.status == 200 ? 'berhasil login' : json.detail,
            "status": resp.status,
        });
    };
    defineExpose({
        push,
    });
</script>

<template>
    <CInputGroup>
        <CInputGroupText :class="emailError ? 'border-danger' : ''">
            <CIcon icon="cil-user" />
        </CInputGroupText>
        <CFormInput
            placeholder="Email"
            autocomplete="email"
            v-model="email"
            :class="emailError ? 'border-danger' : ''"
        />
    </CInputGroup>
    <small v-if="emailError" class="d-block text-end text-danger ">
        {{ emailError }}
    </small>
    <CInputGroup class="mt-3">
        <CInputGroupText :class="passwordError ? 'border-danger' : ''">
            <CIcon icon="cil-lock-locked" />
        </CInputGroupText>
        <CFormInput
            type="password"
            placeholder="Password"
            autocomplete="current-password"
            v-model="password"
            :class="passwordError ? 'border-danger' : ''"
        />
    </CInputGroup>
    <small v-if="emailError" class="d-block text-end text-danger ">
        {{ emailError }}
    </small>
</template>