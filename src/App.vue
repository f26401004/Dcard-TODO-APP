<template lang="pug">
  div(id="app")
    router-view
    notifications(group="system-primary" classes="notification notification_primary" position="bottom center")
    notifications(group="system-danger" classes="notification notification_danger" position="bottom center")
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

.notification {
  background-color: white;
  padding: 12px 24px;
  border-radius: 4px;
  margin-bottom: 30px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.16);
  border: 1px solid #d5d5d5;
}
.notification_primary {
  color: #3092fa;
}

.notification_danger {
  color: #fa304d;
}
</style>
