/*
*  the class for helping lang deal with path problem
* */
import { error_logger } from "./index";
import _ from "underscore";

class LangUtils {

    arrange_lang(obj) {
        if (Object.prototype.toString.call(obj) != "[object Object]") {
            error_logger(`the lang's config should be Object!`);
        } else {
            try {
                let _temp = {};
                let _key_info_1 = Object.keys(obj);
                let _key_info_2 = [];
                for (let page of _key_info_1) {
                    _key_info_2.push(Object.keys(obj[page]));
                }
                _key_info_2 = _.uniq(_.flatten(_key_info_2));
                for (let lang_key of _key_info_2) {
                    _temp[lang_key] = {};
                    for (let page of _key_info_1) {
                        _temp[lang_key][page] = {};
                        if (obj[page][lang_key]) {
                            if (Object.prototype.toString.call(obj[page][lang_key]) != "[object Object]") {
                                error_logger(`the ${page}'s lang.config - ${lang_key} is wrong, please check!`);
                            }
                            if (!_.isEmpty(obj[page][lang_key])) {
                                _temp[lang_key][page] = obj[page][lang_key];
                            }
                        }
                    }
                }
                return _temp;
            } catch (e) {
                error_logger(e);
            }
        }
    }
}

export default LangUtils;