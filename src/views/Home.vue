<template lang="pug">
  div(class="home_page_root")
    section(class="personal_info_section")
      div
        h1 Hello, {{username !== '' ? username : '新用戶'}}
        time {{currentDate.toString().substr(0, 24)}}
        p How is it going today?
      div
        button(class="default_button" v-on:click="openNewModel") New
        button(class="default_button" v-on:click="addType") Create Type
    section(class="type_section" v-bind:data-number="types.length > 0 ? 'true' : 'false'")
      type-card(v-for="(iter, index) of types"
        v-bind:key="`type-card-${iter}-${index}`"
        v-bind:name="iter"
        v-bind:number="filterType(iter).length"
        v-on:click.native="test(iter)"
      )
    modal(v-show="displayModel")
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
        button(class="default_button" v-on:click="displayModel = false") Cancel
        button(class="default_button" v-on:click="newTodo") New
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
      displayModel: false,
      bufferTodo: {
        name: '',
        description: '',
        type: '',
        deadline: ''
      }
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
    filterType: function (type) {
      return this.list.filter(target => target.type === type)
    },
    addType: async function () {
      try {
        const type = prompt('Please enter the new type name', 'new type name')
        if (type === null || type === '') {
          return
        }
        await this.$store.dispatch('addType', type.toLowerCase())
      } catch (error) {
        console.log(error)
      }
    },
    openNewModel: function () {
      this.bufferTodo = {
        name: '',
        description: '',
        type: '',
        deadline: ''
      }
      this.displayModel = true
    },
    newTodo: async function () {
      try {
        this.bufferTodo.createdAt = new Date()
        this.bufferTodo.completed = false
        await this.$store.dispatch('addTodo', this.bufferTodo)
        this.displayModel = false
      } catch (error) {
        console.log(error)
      }
    },
    test: function (iter) {
      this.$router.push('/list/' + iter)
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
          opacity: 0.66;
          margin: 0;
          padding: 0;
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
          content: 'No Types';
          width: 100%;
          height: 100%;
          justify-content: center;
          justify-items: center;
          align-content: center;
          align-items: center;
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
</style>
