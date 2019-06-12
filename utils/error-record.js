/*
* record error
* */

class Nayo_Error extends Error{
    constructor(message, type) {
        super();
        this._init_error(type);
        this.message = `${message}`;
        if (message instanceof Error) {
            this.message = `${message.message}`;
        }
    }

    _init_error(type) {
        switch (type) {
            case "error":
                this.name = "【Nayo Error】";
                break;
            case "warn":
                this.name = "【Nayo Warn】"
                break;
        }
    }
}

export default (content, type="error") => {
    switch (type) {
        case "error":
            throw new Nayo_Error(content, type);
            break;
        case "warn":
            console.warn(new Nayo_Error(content, type));
            break;
    }
}