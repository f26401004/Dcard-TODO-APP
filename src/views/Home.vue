<template lang="pug">
  div(class="home_page_root")
    section(class="personal_info_section default_fadein_animation")
      div
        h1 Hello, {{username !== '' ? username : '新用戶'}}
        time {{currentDate.toString().substr(0, 24)}}
        p(v-bind:class="{'network_error': !$store.getters.getOnlineStatus}") {{this.$store.getters.getOnlineStatus ? 'How is it going today?' : 'You are offline, please check network connection'}}
        button(class="slight_button" v-on:click="logout") Logout
      div
        button(class="default_button" v-on:click="openNewModel") New
        button(class="default_button" v-on:click="addType") Create Type
    transition-group(
      class="type_section"
      v-bind:data-number="types.length > 0 ? 'true' : 'false'"
      tag="section"
      name="slide-in"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      appear
    )
      type-card(v-for="(iter, index) of types"
        v-bind:key="`type-card-${iter}`"
        v-bind:data-index="index"
        v-bind:name="iter"
        v-bind:number="filterType(iter).length"
        v-on:click.native="route(iter)"
        v-longpress="() => openOperationModal(iter)"
      )
    modal(v-show="displayCreateModal")
      section(slot="header" class="default_modal_header")
        h4 New Todo:
      div(slot="main" class="create_todo_main_container")
        section(class="default_form_section")
          label Name:
          input(type="text" v-model="bufferTodo.name" class="default_form_input")
        section(class="textarea_form_section")
          label Description:
          textarea(v-model="bufferTodo.description" class="default_form_textarea")
        section(class="default_form_section")
          label type:
          select(v-model="bufferTodo.type")
            option(v-for="(iter, index) of types" v-bind:key="`todo-type-${iter}-${index}`" v-bind:value="iter") {{iter}}
        section(class="default_form_section")
          label Deadline:
          input(type="date" class="default_form_input" v-model="bufferTodo.deadline")
      section(slot="footer" class="create_todo_footer_section")
        button(class="default_button" v-on:click="displayCreateModal = false") Cancel
        button(class="default_button" v-on:click="newTodo") New
    modal(v-show="displayOperationModal")
      section(slot="header" class="default_modal_header")
        h4 For this item: {{bufferType}}
      div(slot="main")
      section(slot="main" class="operation_modal_main_container")
        button(class="slight_button" v-on:click="removeType") Remove
        button(class="slight_button" v-on:click="displayOperationModal = false") Cancel
</template>

<script>
import { mapState } from 'vuex'
import { setInterval } from 'timers'
import TypeCard from '@/components/TypeCard.vue'
import Modal from '@/components/Modal.vue'

