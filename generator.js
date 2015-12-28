

var jade = require('jade');
var fs = require("fs");
 
function truncate( value, arg ) {
    var value_arr = value.length;
    if( arg < value_arr ) {
        value = value.substring(0,arg)+"...";
    }
    return value;
}

var items = JSON.parse(fs.readFileSync("data.json"));
// renderFile 

items.forEach(function(item){
  item.truncate = truncate;
  item.tag_ary = item.tags.split(",");

  if(item.index < 10){
    item.sn = "00"+item.index;
  }else if(item.index < 100){
    item.sn = "0"+item.index;
  }

  item.part1_ary = item.part1.split("\n");
  item.part1_ary = item.part1_ary.map(function(item){
    if(item.indexOf("#img:") != -1){
      return {img:true, index:parseInt(item.split("#img:")[1],10), };
    }
    return item;
  });

  item.part2_ary = item.part2.split("\n").map(function(item){
    if(item.indexOf("#img:") != -1){
      return {img:true, index:parseInt(item.split("#img:")[1],10) };
    }
    return item;
  });
  item.part3_ary = item.part3.split("\n").map(function(item){
    if(item.indexOf("#img:") != -1){
      return {img:true, index:parseInt(item.split("#img:")[1],10), };
    }
    return item;
  });
  item.url = 'http://twunbound.github.io/view/'+item.id;

  var html = jade.renderFile('temp/user.jade', item);
  fs.writeFileSync("view/"+item.id+".html", html);
});

