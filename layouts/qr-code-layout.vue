<template>
  <div class="qr-code-layout">
    <div id="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.qr-code-layout {
  width: 100%;
  height: 100vh;
  #main-content {
    width: 100%;
    height: 100%;
    padding: 10px 40px;
    position: relative;
    overflow-y: scroll;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
