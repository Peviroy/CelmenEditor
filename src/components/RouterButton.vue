<template>
  <div id="flex">
    <a href="#0" class="bttn" :style="innerstyle">
      <slot></slot>
    </a>
  </div>
</template>

<script>
export default {
  name: 'RouterButton',
  props: {
    innerstyle: Object,
  },
};
</script>

<style>
:root {
  --font: Helvetica Neue, Helvetica, Microsoft YaHei, Arial, sans-serif;
  --primary: #b15947;
  --secondary: #f1481b;
  --animation: 0.3s all ease;
}

#flex *,
#flex *::before,
#flex *::after {
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  box-sizing: border-box;
}

#flex a {
  color: #333;
  text-decoration: none;
  transition: var(--animation);
}
#flex a:hover {
  color: var(--primary);
}
#flex a:focus {
  text-decoration: none;
}
#flex a:active {
  color: #fff;
}
body {
  margin: 0;
  font-family: var(--font);
  background: #f4f5ee;
  -webkit-font-smoothing: antialiased;
}

#flex {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

#flex .bttn {
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: bold;
  position: relative;

  margin: 100px;
}
#flex .bttn:after {
  transition: var(--animation);
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  border-radius: 3px;
  border: 3px solid var(--primary);
}

#flex .bttn:hover:after {
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

#flex .bttn:before {
  content: '';
  position: absolute;
  border-radius: 3px;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
  background: #fff;
  z-index: -1;
}

#flex .bttn:active {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
#flex .bttn:active:before {
  background-color: var(--secondar);
}

#flex .bttn:active:after {
  border-color: var(--secondary);
}
</style>
