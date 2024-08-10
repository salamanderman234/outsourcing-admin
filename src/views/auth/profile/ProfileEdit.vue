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

</template>