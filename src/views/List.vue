<template lang="pug">
  div(class="list_page_root")
    h1 {{$route.params.type.toUpperCase()}}
    section
      button(v-bind:class="{current: filter === 0}" v-on:click="filter = 0") Not-completed
      button(v-bind:class="{current: filter === 1}" v-on:click="filter = 1") Completed
      button(v-bind:class="{current: filter === 2}" v-on:click="filter = 2") Exceeded
    section
      list-column(v-for="(iter, index) of allTodos" v-bind:key="`list-column-${iter}-${index}`"
        v-bind:name="iter.name"
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
        button(class="slight_button" v-on:click="openModifyModal") Modify
        button(class="slight_button" v-on:click="removeTodo") Remove
        button(class="slight_button" v-on:click="completeTodo") Complete
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
      if (this.filter === 2) {
        return
      }
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
        await this.$store.dispatch('modifyTodo', this.bufferTodo)
        this.displayModifyModal = false
        this.displayOperationModal = false
        this.$router.go(0)
      } catch (error) {
        console.log(error)
      }
    },
    removeTodo: async function () {
      try {
        await this.$store.dispatch('removeTodo', this.allTodos[this.currentIndex].tid)
        this.displayOperationModal = false
      } catch (error) {
        console.log(error)
      }
    },
    completeTodo: async function () {
      try {
        const target = this.allTodos[this.currentIndex]
        target.completed = true
        await this.$store.dispatch('modifyTodo', target)
        this.displayOperationModal = false
      } catch (error) {
        console.log(error)
      }
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
    }
  }
  .current {
    color: #3092fa !important;
    border-bottom: 3px solid #3092fa !important;
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
