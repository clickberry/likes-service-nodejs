var util = require('util');

var _schema;
module.exports = function (tableName, schema) {
    _schema = schema;

    this.select = function () {
        return new Select(tableName);
    };

    this.insert = function (obj) {
        return new Insert(tableName, obj);
    }
};

var operators = {
    '$gt': function (columnName, value) {
        return columnName + '>' + value;
    },
    '$gte': function (columnName, value) {
        return columnName + '>=' + value;
    },
    '$lt': function (columnName, value) {
        return columnName + '<' + value;
    },
    '$lte': function (columnName, value) {
        return columnName + '<=' + value;
    },
    '$ne': function (columnName, value) {
        return columnName + '!=' + value;
    },
    '$in': function (columnName, values) {
        var keys = values.map(function (value) {
            return convert(columnName, value);
        }).join(',');

        return columnName + ' in (' + keys + ')';
    }
};

function convert(columnName, value) {
    var column = _schema.obj[columnName.toLowerCase()];
    if (column === String) {
        value = "'" + value + "'";
    }

    return value;
}

function BaseQuery(query) {
    this.toQueryString = function () {
        return query;
    }
}

function Insert(tableName, obj) {
    var cols = [];
    var vals = [];
    for (var colName in obj) {
        var value = convert(colName, obj[colName]);
        cols.push(colName);
        vals.push(value);
    }

    var columns = cols.join(',');
    var values = vals.join(',');

    var query = 'insert into ' + tableName + ' (' + columns + ') values (' + values + ')';

    BaseQuery.call(this, query);
}

function Select(tableName) {
    var query = 'select * from ' + tableName;
    this.where = function (params, inKey) {
        return new Where(query, params, inKey);
    };

    BaseQuery.call(this, query);
}

function Where(query, columns) {
    var operations = [];

    for (var columnName in columns) {
        var operation;
        var value = columns[columnName];
        var type = typeof (value);

        if (type === 'object') {
            var operatorName = Object.keys(value)[0];
            var val = value[operatorName];
            var operator = operators[operatorName];
            operation = operator(columnName, val);
        } else {
            operation = columnName + '=' + convert(columnName, value);
        }

        operations.push(operation);
    }

    query += ' where ' + operations.join(' and ');

    this.orderBy = function (columns) {
        return new OrderBy(query, columns);
    };

    this.limit = function (val) {
        return new Limit(query, val);
    };

    BaseQuery.call(this, query);
}

function OrderBy(query, columns) {
    var colums = [];

    for (var columnName in columns) {
        var value = columns[columnName];
        colums.push(columnName + ' ' + value);
    }

    query += ' order by ' + colums.join(',');

    this.limit = function (val) {
        return new Limit(query, val);
    };

    BaseQuery.call(this, query);
}

function Limit(query, val) {
    query += ' limit ' + val;

    this.limit = function (val) {
        return new Limit(query, val);
    };

    BaseQuery.call(this, query);
}

util.inherits(Select, BaseQuery);
util.inherits(Where, BaseQuery);
util.inherits(OrderBy, BaseQuery);
util.inherits(Limit, BaseQuery);
util.inherits(Insert, BaseQuery);