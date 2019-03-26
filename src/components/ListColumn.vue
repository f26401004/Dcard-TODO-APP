<template lang="pug">
  div(class="todo_column_root")
</template>

<script>
export default {
  props: {
    title: String,
    description: String,
    deadline: Date,
    completed: Boolean
  }
}
</script>

<style lang="scss" scoped>
  .todo_column_root {
    
  }
</style>
