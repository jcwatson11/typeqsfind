"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhereTranslator = void 0;
var typeorm_1 = require("typeorm");
var dot_object_1 = __importDefault(require("dot-object"));
var WhereTranslator = /** @class */ (function () {
    function WhereTranslator() {
    }
    WhereTranslator.setNestedFieldValues = function (fieldName, value) {
        if (fieldName === '' && Array.isArray(value)) {
            this.wheres = value;
        }
        if (fieldName.indexOf('.') !== -1) {
            var obj = {};
            var firstName = fieldName.split('.')[0];
            obj[fieldName] = value;
            dot_object_1.default.object(obj);
            this.wheres[firstName] = obj[firstName];
        }
        else {
            this.wheres[fieldName] = value;
        }
    };
    // orwhereField helper
    WhereTranslator.OrWhere = function (fieldName, values) {
        var parts = fieldName.split('.');
        var field = parts.pop();
        var ret = values.map(function (val) {
            var ob = {};
            ob[field] = val;
            return ob;
        });
        return ret;
    };
    ;
    WhereTranslator.translate = function (req, options) {
        // Begin processing WHERE options
        this.wheres = {};
        // Loop through request looking for where-type operators
        for (var name in req.query) {
            // Process whereField
            if (name.indexOf('orwhere') === 0) {
                var fieldName = name.replace(/^orwhere/, '');
                var value = req.query[name].map(function (value) { return value.toString(); });
                this.setNestedFieldValues('', this.OrWhere(fieldName, value));
            }
            // Process whereField
            if (name.indexOf('where') === 0) {
                var fieldName = name.replace(/^where/, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, value);
            }
            // Process inarrayField
            if (name.indexOf('inarray') === 0) {
                var fieldName = name.replace(/^inarray/, '');
                var value = req.query[name].map(function (value) { return value.toString(); });
                this.setNestedFieldValues(fieldName, typeorm_1.In(value));
            }
            // Process notinarrayField
            if (name.indexOf('notinarray') === 0) {
                var fieldName = name.replace(/^notinarray/, '');
                var value = req.query[name].map(function (value) { return value.toString(); });
                this.setNestedFieldValues(fieldName, typeorm_1.Not(typeorm_1.In(value)));
            }
            // Process isnullField
            if (name.indexOf('isnull') === 0) {
                var fieldName = name.replace(/^isnull/, '');
                this.setNestedFieldValues(fieldName, typeorm_1.IsNull());
            }
            // Process isnullField
            if (name.indexOf('isnotnull') === 0) {
                var fieldName = name.replace(/^isnotnull/, '');
                this.setNestedFieldValues(fieldName, typeorm_1.Not(typeorm_1.IsNull()));
            }
            // Process betweenField
            if (name.indexOf('between') === 0) {
                var fieldName = name.replace(/^between/, '');
                var value = req.query[name].map(function (value) { return value.toString(); });
                this.setNestedFieldValues(fieldName, typeorm_1.Between(value[0], value[1]));
            }
            // Process likeField
            if (name.indexOf('like') === 0) {
                var fieldName = name.replace(/^like/, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, typeorm_1.Like(value));
            }
            // Process likeField
            if (name.indexOf('ilike') === 0) {
                var fieldName = name.replace(/^ilike/, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, typeorm_1.ILike(value));
            }
            // Process greaterthanField
            var gtMatcher = /^greaterthan(?!orequalto)/;
            if (name.match(gtMatcher)) {
                var fieldName = name.replace(gtMatcher, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, typeorm_1.MoreThan(value));
            }
            // Process greaterthanorequaltoField
            var gteMatcher = /^greaterthanorequalto/;
            if (name.match(gteMatcher)) {
                var fieldName = name.replace(gteMatcher, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, typeorm_1.MoreThanOrEqual(value));
            }
            // Process lessthanField
            var ltMatcher = /^lessthan(?!orequalto)/;
            if (name.match(ltMatcher)) {
                var fieldName = name.replace(ltMatcher, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, typeorm_1.LessThan(value));
            }
            // Process lessthanorequaltoField
            var lteMatcher = /^lessthanorequalto/;
            if (name.match(lteMatcher)) {
                var fieldName = name.replace(lteMatcher, '');
                var value = req.query[name].toString();
                this.setNestedFieldValues(fieldName, typeorm_1.LessThanOrEqual(value));
            }
        }
        // Set the wheres
        if (Object.keys(this.wheres).length !== 0) {
            options.where = this.wheres;
        }
    };
    return WhereTranslator;
}());
exports.WhereTranslator = WhereTranslator;
//# sourceMappingURL=WhereTranslator.js.map