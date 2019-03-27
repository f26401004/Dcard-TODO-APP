<template lang="pug">
  div(class="modal_root")
    div(class="modal_wrapper" v-bind:data-footer="$slots.footer ? 'true' : 'false'")
      slot(name="header")
      span
      slot(name="main")
      span(v-if="$slots.footer")
      slot(v-if="$slots.footer" name="footer")
</template>

<script>
export default {

}
</script>

<style lang="scss" scoped>
  .modal_root {
    position: absolute;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-content: center;
    align-items: center;
    width: 100%;
    height: 100%;

    background-color: rgba(0, 0, 0, 0.36);

    .modal_wrapper[data-footer="true"] {
      grid-template-rows: 50px 1px 1fr 1px 50px;
      grid-template-areas: "header"
        "dividerUpper"
        "main"
        "dividerLower"
        "footer";
    }
    .modal_wrapper[data-footer="false"] {
      grid-template-rows: 50px 1px 1fr;
      grid-template-areas: "header"
        "dividerUpper"
        "main";
    }
    .modal_wrapper {
      display: grid;
      grid-template-columns: 1fr;
      justify-content: flex-start;
      justify-items: flex-start;
      align-content: flex-start;
      align-items: flex-start;
      width: 65%;
      background-color: white;

      box-shadow: 0 4px 6px rgba(0, 0, 0 ,0.16);
      border: 1px solid #D5D5D5;
      border-radius: 12px;
      padding: 8px 24px;

      & > span:nth-child(2) {
        grid-area: dividerUpper;
      }
      & > span {
        width: 100%;
        height: 100%;

        background-color: #D5D5D5;
      }
    }
  }
</style>
