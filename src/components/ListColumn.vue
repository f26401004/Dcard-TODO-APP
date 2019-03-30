<template lang="pug">
  div(class="todo_column_root" v-bind:class="{'emergency': emergency}")
    section
      h4 {{name}}
      i(v-if="!completed")
    section
      p(ref="description")
    section
      label deadline
      time {{dateFormatter(deadline)}}
</template>

<script>
export default {
  props: {
    name: String,
    description: String,
    deadline: Date,
    createdAt: Date,
    completed: Boolean,
    emergency: Boolean
  },
  data: function () {
    return {
      isMounted: false,
      select: this.completed
    }
  },
  mounted: function () {
    const node = this.$refs.description
    node.innerHTML = this.description
    let word = node.innerHTML
    while (node.scrollHeight > node.offsetHeight) {
      word = word.substr(0, word.length - 1)
      node.innerHTML = word + '...'
    }
  },
  methods: {
    dateFormatter: function (target) {
      return `${target.getFullYear()}-${target.getMonth() + 1}-${target.getDate()}`
    }
  }
}
</script>

<style lang="scss" scoped>
  .todo_column_root {
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 18px 48px 24px;
    grid-template-areas: "header"
      "main"
      "footer";
    grid-row-gap: 8px;
    justify-content: flex-start;
    justify-items: flex-start;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 138px;

    background-color: white;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
    padding: 16px 24px;
    box-sizing: border-box;

    transition: opacity .3s ease-in-out, transform .3s ease-in-out;

    & > section:nth-child(1) {
      grid-area: header;
      display: grid;
      grid-template-columns: 1fr 24px;
      grid-template-rows: 1fr;
      grid-template-areas: "title checkbox";
      grid-column-gap: 12px;
      justify-content: flex-start;
      justify-items: flex-start;
      align-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      h4 {
        grid-area: title;
      }
      input {
        grid-area: checkbox;
      }
    }
    & > section:nth-child(2) {
      grid-area: main;
      display: flex;
      justify-content: flex-start;
      justify-items: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      width: 100%;
      height: 100%;
      p {
        width: 267px;
        height: 48px;
      }
    }
    & > section:nth-child(3) {
      grid-area: footer;
      display: grid;
      grid-template-columns: auto auto;
      grid-template-rows: 1fr;
      grid-template-areas: "title checkbox";
      grid-column-gap: 12px;
      justify-content: flex-end;
      justify-items: flex-end;
      align-content: center;
      align-items: center;
      width: 100%;
      height: 100%;

      time {
        width: 100px;
        height: 24px;
        background-color: #E0E2EE;
        border-radius: 12px;
        line-height: 24px;

        font-size: 14px;
        font-weight: 400;
      }
    }
  }
  .emergency {
    border: 1px solid #fa304d !important;
  }
</style>
