<template lang="pug">
  div(class="register_page_root")
    img(src="@/assets/logo.png")
    p slogan here
    form(class="login_form" v-on:submit="register")
      section(class="default_form_section")
        label E-mail
        input(type="email" v-model="email" class="default_form_input")
      section(class="default_form_section")
        label Username
        input(type="text" v-model="username" class="default_form_input")
      section(class="default_form_section")
        label Password
        input(type="password" v-model="password" class="default_form_input")
      section(class="default_form_section")
        label Confirm Password
        input(type="password" v-model="confirmPassword" class="default_form_input")
      section
        router-link(tag="a" to="/login") exist an account?
        button(type="submit" class="default_button") Register
</template>

<script>
export default {
  data: function () {
    return {
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    }
  },
  methods: {
    register: async function () {
      try {
        const status = await this.$store.dispatch('register', {
          email: this.email,
          username: this.username,
          password: this.password
        })
        if (status) {
          this.$router.push('/login')
        }
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .register_page_root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 200px 40px 1fr;
    grid-template-areas: "icon"
      "slogan"
      "form";
    grid-row-gap: 30px;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 60%;
    img {
      grid-area: icon;
      width: 200px;
      height: 200px;
    }
    h4 {
      grid-area: slogan;
    }
    form {
      grid-area: form;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr 1fr;
      grid-template-areas: "email"
        "username"
        "password"
        "confirmPassword"
        "operation";
      grid-row-gap: 20px;
      justify-content: flex-start;
      justify-items: flex-start;
      align-content: center;
      align-items: center;

      width: 70%;

      & > section:nth-child(1) {
        grid-area: email;
      }
      & > section:nth-child(2) {
        grid-area: username;
      }
      & > section:nth-child(3) {
        grid-area: password;
      }
      & > section:nth-child(4) {
        grid-area: confirmPassword;
      }
      & > section:nth-child(5) {
        grid-area: operation;
        justify-self: flex-end;

        a {
          font-size: 16px;
          font-weight: 400;
          margin: 0 12px;
        }
      }
    }
  }
</style>