export default {
  name: 'home',
  components: {
    TypeCard,
    Modal
  },
  data: function () {
    return {
      currentDate: new Date(),
      displayCreateModal: false,
      displayOperationModal: false,
      bufferTodo: {
        name: '',
        description: '',
        type: '',
        deadline: ''
      },
      bufferType: ''
    }
  },
  computed: {
    ...mapState({
      username: state => state.username,
      list: state => state.list,
      types: state => state.types
    })
  },
  mounted: function () {
    const self = this
    setInterval(function () {
      self.currentDate = new Date()
    }, 1000)
  },
  methods: {
    route: function (iter) {
      this.$router.push(`/list/${iter}`)
    },
    filterType: function (type) {
      return this.list.filter(target => target.type === type && target.completed === false)
    },
    logout: async function () {
      try {
        await this.$store.dispatch('logout')
        this.$router.push({ path: '/login' })
      } catch (error) {
        console.log(error)
      }
    },
    addType: async function () {
      try {
        const type = prompt('Please enter the new type name', 'new type name')
        if (type === null || type === '') {
          return
        }
        const status = await this.$store.dispatch('addType', type.toLowerCase())
        if (status) {
          this.$notify({
            group: 'system-primary',
            title: 'System Message',
            text: `Add ${type.toUpperCase()} type success!!`,
            duration: 5000
          })
        } else {
          this.$notify({
            group: 'system-danger',
            title: 'System Message',
            text: `Add ${type.toUpperCase()} type failed!!`,
            duration: 5000
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    removeType: async function () {
      try {
        this.displayOperationModal = false
        const status = await this.$store.dispatch('removeType', this.bufferType)
        if (status) {
          this.$notify({
            group: 'system-primary',
            title: 'System Message',
            text: `Remove ${this.bufferType} type success!!`,
            duration: 5000
          })
        } else {
          this.$notify({
            group: 'system-danger',
            title: 'System Message',
            text: `Remove ${this.bufferType} type failed!!`,
            duration: 5000
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    openOperationModal: function (type) {
      this.bufferType = type
      this.displayOperationModal = true
    },
    openNewModel: function () {
      if (this.types.length === 0) {
        alert('Please create todo type first!!')
        return
      }
      this.bufferTodo = {
        name: '',
        description: '',
        type: '',
        deadline: ''
      }
      this.displayCreateModal = true
    },
    newTodo: async function () {
      if (this.bufferTodo.name === '') {
        alert('Todo must be named!!')
        return
      }
      if (this.bufferTodo.description === '') {
        alert('Todo must be described!!')
        return
      }
      if (this.bufferTodo.deadline === '') {
        alert('Todo must set a deadline!!')
        return
      }
      try {
        this.displayCreateModal = false
        const targetDate = new Date(this.bufferTodo.deadline)
        if (targetDate < new Date()) {
          alert('The deadline should be after today!!')
          return
        }
        this.bufferTodo.createdAt = new Date()
        this.bufferTodo.completed = false
        const status = await this.$store.dispatch('addTodo', this.bufferTodo)
        if (status) {
          this.$notify({
            group: 'system-primary',
            title: 'System Message',
            text: `Add ${this.bufferTodo.name} todo success!!`,
            duration: 5000
          })
        } else {
          this.$notify({
            group: 'system-danger',
            title: 'System Message',
            text: `Add ${this.bufferTodo.name} todo failed!!`,
            duration: 5000
          })
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

  .home_page_root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 40% calc(60% - 20px);
    grid-template-areas: "banner"
      "type";
    grid-row-gap: 20px;
    justify-content: center;
    justify-items: center;
    align-content: flex-start;
    align-items: flex-start;
    width: 100%;
    height: 100%;
    background-color: #FAFAFA;

    padding: 30px;
    box-sizing: border-box;

    & > section:nth-child(1) {
      grid-area: banner;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: 2fr 1fr;
      grid-template-areas: "info"
        "operation";
      grid-row-gap: 20px;
      justify-content: center;
      justify-items: center;
      align-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      & > div:nth-child(1) {
        grid-area: info;
        display: grid;
        grid-template-columns: 1fr;
        grid-template-rows: 32px 20px 16px;
        grid-template-areas: "title"
          "time"
          "slogan";
        grid-row-gap: 12px;
        justify-content: center;
        justify-items: center;
        align-content: center;
        align-items: center;
        width: 100%;

        time {
          font-size: 18px;
          font-weight: 400;
        }

        p {
          width: 65%;
          opacity: 0.66;
          margin: 0;
          padding: 0;
          text-align: center;
        }
      }
      & > div:nth-child(2) {
        grid-area: operation;
        display: grid;
        grid-template-columns: 1fr 1fr;
        grid-template-rows: 1fr;
        grid-column-gap: 20px;
      }
    }

    & > section:nth-child(2) {
      grid-area: type;
      display: flex;
      flex-wrap: wrap;
      justify-content: flex-start;
      justify-items: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      width: 100%;
      height: 100%;
      overflow-y: auto;
      &[data-number="false"] {
        &:before {
          display: flex;
          content: 'No Type';
          width: 100%;
          height: 100%;
          justify-content: center;
          justify-items: center;
          align-content: center;
          align-items: center;
          font-size: 20px;
          font-weight: 700;
          opacity: 0.66;
        }
      }
    }
  }

  .create_todo_main_container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-auto-flow: row;
    grid-row-gap: 12px;

    padding: 12px 8px;
    box-sizing: border-box;
  }
  .create_todo_footer_section {
    display: grid;
    grid-template-columns: auto auto;
    grid-template-rows: 1fr;
    grid-column-gap: 12px;
    justify-content: flex-end;
    justify-items: flex-end;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
  }

  .operation_modal_main_container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 32px;
    grid-row-gap: 12px;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    width: 100%;
    padding: 12px 8px;
    box-sizing: border-box;
  }
  .network_error {
    color: #fa304d !important;
  }
</style>
