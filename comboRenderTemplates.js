/* Basic template scenario - fields->string */
/*
  Partials vs layouts

  Bonsai constructs a tree, and two types of nodes exist in a tree - 
  leaf nodes and non-leaf nodes. We call both of these templates, but
  leaf nodes we call partials, and non-leaf nodes we call layouts.

  Leaf nodes (partials) accept variables but other than that do not nest other 
  content inside of them. 

  Non-leaf nodes (layouts) may accept variables, but mainly they exist to nest
  other nodes, nodes that they do not ever know about. 

  In Rails' templating, a layout uses the yield keyword to mark where other templates
  will be inserted. Since BonsaiKitten is in Javascript, it uses 'this'.

  A partial can be defined to also be a layout. Just refer to 'this', and indicate
  how other content will be applied. A neat suggestion is to append 'this' at the end
  of any template. 

  This makes it so a call to bonsai(data, view1, view2, view3 ) is equivalent to 
  rendering view1/2/3 with the data object and concatenating them. 

  Not having to declare dependencies between views makes it so you can rearrange their
  rendering or nesting in any order.

*/

// Define a partial - notice no reference to 'this'
var namePartial = function(data){
  return "Name: " + data.last + ", " + data.first;
}
var namestr = namePartial({first:"Tom", last:"Sawyer"});
console.clear();
console.log("Name partial with arguments:");
console.log(namePartial.toString());
console.log(namestr);


/* Define bold as a partial (not advised, but possible) */
//
var boldPartial = function(something){
  return "<b>" + something + "</b>";
}
console.clear();
console.log("Bold as a partial with variable 'something':");
console.log(boldPartial.toString());
console.log(boldPartial(namestr));


/* Better, define bold as a layout
   Using 'this' as the implicit argument: */
//
//
boldLayout = function(){
  return "<b>" + this + "</b>";
}

// no longer: boldLayout(namestr) but...
//
var boldname= boldLayout.call(namestr);

console.log("Bold as a layout");
console.log(boldLayout.toString());
console.log(boldname);



/* Putting it all together */
function comboInnerToOuter(data){
  var templates = [].slice.call(arguments, 1);
  var str = "", t;
  templates.forEach(function(t){
    str = t.call(str, data);
  });
  return str;
}

function bonsai(data){
  var templates = [].slice.call(arguments, 1).reverse();
  return comboInnerToOuter.apply([data].concat(templates) );
}

var boldName = comboInnerToOuter(
            {first:"Tom", last:"Sawyer"},
            namePartial,
            boldLayout);

console.clear();
console.log("comboInnerToOuter(data, namePartial, boldLayout)");
console.log(namePartial.toString());
console.log(boldLayout.toString());
console.log(boldName);








