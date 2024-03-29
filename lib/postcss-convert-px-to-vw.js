"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/Converter.ts
var import_css = __toESM(require("css"));
var pxRegExp = /\b(\d+(\.\d+)?)px\b/;
var pxGlobalRegExp = new RegExp(pxRegExp.source, "g");
var defaultConfig = {
  baseSize: { rem: 75, vw: 7.5 },
  precision: 6,
  forceRemProps: ["font", "font-size"],
  keepRuleComment: "no",
  keepFileComment: "pxtoremvw-disable",
  toRem: true,
  toVw: true
};
var PxConverter = class {
  constructor(options = {}) {
    this.config = Object.assign({}, defaultConfig, options);
  }
  convert(cssText) {
    var _a, _b;
    const astObj = import_css.default.parse(cssText);
    const firstRule = astObj.stylesheet.rules[0];
    if (!firstRule)
      return cssText;
    const isDisabled = firstRule.type === "comment" && ((_a = firstRule == null ? void 0 : firstRule.comment) == null ? void 0 : _a.trim()) === this.config.keepFileComment;
    if (isDisabled)
      return cssText;
    this.processRules((_b = astObj == null ? void 0 : astObj.stylesheet) == null ? void 0 : _b.rules);
    return import_css.default.stringify(astObj);
  }
  processRules(rules) {
    rules == null ? void 0 : rules.forEach((rule) => {
      if (rule.type === "media")
        return this.processRules(rule.rules);
      if (rule.type === "keyframes")
        return this.processRules(rule.keyframes);
      if (rule.type !== "rule" && rule.type !== "keyframe")
        return;
      const processDeclarations = (index) => {
        var _a, _b, _c, _d, _e;
        const dec = (_a = rule == null ? void 0 : rule.declarations) == null ? void 0 : _a[index];
        if (!dec)
          return;
        if (dec.type !== "declaration" || !pxRegExp.test((dec == null ? void 0 : dec.value) ?? ""))
          return processDeclarations(index + 1);
        const nextDec = (_b = rule == null ? void 0 : rule.declarations) == null ? void 0 : _b[index + 1];
        const isDisabled = nextDec && nextDec.type === "comment" && ((_c = nextDec == null ? void 0 : nextDec.comment) == null ? void 0 : _c.trim()) === this.config.keepRuleComment;
        if (isDisabled) {
          return processDeclarations(index + 2);
        }
        const sourceValue = (dec == null ? void 0 : dec.value) ?? "";
        if (this.config.toRem) {
          dec.value = this.getCalcValue("rem", sourceValue);
        }
        if (this.config.toVw && ((_d = this.config.forceRemProps) == null ? void 0 : _d.indexOf((dec == null ? void 0 : dec.property) ?? "")) === -1) {
          (_e = rule == null ? void 0 : rule.declarations) == null ? void 0 : _e.splice(index + 1, 0, {
            type: "declaration",
            property: dec.property,
            value: this.getCalcValue("vw", sourceValue)
          });
          processDeclarations(index + 2);
        } else {
          processDeclarations(index + 1);
        }
      };
      processDeclarations(0);
    });
  }
  getCalcValue(targetUnit, sourceValue) {
    const baseSize = this.config.baseSize[targetUnit];
    if (!baseSize)
      return sourceValue;
    return sourceValue.replace(pxGlobalRegExp, ($0, $1) => {
      return `${parseFloat(($1 / baseSize).toFixed(this.config.precision))}${targetUnit}`;
    });
  }
};

// src/index.ts
var px2remvw = (opts = {}) => {
  const plugin = {
    postcssPlugin: "postcss-px-to-remvw",
    Once(root, helper) {
      var _a;
      const converter = new PxConverter(opts);
      const targetCssText = converter.convert(((_a = root.source) == null ? void 0 : _a.input.css) ?? "");
      root.removeAll();
      root.append(helper.postcss.parse(targetCssText));
    }
  };
  return plugin;
};
px2remvw.postcss = true;
var src_default = px2remvw;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=postcss-convert-px-to-vw.js.map