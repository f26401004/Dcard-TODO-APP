<template lang="pug">
  div(class="list_page_root")
    h1 {{$route.params.type.toUpperCase()}}
    section
      button(v-bind:class="{current: filter === 0}" v-on:click="filter = 0") Not-completed
      button(v-bind:class="{current: filter === 1}" v-on:click="filter = 1") Completed
      button(v-bind:class="{current: filter === 2}" v-on:click="filter = 2") Exceed
    section
      list-column(v-for="(iter, index) of allTodos" v-bind:key="`list-column-${iter}-${index}`"
        v-bind:name="iter.name"
        v-bind:description="iter.description"
        v-bind:deadline="new Date(iter.deadline)"
        v-bind:createdAt="iter.createdAt.toDate()"
        v-bind:completed="iter.completed"
        v-on:click.native="displayModal = true; currentIndex = index"
      )

    modal(v-show="displayModal")
      section(slot="header" class="default_modal_header")
        h4 For this item:
      div(slot="main")
      section(slot="main" class="operation_modal_main_container")
        button(class="slight_button" v-on:click="displayModal = false") Cancel
        button(class="slight_button" v-on:click="removeTodo") Remove
        button(class="slight_button" v-on:click="completeTodo") Complete

</template>

<script>
import ListColumn from '@/components/ListColumn.vue'
import Modal from '@/components/Modal.vue'

export default {
  components: {
    ListColumn,
    Modal
  },
  data: function () {
    return {
      filter: 0,
      displayModal: false,
      currentIndex: -1
    }
  },
  computed: {
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
    removeTodo: async function () {
      try {
        await this.$store.dispatch('removeTodo', this.allTodos[this.currentIndex].tid)
        this.displayModal = false
      } catch (error) {
        console.log(error)
      }
    },
    completeTodo: async function () {
      try {
        const target = this.allTodos[this.currentIndex]
        target.completed = true
        await this.$store.dispatch('modifyTodo', target)
        this.displayModal = false
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
</style>
