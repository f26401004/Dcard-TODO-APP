<template lang="pug">
  div(class="login_page_root")
    img(src="@/assets/logo.png" class="default_fadein_animation")
    p(class="default_fadein_animation") Start to schedule
    form(v-on:submit="login")
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
        section(class="default_form_section" key="email-section" v-bind:data-index="0")
          label E-mail
          input(type="email" v-model="email" class="default_form_input")
        section(class="default_form_section" key="password-section" v-bind:data-index="1")
          label Password
          input(type="password" v-model="password" autocomplete class="default_form_input")
        section(v-bind:data-index="2" key="operation-section" )
          router-link(tag="a" to="/register") register
          button(type="submit" class="default_button") Login
</template>

<script>
export default {
  data: function () {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    login: async function () {
      try {
        const status = await this.$store.dispatch('login', {
          email: this.email,
          password: this.password
        })
        if (status) {
          this.$router.push('/home')
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
  .login_page_root {
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
      width: 65%;
      div {
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 1fr 1fr 1fr;
        grid-template-areas: "email"
          "password"
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
          grid-area: password;
        }
        & > section:nth-child(3) {
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
