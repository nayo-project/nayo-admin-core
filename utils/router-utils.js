/*
* the class for helping router deal with path problem
* */
import { error_logger } from "./index";
import pathToRegexp from "path-to-regexp";

class RouterUtils {

    _check_every_router_config(router_meta) {
        try {
            let _required_arr = ["name", "path", "tag"];
            let _not_required_arr = ["icon", "children", "template", "templates", "active", "independent"];
            // required
            for (let _key of _required_arr) {
                if (!Object.keys(router_meta).includes(_key)) {
                    error_logger(`the router config meta key ${_key} should be contained!`);
                    continue;
                }
                switch (_key) {
                    case "name":
                        if (Object.prototype.toString.call(router_meta[_key]) != "[object String]") {
                            error_logger(`the router config meta key ${_key} should be the String!`);
                        }
                        break;
                    case "path":
                        if (Object.prototype.toString.call(router_meta[_key]) != "[object String]") {
                            error_logger(`the router config meta key ${_key} should be the String!`);
                        }
                        break;
                    case "tag":
                        if (Object.prototype.toString.call(router_meta[_key]) != "[object String]") {
                            error_logger(`the router config meta key ${_key} should be the String!`);
                        }
                        break;
                }
            }
            // not required
            for (let _key of Object.keys(router_meta)) {
                if (_not_required_arr.includes(_key)) {
                    switch (_key) {
                        case "icon":
                            if (Object.prototype.toString.call(router_meta[_key]) != "[object String]") {
                                error_logger(`the router config meta key ${_key} should be the String!`);
                            }
                            break;
                        case "children":
                            if (Object.prototype.toString.call(router_meta[_key]) != "[object Array]") {
                                error_logger(`the router config meta key ${_key} should be the Array!`);
                            }
                            if (router_meta[_key].length == 0 && !router_meta["template"]) {
                                error_logger(`the router config meta should have the key-template!`);
                            }
                            let _childrens_required_arr = ["name", "path", "tag"];
                            let _childrens_not_required_arr = ["icon", "template", "templates", "active"];
                            for (let _children of router_meta[_key]) {
                                 for (let _key of _childrens_required_arr) {
                                     if (!Object.keys(_children).includes(_key)) {
                                         error_logger(`the router meta[name: ${router_meta["name"]}] children router meta key ${_key} should be contained!]`);
                                         continue;
                                     }
                                     switch (_key) {
                                         case "name":
                                             if (Object.prototype.toString.call(_children[_key]) != "[object String]") {
                                                 error_logger(`the router meta[name: ${router_meta["name"]}] children router meta key ${_key} should be String!]`);
                                             }
                                             break;
                                         case "path":
                                             if (Object.prototype.toString.call(_children[_key]) != "[object String]") {
                                                 error_logger(`the router meta[name: ${router_meta["name"]}] children router meta key ${_key} should be String!]`);
                                             }
                                             break;
                                         case "tag":
                                             if (Object.prototype.toString.call(_children[_key]) != "[object String]") {
                                                 error_logger(`the router meta[name: ${router_meta["name"]}] children router meta key ${_key} should be String!]`);
                                             }
                                             break;
                                     }
                                 }
                                 for (let _key of Object.keys(_children)) {
                                     if (_childrens_not_required_arr.includes(_key)) {
                                         switch (_key) {
                                             case "icon":
                                                 if (Object.prototype.toString.call(_children[_key]) != "[object String]") {
                                                     error_logger(`the router meta[name: ${router_meta["name"]}] children router meta key ${_key} should be String!]`);
                                                 }
                                                 break;
                                             case "active":
                                                if (Object.prototype.toString.call(_children[_key]) != "[object Boolean]") {
                                                    error_logger(`the router meta[name: ${router_meta["name"]}] children router meta key ${_key} should be Boolean!]`);
                                                }
                                                break;
                                         }
                                     }
                                 }
                            }
                            break;
                        case "active":
                            if (Object.prototype.toString.call(router_meta[_key]) != "[object Boolean]") {
                                error_logger(`the router config meta key ${_key} should be the Boolean!`);
                            }
                            break;
                        case "independent":
                            if (Object.prototype.toString.call(router_meta[_key]) != "[object Boolean]") {
                                error_logger(`the router config meta key ${_key} should be the Boolean!`);
                            }
                            break;
                    }
                }
            }
        } catch (e) {
            error_logger(e)
        }
    }

    _wrap_intercept(fun) {
        return (to, from, next) => {
            fun(to, from, next);
        }
    }

    _check_config_format(config) {
        try {
            if (Object.prototype.toString.call(config) != "[object Object]") {
                error_logger("router config should be the Object!");
            }
            // routers
            if (config.routers) {
                if (Object.prototype.toString.call(config.routers) != "[object Array]") {
                    error_logger("router config groups should be the Object!");
                }
                for (let _router_item of config.routers) {
                    this._check_every_router_config(_router_item);
                }
            }
        } catch (e) {
            error_logger(e)
        }
    }

    gen_routers(config) {
        try {
            let _router_info = [];
            this._check_config_format(config);
            for (let _router of config.routes) {
                let _temp_1 = {};
                let _path = `${_router.path}`;
                // contain children
                if (Object.keys(_router).includes("children")) {
                    for (let _child of _router.children) {
                        let _temp_2 = {};
                        _temp_2.props = {};
                        _temp_2.path = `${_path}${_child.path}`;
                        if (Object.keys(_child).includes("templates")) {
                            _temp_2.components = _child.templates;
                        }
                        if (Object.keys(_child).includes("template")) {
                            _temp_2.component = _child.template;
                        }
                        _temp_2.name = _child.name;
                        _temp_2.props.page_name = _child.name;
                        _temp_2.props.independent = false;
                        _router_info.push(_temp_2);
                    }
                } else {  // no contain children
                    _temp_1.props = {};
                    _temp_1.path = _path;
                    _temp_1.name = _router.name;
                    if (_router.independent) {
                        _temp_1.components = {"nayoIndependent": _router.template};
                    } else {
                        if (Object.keys(_router).includes("templates")) {
                            _temp_1.components = _router.templates;
                        }
                        if (Object.keys(_router).includes("template")) {
                            _temp_1.component = _router.template;
                        }
                    }
                    _temp_1.props.page_name = _router.name;
                    _temp_1.props.independent = _router.independent ? true : false;
                    _router_info.push(_temp_1);
                }
            }
            return _router_info;
        } catch (e) {
            error_logger(e);
        }
    }

    format_router_info(config) {
        try {
            this._check_config_format(config);
            for (let _route_mate of config.routes) {
                if (_route_mate.children) {
                    // contain children
                    let _path = _route_mate.path;
                    for (let _child of _route_mate.children) {
                        let _child_path = `${_path}${_child.path}`;
                        _child["pathReg"] = pathToRegexp(_child_path);
                    }
                } else {
                    // not contain children
                    _route_mate["pathReg"] = pathToRegexp(_route_mate["path"]);
                }
            }
        } catch (e) {
            error_logger(e);
        }
    }
}


export default RouterUtils;