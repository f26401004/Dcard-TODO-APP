<template lang="pug">
  div(class="list_page_root")
    h1 {{$route.params.type.toUpperCase()}}
    section(class="default_fadein_animation")
      button(v-bind:class="{current: filter === 0}" v-on:click="filter = 0") Not-completed
      button(v-bind:class="{current: filter === 1}" v-on:click="filter = 1") Completed
      button(v-bind:class="{current: filter === 2}" v-bind:data-exceeded="true" v-on:click="filter = 2") Exceeded
    transition-group(
      tag="section"
      name="slide-in"
      v-bind:css="false"
      v-on:before-enter="beforeEnter"
      v-on:enter="enter"
      v-on:leave="leave"
      v-bind:data-number="allTodos.length > 0 ? 'true' : 'false'"
      appear
    )
      list-column(v-for="(iter, index) of allTodos" v-bind:key="`list-column-${iter}-${index}`"
        v-bind:name="iter.name"
        v-bind:data-index="index"
        v-bind:description="iter.description"
        v-bind:deadline="new Date(iter.deadline)"
        v-bind:createdAt="iter.createdAt.toDate()"
        v-bind:completed="iter.completed"
        v-on:click.native="openOperationModal(index)"
        v-bind:emergency="filter === 0 && index === 0"
      )

    modal(v-show="displayOperationModal")
      section(slot="header" class="default_modal_header")
        h4 For this item: {{bufferTodo.name}}
      div(slot="main")
      section(slot="main" class="operation_modal_main_container")
        button(v-show="filter === 0" class="slight_button" v-on:click="openModifyModal") Modify
        button(class="slight_button" v-on:click="removeTodo") Remove
        button(v-show="filter === 0" class="slight_button" v-on:click="completeTodo") Complete
        button(class="slight_button" v-on:click="displayOperationModal = false") Cancel
    modal(v-show="displayModifyModal")
      section(slot="header" class="default_modal_header")
        h4 Modify Todo: {{bufferTodo.name}}
      div(slot="main" class="modify_todo_main_container")
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
      section(slot="footer" class="modify_todo_footer_section")
        button(class="default_button" v-on:click="displayModifyModal = false; displayOperationModal = true") Cancel
        button(class="default_button" v-on:click="modifyTodo") Modify

</template>

<script>
import ListColumn from '@/components/ListColumn.vue'
import Modal from '@/components/Modal.vue'
import { mapState } from 'vuex'

export default {
  components: {
    ListColumn,
    Modal
  },
  data: function () {
    return {
      filter: 0,
      displayOperationModal: false,
      displayModifyModal: false,
      currentIndex: -1,
      bufferTodo: {}
    }
  },
  computed: {
    ...mapState({
      types: state => state.types
    }),
    allTodos: function () {
      return this.$store.getters.getTodos
        .filter(target => target.type === this.$route.params.type)
        .filter(target => {
          if (this.filter === 2) {
            return new Date(target.deadline) - new Date() < 0
          }
          return new Date(target.deadline) - new Date() > 0
        })
        .filter(target => target.completed === (this.filter === 1))
        .sort((a, b) => (new Date(a.deadline) - new Date(b.deadline)))
    }
  },
  methods: {
    openOperationModal: function (index) {
      this.displayOperationModal = true
      this.currentIndex = index
      this.bufferTodo = Object.assign({}, this.allTodos[this.currentIndex])
    },
    openModifyModal: function () {
      this.displayOperationModal = false
      this.displayModifyModal = true
    },
    modifyTodo: async function () {
      try {
        this.displayModifyModal = false
        this.displayOperationModal = false
        const status = await this.$store.dispatch('modifyTodo', this.bufferTodo)
        if (status) {
          this.$notify({
            group: 'system-primary',
            title: 'System Message',
            text: `Modify todo success!!`,
            duration: 5000
          })
        } else {
          this.$notify({
            group: 'system-danger',
            title: 'System Message',
            text: `Modify todo failed!!`,
            duration: 5000
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    removeTodo: async function () {
      try {
        const targetName = this.allTodos[this.currentIndex].name
        this.displayOperationModal = false
        const status = await this.$store.dispatch('removeTodo', this.allTodos[this.currentIndex].tid)
        if (status) {
          this.$notify({
            group: 'system-primary',
            title: 'System Message',
            text: `Remove ${targetName} todo success!!`,
            duration: 5000
          })
        } else {
          this.$notify({
            group: 'system-danger',
            title: 'System Message',
            text: `Remove ${targetName} todo failed!!`,
            duration: 5000
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    completeTodo: async function () {
      try {
        const target = this.allTodos[this.currentIndex]
        target.completed = true
        const targetName = target.name
        this.displayOperationModal = false
        const status = await this.$store.dispatch('modifyTodo', target)
        if (status) {
          this.$notify({
            group: 'system-primary',
            title: 'System Message',
            text: `Complete ${targetName} todo success!!`,
            duration: 5000
          })
        } else {
          this.$notify({
            group: 'system-danger',
            title: 'System Message',
            text: `Complete ${targetName} todo failed!!`,
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
        // disable event
        el.style.pointerEvents = 'none'
      }, delay)
      done()
    }
  }
}
</script>

<style lang="scss" scoped>
  .list_page_root {
    position: relative;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 32px 32px 1fr;
    grid-template-areas: "title"
      "type"
      "list";
    grid-row-gap: 24px;
    width: 100%;
    height: 100%;

    background-color: #FAFAFA;

    padding: 30px;
    box-sizing: border-box;

    & > h4 {
      grid-area: title;
    }
    & > section:nth-child(2) {
      grid-area: type;
      display: grid;
      grid-template-columns: repeat(auto-fit, auto);
      grid-template-rows: 1fr;
      grid-auto-flow: column;
      grid-column-gap: 12px;
      width: 100%;
      & > button {
        background-color: transparent;
        border: none;
        outline: none;
      }
    }
    & > section:nth-child(3) {
      grid-area: list;
      display: grid;
      grid-template-columns: 1fr;
      grid-template-rows: repeat(auto-fill, 138px);
      grid-auto-flow: row;
      grid-row-gap: 12px;
      width: 100%;
      height: 495px;

      overflow-y: auto;
      &[data-number="false"] {
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
          position: relative;
          justify-content: center;
          justify-items: center;
          align-content: center;
          align-items: center;
          &:before {
            position: absolute;
            display: block;
            content: 'No Todo';
            font-size: 20px;
            font-weight: 700;
            opacity: 0.66;
          }
        }
      }
    }
  }
  .current {
    color: #3092fa !important;
    border-bottom: 3px solid #3092fa !important;
    &[data-exceeded="true"] {
      color: #fa304d !important;
      border-bottom: 3px solid #fa304d !important;
    }
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
  .modify_todo_main_container {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 1fr;
    grid-auto-flow: row;
    grid-row-gap: 12px;

    padding: 12px 8px;
    box-sizing: border-box;
  }
  .modify_todo_footer_section {
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
