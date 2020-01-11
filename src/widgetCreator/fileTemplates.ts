import { slug as generateSlug } from 'slug-gen';

interface IPackageJsonInput {
  title: string;
  subtitle: string;
  type: 'vue' | 'react';
  description: string;
  active: boolean;
  width: number;
  height: number;
}

export const PACKAGE_JSON = ({
  title,
  subtitle,
  type,
  description,
  active,
  width,
  height,
}: IPackageJsonInput): string => {
  const widgetPackage = {
    glitter: {
      title,
      slug: generateSlug(title),
      subtitle,
      description,
      version: '1.0.0',
      type,
      active,
      width,
      height,
    },
  };

  return JSON.stringify(widgetPackage, null, 2);
};

export const WIDGET_VUE = (): string => {
  return `<template>
  <div class="widget">
    Welcome to Glitter. I am your new widget :)
  </div>
</template>

<script>
import 'normalize.css';

export default {
  name: 'HelloWorldWidget'
};
</script>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
}
</style>

<style scoped>
.widget {
  background-color: rgba(15, 26, 41, 0.7);
  color: #fff;
  font-family: Helvetica, Arial, Helvetica, sans-serif;
  min-height: 100vh;
  padding: 16px;
}
</style>
`;
};

export const INDEX_VUE = (): string => {
  return `import Vue from 'vue/dist/vue.common.js';
import Widget from './Widget.vue';

const App = new Vue({
  el: '#app',
  components: {
    Widget,
  },
  template: '<Widget/>',
});
`;
};

export const WIDGET_REACT = (): string => {
  return `import React from 'react';
import 'normalize.css';
import './widget.css';

const Widget = () => {
  return (
    <div className="widget">
      Welcome to Glitter. I am your new widget :)
    </div>
  );
};

export default Widget;
`;
};

export const CSS_REACT = (): string => {
  return `*,
*::before,
*::after {
  box-sizing: border-box;
}

.widget {
  background-color: rgba(15, 26, 41, 0.7);
  color: #fff;
  font-family: Helvetica, Arial, Helvetica, sans-serif;
  min-height: 100vh;
  padding: 16px;
}
`;
};

export const INDEX_REACT = (): string => {
  return `import React from 'react';
import ReactDOM from 'react-dom'
import 'normalize.css';
import Widget from './Widget.jsx';

const App = () => {
  return <Widget/>
}

ReactDOM.render(<App />, document.getElementById('app'));
`;
};

export const INDEX_HTML = ({ type }: { type: string }): string => {
  return `<html>
  <body>
    <div id="app"></div>
    <script src="./index.${type === 'react' ? 'jsx' : 'js'}"></script>
  </body>
</html>`;
};
