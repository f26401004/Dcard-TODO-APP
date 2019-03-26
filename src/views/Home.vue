<template lang="pug">
  div(class="home_root")
    section(class="personal_info_section")
      div
        h1 Hello, {{username !== '' ? username : '新用戶'}}
        time {{currentDate.toString().substr(0, 24)}}
        p How is it going today?
      div
        button(class="default_button") New
        button(class="default_button" v-on:click="addType") Create Type
    section(class="type_section" v-bind:data-number="types.length > 0 ? 'true' : 'false'")
      type-card(v-for="(iter, index) of types"
        v-bind:key="`type-card-${iter}-${index}`"
        v-bind:name="iter"
        v-bind:number="filterType(iter).length"
      )
</template>

<script>
import { mapState } from 'vuex'
import { setInterval } from 'timers'
import TypeCard from '@/components/TypeCard.vue'

export default {
  name: 'home',
  components: {
    TypeCard
  },
  data: function () {
    return {
      currentDate: new Date()
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
        await this.$store.dispatch('addType', type)
      } catch (error) {
        console.log(error)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

  .home_root {
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

        h1 {
          font-size: 28px;
          font-weight: 700;
          margin: 0;
          padding: 0;
        }

        time {
          font-size: 18px;
          font-weight: 400;
        }

        p {
          font-size: 14px;
          font-weight: 400;
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
</style>
