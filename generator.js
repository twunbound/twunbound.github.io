

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
var last = null;

var lists = [];
items.forEach(function(item,ind){
  item.truncate = truncate;
  item.tag_ary = item.tags.split(",");

  if(item.index < 10){
    item.sn = "00"+item.index;
  }else if(item.index < 100){
    item.sn = "0"+item.index;
  }

  if(item.id){
    if(item.fanstitle == null){
      item.fanstitle = item.name;
    }

    item.donate_name = item.donate_name || item.name;

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
  }

  if(item.prev == null && last != null){
    item.prev = {
      title:last.title,
      id:last.id
    };
  }

  if(item.next == null ){
    if(items[ind+1] != null && ! item.ignore ){
      item.next = {
        title:items[ind+1].wait ? items[ind+1].name:items[ind+1].title,
        id:items[ind+1].id,
        wait:items[ind+1].wait
      };
    }
  }else if(item.next.wait == false ){
    item.next = {
      title:items[ind+1].title,
      id:items[ind+1].id
    };
  }

  if(item.id){
    var html = jade.renderFile('temp/user.jade', item);
    fs.writeFileSync("view/"+item.id+".html", html);
  }

  lists.push(item);

  last = item;
});

var html = jade.renderFile('temp/index.jade', {items:lists.filter(function(i){
  return i.ignore == null || !i.ignore;
})});
fs.writeFileSync("index.html", html);


var html = jade.renderFile('temp/index.jade', {items:lists.map(function(i){
  i.wait = false;
  return i;
})});
fs.writeFileSync("index_full.html", html);


var html = jade.renderFile('temp/sitemap.jade', {items:lists});
fs.writeFileSync("sitemap.xml", html);

/*

  */

