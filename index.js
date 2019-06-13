// documents
// https://www.npmjs.com/package/vue-i18n
// https://www.npmjs.com/package/axios
// https://www.npmjs.com/package/outils
// https://underscorejs.org/#
// http://momentjs.cn/docs/
// http://momentjs.cn/timezone/docs/
import iView from "iview";
import "iview/dist/styles/iview.css";
import Vuex from "vuex";
import vueRouter from "vue-router";
import VueI18n from "vue-i18n";
import {error_logger, LangUtils, RouterUtils} from "./utils";
import entrance from "./src/entrance";

import moment from "moment";
import momentTz from "moment-timezone";
import _ from "underscore";
import outils from "outils";
import axios from "axios";
import Cookie from "js-cookie";

import { app_entrance_temp, instance, default_options, options_in, __deal_with_options, __add_router_listen, __init_nayo_vue, __init_vue_by_options, __init_vue } from "./src/symbol";

let __version__ = "1.0.0";
let __author__ = "Terence.Sun";
let __email__ = "terence@segofun.com";

let Vue = null;
let install_status = false;
// load the iView
window.$iView = iView;
// load the nayo
window.$nayo = {
    utils: {
        underScore: _,
        outils: outils,
        cookie: Cookie
    },
    time: {
        moment: moment,
        momentTz: momentTz
    },
    axios: axios
}

class nayoAdmin {
    /*options = {
        vuex: {},
        router: {},
        lang: {}
    }*/
    constructor (app_entrance, options={}) {
        if (!install_status) {
            error_logger("Vue.use() should be done before new nayoAdmin!");
        }
        this.admin = null;
        this[app_entrance_temp] = app_entrance;
        this[instance] = {
            vuex: null,
            router: null,
            lang: null
        };
        // default options
        this[default_options] = {
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
        this[options_in] = this[__deal_with_options](options);
        this[__init_nayo_vue]();
    }

    /*
    * deal with the options
    * @param options <Object>
    * @return options <Object>
    * */
    [__deal_with_options](options) {
        // router --> routes
        // vuex --> state actions mutations modules
        // lang --> message
        if (Object.prototype.toString.call(options) != "[object Object]") {
            error_logger("the core options should be Object")
        }
        let _special_attr = {
            router: [ "routes" ],
            vuex: [ "state", "actions", "mutations", "modules" ],
            lang: [ "messages" ]
        }
        if (options) {
            let _keys = _.keys(this[default_options]);
            for (let _key of _keys) {
                if (!options[_key] || _.isEmpty(options[_key])) {
                    options[_key] = this[default_options][_key];
                } else {
                    // exist
                    for (let _option_key of _.keys(options[_key])) {
                        if (_special_attr[_key].includes(_option_key)) {
                            delete options[_key][_option_key];
                        }
                    }
                    options[_key] = _.defaults(options[_key], this[default_options][_key]);
                    // router
                    /*if (_key == "router") {
                        for (let _option_key of _.keys(options[_key])) {
                            if (_special_attr[_key].includes(_option_key)) {
                                // contain
                                let _temp = [ ...options[_key][_option_key] ];
                                options[_key][_option_key] = _temp;
                            } else {
                                options[_key][_option_key] = this[default_options][_key][_option_key];
                            }
                        }
                    } else {
                        for (let _option_key of _.keys(options[_key])) {
                            if (_special_attr[_key].includes(_option_key)) {
                                delete options[_key][_option_key];
                            }
                        }
                        options[_key] = _.defaults(options[_key], this[default_options][_key]);
                    }*/
                }
            }
        } else {
            options = this[default_options];
        }
        // deal with the vuex
        options.vuex.state["__router_info__"] = [];
        return options;
    }

    /*
    * add router listen
    * */
    [__add_router_listen]() {
        // listener
        if (this[options_in].vuex.state.__router_info__.before && this[options_in].vuex.state.__router_info__.before.length != 0) {
            this[instance].router.beforeEach((to, from, next) => {
                // load global intercept
                if (Object.keys(this[options_in].vuex.state.__router_info__).includes("before")) {
                    if (Object.prototype.toString.call(this[options_in].vuex.state.__router_info__.before) != "[object Array]") {
                        throw new Error("Global Intercept-before should be Array!")
                    }
                    for (let intercept of this[options_in].vuex.state.__router_info__.before) {
                        intercept(to, from, next);
                    }
                }
            });
        }

        if (this[options_in].vuex.state.__router_info__.after && this[options_in].vuex.state.__router_info__.after.length != 0) {
            this[instance].router.afterEach((to, from) => {
                if (Object.keys(this[options_in].vuex.state.__router_info__).includes("after")) {
                    if (Object.prototype.toString.call(this[options_in].vuex.state.__router_info__.after) != "[object Array]") {
                        throw new Error("Global Intercept-before should be Array!")
                    }
                    for (let intercept of this[options_in].vuex.state.__router_info__.after) {
                        intercept(to, from);
                    }
                }
            });
        }
    }

    /*
    * init nayo vue
    * */
    [__init_nayo_vue]() {
        Vue.use(iView);
        Vue.use(Vuex);
        Vue.use(vueRouter);
        Vue.use(VueI18n);
        this[__init_vue]();
    }

    /*
    * init vue via options
    * */
    [__init_vue_by_options]() {
        this.admin = new Vue({
            i18n: this[instance].lang,
            router: this[instance].router,
            store: this[instance].vuex,
            render: h => h(this[app_entrance_temp])
        });
    }

    /*
    * refresh vue
    * */
    [__init_vue]() {
        this[instance].vuex = new Vuex.Store(this[options_in].vuex);
        this[instance].router = new vueRouter(this[options_in].router);
        this[instance].lang = new VueI18n(this[options_in].lang);
        this[__add_router_listen]();
        this[__init_vue_by_options]();
    }

    // the register only work by the latest one
    /*
    * regist the vuex rule and data
    * @param options <Object>
    * */
    storeRegister(options) {
        if (!options) {
            error_logger("register options type error");
        }
        for (let _key of _.keys(options)) {
            if (_key == "state") {
                let _temp = {
                    __router_info__: this[options_in]["vuex"][_key]["__router_info__"]
                }
                this[options_in]["vuex"][_key] = options[_key];
                this[options_in]["vuex"][_key]["__router_info__"] = _temp["__router_info__"];
            } else {
                this[options_in]["vuex"][_key] = options[_key];
            }
        }
        this[__init_vue]();
    }

    /*
    * regist the route rule and data
    * @param options <Object>
    * */
    routerRegister(options) {
        if (!options) {
            error_logger("register options type error");
        }
        let _route_hand = new RouterUtils();
        _route_hand.format_router_info({routes: options});
        this[options_in].vuex.state["__router_info__"] = options;
        this[options_in].router.routes = _route_hand.gen_routers({routes: options});
        this[__init_vue]();
    }

    /*
    * regist the lang rule and data
    * @param options <Object>
    * */
    langRegister(options) {
        if (!options) {
            error_logger("register options type error");
        }
        let _lang_hand = new LangUtils();
        this[options_in].lang.messages = _lang_hand.arrange_lang(options);
        this[__init_vue]();
    }
}

nayoAdmin.install = function install(_Vue) {
    Vue = _Vue;
    Vue.prototype.$nayo = {
        utils: {
            underScore: _,
            outils: outils,
            cookie: Cookie
        },
        time: {
            moment: moment,
            momentTz: momentTz
        },
        axios: axios
    }
    Vue.mixin({
        components: {
            "nayo-admin": entrance
        }
    });
    install_status = true;
};

nayoAdmin.version = __version__;

export default nayoAdmin;
