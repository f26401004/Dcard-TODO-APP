<template lang="pug">
  div(class="register_page_root")
    img(src="@/assets/logo.png" class="default_fadein_animation")
    p(class="default_fadein_animation") slogan here
    form(v-on:submit="register")
      transition-group(
        tag="div"
        class="login_form"
        name="slide-in"
        v-bind:css="false"
        v-on:before-enter="beforeEnter"
        v-on:enter="enter"
        v-on:leave="leave"
        appear
      )
        section(class="default_form_section"  key="email-section" v-bind:data-index="0")
          label E-mail
          input(type="email" v-model="email" class="default_form_input" required)
        section(class="default_form_section"  key="username-section" v-bind:data-index="1")
          label Username
          input(type="text" v-model="username" class="default_form_input" required)
        section(class="default_form_section"  key="password-section" v-bind:data-index="2")
          label Password
          input(type="password" v-model="password" autocomplete class="default_form_input" required)
        section(class="default_form_section"  key="confirm-section" v-bind:data-index="3")
          label Confirm Password
          input(type="password" v-model="confirmPassword" autocomplete class="default_form_input" required)
        section(key="operation-section" v-bind:data-index="4")
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
        if (this.password !== this.confirmPassword) {
          alert('The confirm password is not equal to password!!')
          return
        }
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
    },
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transform = 'translateY(20px)'
    },
    enter: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        el.style.opacity = 1
        el.style.transform = 'translateY(0px)'
      }, delay)
    },
    leave: function (el, done) {
      var delay = el.dataset.index * 200
      setTimeout(function () {
        el.style.opacity = 0
        el.style.transform = 'translateY(20px)'
      }, delay)
      done()
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
      width: 70%;
      div {
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
  }
</style>
