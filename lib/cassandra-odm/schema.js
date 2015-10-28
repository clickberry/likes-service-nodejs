function Schema(obj) {
    if (!(this instanceof Schema)) {
        return new Schema(obj);
    }

    this.obj = {};
    this.statics = {};
    this.methods = {};

    for (var itemName in obj) {
        var item = obj[itemName];
        this.obj[itemName.toLowerCase()] = item;
    }
}

module.exports = Schema;