<template>
  <q-page id="mainpage" :style="'min-height: ' + getHeight()">

    <div class="container">      
      <p class="texto">Sistema Gestor NTC - um produto </p>
    </div>
    

  </q-page>  
</template>

<script>

  export default {

    methods: {
      getHeight() {
        return (window.innerHeight - 70) + "px";
      }
    }

  }

</script>

<style>

#mainpage.q-page {
  background-color: white;
  /* text-align: center; */
  min-height: 684px;
  position: relative;
}
.container {
  margin: 0;
  position: absolute;
  top: 20%;
  text-align: center;
}

.logo{
  display: inline-block;
  width: 50%;
} 

.logoFc {
  position: absolute;
  width: 80px;
  padding: 0;
  margin-top: -4px;
  margin-left: 4px;
  justify-content: end;
  
} 

.texto{
  padding: 0;
  text-align: center;
}

</style>