(function(dust){
(function(){dust.register("index.dust",body_0);var blocks={"bodyContent":body_1};function body_0(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.partial("layout.dust",ctx,null);}function body_1(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<table><tr><th>ID</th><th>TIME</th><th>Readning</th><th>Value</th></tr>").section(ctx.get(["IRTemperatureData"], false),ctx,{"block":body_2},null).write("</table>");}function body_2(chk,ctx){ctx=ctx.shiftBlocks(blocks);return chk.write("<tr><td>").reference(ctx.get(["sensorTagId"], false),ctx,"h").write("</td><td>{").reference(ctx.get(["dateStr"], false),ctx,"h").write("</td><td>").reference(ctx.get(["cname"], false),ctx,"h").write("</td><td>").reference(ctx.getPath(false, ["value","objectTemp"]),ctx,"h").write("</td></tr>");}return body_0;})();
(function(){dust.register("layout.dust",body_0);function body_0(chk,ctx){return chk.notexists(ctx.get(["pushstate"], false),ctx,{"block":body_1},null).block(ctx.getBlock("pageHeader"),ctx,{},null).block(ctx.getBlock("bodyContent"),ctx,{"block":body_2},null).notexists(ctx.get(["pushstate"], false),ctx,{"block":body_3},null);}function body_1(chk,ctx){return chk.write("<!DOCTYPE html><html xmlns=\"http://www.w3.org/1999/xhtml\"xmlns:fb=\"http://ogp.me/ns/fb#\"><head><title>").reference(ctx.get(["siteTitle"], false),ctx,"h").write("</title><meta charset=\"utf-8\" /><meta http-equiv=\"X-UA-Compatible\" content=\"IE=edge,chrome=1\" /><meta property=\"og:title\" content=\"").reference(ctx.get(["siteTitle"], false),ctx,"h").write("\" /><meta name=\"viewport\" content=\"width=320 initial-scale=1.0, maximum-scale=1.0, user-scalable=no\" /><link type=\"text/css\" rel=\"stylesheet\" media=\"all\" href=\"/css/app.min.css\" /></head><body><div id=\"app\">");}function body_2(chk,ctx){return chk;}function body_3(chk,ctx){return chk.write("</div><script type=\"text/javascript\" src=\"/js/app.min.js\"></script></body></html>");}return body_0;})();
})(typeof exports !== 'undefined' ? module.exports = require('dustjs-linkedin') : dust);