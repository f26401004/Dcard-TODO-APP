<template lang="pug">
  div(id="app")
    router-view
</template>

<style lang="scss">

body {
  overflow: hidden;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

  display: flex;
  justify-content: center;
  justify-items: center;
  align-content: center;
  align-items: center;
  width: 100vw;
  height: 100vh;
}
</style>
