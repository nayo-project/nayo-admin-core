![nayo](https://raw.githubusercontent.com/Terencesun/nayo-admin-core/master/logo.jpg)


## Nayo Admin Framework Core
---

### 1.Introduction
The Nayo Admin Framwork is a way to help developer buid the admin system, it's supported by Vue.js and iView

---
nayo-project:
1. nayo - the simple operation interface for mongoDB by nodejs ---> [LINK](https://www.npmjs.com/package/nayo)
2. nayo-admin - the admin system Front-end solutions 
### 2.Install
```
npm install nayo-admin-core --save
```
### 3.Usage
```
// suppose that you have the vuex\route\lang config
vuex_config
route_config
lang_config

// import App.js, this is the vue app entrance-template
import App from "./App.js";

// import nayo-admin-core
import nayoCore from "nayo-admin-core";

// Vue.use
Vue.use(nayoCore);

// new nayoCore, we should put the App that we import to the first argument
// how ever, here has the second argument to set the option, we will talk about it later
// if you don's set the second argunment, the option will be default
const nayo = new nayoCore(App)

// regist the vuex\route\lang
// the register is only valid for the last registration
// if you don's regist those config, it will use the default value
nayo.storeRegister(vuex_config);
nayo.routerRegister(route_config);
nayo.langRegister(lang_config);

// mount the admin
nayo.admin.$mount("#app");
```
### 4.Class
```
class nayoAdmin(app_entrance, options)
```
argument | detail | defaut
- | - | -
app_entrance | the Vue App entrance template | null
options | the options of vuex\router\lang(i18n) | default_options

```
default_options = {
    vuex: {
        state: {},
        actions: {},
        mutations: {},
        modules: {}
    },
    router: {
        mode: 'history',
        routes: []
    },
    lang: {
        locale: "en",
        messages: {},
        fallbackLocale: "en",
        silentFallbackWarn: true
    }
}
```

if you set the options, default options won't work, and the options you set needs to meet the following structure:
```
your_options = {
    vuex: {},
    router: {},
    lang: {}
}

// when you set one of the options' attribute, The corresponding attribute of default attribute will be invalid
// like this
// if you set
your_options = {
    vuex: {
        xxx: yyy
    }
}
// the final options will be
final_options = {
    vuex: {
        xxx: yyy
    },
    router: {
        mode: 'history',
        routes: []
    },
    lang: {
        locale: "en",
        messages: {},
        fallbackLocale: "en",
        silentFallbackWarn: true
    }
}
// as for vuex, you should not set the attribute of "state", "actions", "mutations", "modules"
// as for router, you should not set the attribute of "routes"
// as for lang(Vue-i18n), you should not set the attribute of "messages"
// if you set those attribute, they won't work, you should use register to regist them
```
All options are officially prescribed.

Vuex [Options-Guide](https://vuex.vuejs.org/api/#vuex-store-constructor-options)

Vue-Router [Options-Guide](https://router.vuejs.org/api/#router-link)

Vue-i18n [Options-Guide](http://kazupon.github.io/vue-i18n/api/#constructor-options)

### 4.Attribute
- $iView

The iView is mounted at window
```
// use $iView
window.$iView
```
- $nayo

$nayo is a tools box, you can use it to help you build admin

$nayo is mounted at window and vue prototype

**Tool List:**
1. underScore ----> https://underscorejs.org/
```
this.$nayo.utils.underScore
window.$nayo.utils.underScore
```
2. outils ----> https://www.npmjs.com/package/outils
```
this.$nayo.utils.outils
window.$nayo.utils.outils
```
3. cookie ----> https://www.npmjs.com/package/js-cookie
```
this.$nayo.utils.cookie
window.$nayo.utils.cookie
```
4. moment ----> https://www.npmjs.com/package/moment
```
this.$nayo.time.moment
window.$nayo.time.moment
```
5. moment-timezone ----> https://www.npmjs.com/package/moment-timezone
```
this.$nayo.time.momentTz
window.$nayo.time.momentTz
```
6. axios ----> https://www.npmjs.com/package/axios
```
this.$nayo.axios
window.$nayo.axios
```

- Vuex

you can use the traditional interface, like
```
this.$store.state

etc... see more in their document
```
- Vue-Router
you can use the traditional interface, like
```
this.$route
this.$router

etc... see more in their document
```
- Vue-i18n
you can use the traditional interface, like
```
this.$i18n
this.$t

etc... see more in their document
```
### 5.Method

Notic: nayo is the nayo-admin-core's instance object
- nayo.storeRegister(options)   ---> regist the vuex store data and method
```
// options struction
options = {
    state: {...},
    actions: {...},
    mutations: {...},
    modules: {...}
}

// The attributes in options are consistent with the core concepts of vuex
// https://vuex.vuejs.org/guide/state.html
```

- nayo.routerRegister(options)  ---> regist the router's routes
```
// options struction
options = [
    {
        tag: "login",
        name: "login",
        path: "/login",
        independent: true,
        template: login
    },
    ...
]

// this options is the routes map and every item is route meta
// routes map is the array
// route meta is the object
// your original router info will add to vuex's state named __router_info__, you can use this.$store.state.__router_info__ to visit the original data
```
**route meta attribute**
<table>
    <tr>
        <th style="width:130px;text-align: center;">Name</th>
        <th style="width:100px;text-align: center;">Type</th>
        <th style="width:100px;text-align: center;">Required</th>
        <th style="width:598px;text-align: center;">Description</th>
    </tr>
    <tr>
        <td style="text-align: center;">tag</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">true</td>
        <td style="text-align: center;">uniq label of the route meta, every route has different tag</td>
    </tr>
    <tr>
        <td style="text-align: center;">name</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">true</td>
        <td style="text-align: center;">the route name, you can visit by this.$route.name</td>
    </tr>
    <tr>
        <td style="text-align: center;">path</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">true</td>
        <td style="text-align: center;">the route path, like "/index", it's same as the vue-router's path</td>
    </tr>
    <tr>
        <td style="text-align: center;">icon</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">if you want to use icon, here is the icon name, if you use iView icon, you should add "ivu-icon-" front of the icon name</td>
    </tr>
    <tr>
        <td style="text-align: center;">template\templates</td>
        <td style="text-align: center;">Object</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">the route matched vue component, if you customize the layout, you may use it, also see https://router.vuejs.org/guide/essentials/named-views.html for who to use "templates"</td>
    </tr>
    <tr>
        <td style="text-align: center;">active</td>
        <td style="text-align: center;">Boolean</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">when you enter the admin, first page you want to see, you can set this option, but you should write the nav logic to implement this function</td>
    </tr>
    <tr>
        <td style="text-align: center;">independent</td>
        <td style="text-align: center;">Boolean</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">if you want this route's component to leave the layout, you can set this attribute, like "/login", this function has been implemented in the nayo-admin-core, the file's path is "src/entrance.vue"</td>
    </tr>
    <tr>
        <td style="text-align: center;">children</td>
        <td style="text-align: center;">Array</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">this is the two level routing, the route's max level of routing is 2</td>
    </tr>
</table>

**Notic: you may need to abide by the rules**
1. if you set independent to true, the icon will not work
2. if you set children, the independent will not work
3. if you set children, the template\templates will not work
3. if you set children, the active will not work, however the active will be work in child route meta

**children route meta attribute**
<table>
    <tr>
        <th style="width:130px;text-align: center;">Name</th>
        <th style="width:100px;text-align: center;">Type</th>
        <th style="width:100px;text-align: center;">Required</th>
        <th style="width:598px;text-align: center;">Description</th>
    </tr>
    <tr>
        <td style="text-align: center;">tag</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">true</td>
        <td style="text-align: center;">the same as parent route meta</td>
    </tr>
    <tr>
        <td style="text-align: center;">name</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">true</td>
        <td style="text-align: center;">the same as parent route meta</td>
    </tr>
    <tr>
        <td style="text-align: center;">path</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">true</td>
        <td style="text-align: center;">if parent route meta's path is "/index", child meta is "/page", finally, the route path will be "/index/page", so, here is only contact the path string, it's same as the vue-router's path</td>
    </tr>
    <tr>
        <td style="text-align: center;">icon</td>
        <td style="text-align: center;">String</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">the same as parent route meta</td>
    </tr>
    <tr>
        <td style="text-align: center;">template\templates</td>
        <td style="text-align: center;">Object</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">the same as parent route meta</td>
    </tr>
    <tr>
        <td style="text-align: center;">active</td>
        <td style="text-align: center;">Boolean</td>
        <td style="text-align: center;">false</td>
        <td style="text-align: center;">the same as parent route meta</td>
    </tr>
</table>

**路由导航守卫**

```
// options struction
options = [
    {
        tag: "login",
        name: "login",
        path: "/login",
        independent: true,
        template: login
    },
    ...
]
// you can intercept routing by setting before and after
// before indicates that when entering the routing
// after means when leaving the routing
// both attributes are arrays that execute functions in turn
// It should be noted that in before, next does not interrupt the execution of the back function
options.before = [
    (to, from, next) => {
        ...
    },
    (to, from, next) => {
        ...
    },
    ...
]

options.after = [
    (to, from) => {
        ...
    },
    (to, from) => {
        ...
    },
    ...
]
```

**The Icon Guide**

if you use the custom icon, here are some ways to create the icon file, and you can @import it in the .vue file, and when you wand to use it, you can write the icon's name in the route config. Remember, to use the icon's class-name, not other type-name.

1. https://www.iconfont.cn
2. https://icomoon.io/app/#/select


- nayo.langRegister(options)    ---> regist the lang options/configs
```
// options struction
options = {
    page_1: {
        en: {
            hello: "hello"
        },
        cn: {
            hello: "你好"
        },
        ...
    },
    page_2: {...}
}

// when you want to use the lang, you can appoint the page to use different language
// by this.$i18n etc... http://kazupon.github.io/vue-i18n/introduction.html
```

- <nayo-admin></nayo-admin>

here is the tag of nayo-admin component, when you use nayo-admin-core, you should write this in the App.vue(the Vue App project entrance file)

the layout component should be used on the <nayo-admin></nayo-admin>
```
<nayo-admin layout="layout_name"></nayo-admin>

// the layout_name should be registed in the main.js, like
Vue.component("layout_name", layout_component);
```

### 6.License
This library is published under the MIT license. See LICENSE for details.
### 7.Reference
- [Vuex Doc](https://vuex.vuejs.org/guide/)
- [Vue-Router Doc](https://router.vuejs.org/installation.html)
- [Vue-i18n Doc](http://kazupon.github.io/vue-i18n/introduction.html)
- [UnderScore Doc](https://underscorejs.org/)
- [Outils Doc](https://www.npmjs.com/package/outils)
- [Js-cookie Doc](https://www.npmjs.com/package/js-cookie)
- [Moment Doc](https://www.npmjs.com/package/moment)
- [Moment-timezone Doc](https://www.npmjs.com/package/moment-timezone)
- [Axios Doc](https://www.npmjs.com/package/axios)