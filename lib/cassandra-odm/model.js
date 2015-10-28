var QueryBuilder = require('./query-builder');

module.exports = function (tableName, schema, client) {
    function Model(obj) {
        for (var item in obj) {
            this[item.toLowerCase()] = obj[item];
        }
    }

    Model.client = client;

    for (var staticFunc in schema.statics) {
        Model[staticFunc] = function () {
            schema.statics[staticFunc].apply(Model, arguments);
        };
    }

    for (var method in schema.methods) {
        Model.prototype[method] = function () {
            schema.methods[method].apply(this, arguments);
        };
    }

    Model.getSelectQuery = function () {
        return new QueryBuilder(tableName, schema).select();
    };

    Model.prototype.getInsertQuery = function () {
        var queryBuilder = new QueryBuilder(tableName, schema);
        var obj = {};

        for (var itemName in this) {
            var item = this[itemName];
            if (schema.obj[itemName]) {
                var propName = itemName.toLowerCase();
                obj[propName] = item;
            }
        }

        var query = queryBuilder.insert(obj).toQueryString();

        return query;
    };

    return Model;
};
