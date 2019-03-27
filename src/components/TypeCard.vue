<template lang="pug">
  div(class="type_card_root")
    h4 {{name}}
    label {{number}}
</template>

<script>
export default {
  props: {
    name: String,
    number: Number
  }
}
</script>

<style lang="scss" scoped>
  .type_card_root {
    display: grid;
    grid-template-columns: 72px 24px;
    grid-template-rows: 1fr;
    grid-template-areas: "name number";
    grid-column-gap: 12px;
    justify-content: flex-start;
    justify-items: flex-start;
    align-content: center;
    align-items: center;
    width: 140px;
    height: 60px;
    background-color: white;

    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.08);
    padding: 0 16px;
    margin: 8px;
    box-sizing: border-box;

    h4 {
      grid-area: name;
      width: 100%;
      overflow: hidden;
      word-break: break-word;
      text-overflow: ellipsis;
      text-align: left;
    }
    label {
      grid-area: number;
      justify-self: flex-end;
      font-size: 16px;
      font-weight: 400;
    }
  }
</style>
