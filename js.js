document.addEventListener("DOMContentLoaded", function(e) {
  createCollapsableList(); //serverside in the future
  createNavSidebar(); //serverside in the future
  createInsertableLinks(); //serverside in the future
  createHeaderPicker();
});

function createCollapsableList() {
  collapsableItems = document.getElementById("top").getElementsByTagName("LI");
  var incrementingId = 0;
  for (var i=0; i < collapsableItems.length; i++) {
    var item = collapsableItems[i];
    insertCollapser(item, incrementingId);
    incrementingId++;
  }
}

function insertCollapser(item, incrementingId) {
  var id = "id" + incrementingId;
  var checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  var minimize = document.createElement("label");
  minimize.for = id;
  minimize.className = "minimize";
  minimize.innerHTML = "[-]";
  var maximize = document.createElement("label");
  maximize.for = id;
  maximize.className = "maximize";
  maximize.innerHTML = "[+]";
  item.insertBefore(maximize, item.firstChild); //lowest
  item.insertBefore(minimize, item.firstChild);
  item.insertBefore(checkbox, item.firstChild); //highest
}

function createInsertableLinks() {
  var ideas = document.getElementsByClassName("idea");
  for (var j=0; j < ideas.length; j++) {
    var insertableItems = ideas[j].getElementsByTagName("LI");
    for (var i=0; i < insertableItems.length; i++) {
      var element = insertableItems[i];
      insertInsertAbove(element);
      if (!hasULChild(element)) {
        var insertBeneath = insertInsertBeneath(element);
        var insertUnder = createInsertUnder(element);
        insertBeneath.appendChild(insertUnder);
        if (!hasElementSibling(element)) {
          var insertBelow = createInsertBelow(element);
          insertBeneath.appendChild(insertBelow);
        }
      }
    }
  }
}

function hasULChild(element) {
  return element.getElementsByTagName("UL").length > 0
}

function hasElementSibling(element) {
  var next = element.nextSibling;
  var hasSibling = false;
  while(next !== null) {
    if(next.nodeType === 1) {
      hasSibling = true;
    }
    next = next.nextSibling;
  }
  return hasSibling;
}

function getItemName(element) {
  var itemName = "Comment";
  if(element.parentNode.className === "idea") {
    itemName = "Idea";
  }
  return itemName;
}

function insertInsertAbove(element) {
  var contentItem = element.getElementsByClassName("content")[0];
  var insertAbove = document.createElement("div");
  insertAbove.innerHTML = "New -->";
  insertAbove.className = "insertAbove";
  insertAbove.addEventListener('click', function() { newInsertAbove(insertAbove) });
  var newElement = element.insertBefore(insertAbove, element.firstChild);
  return newElement;
}

function insertInsertBeneath(element) {
  var insertBeneath = document.createElement("div");
  insertBeneath.className = "insertBeneath";
  var newElement = element.appendChild(insertBeneath);
  return newElement;
}

function createInsertBelow(element) {
  var insertBelow = document.createElement("div");
  insertBelow.className = "insertBelow";
  insertBelow.innerHTML = "New -->";
  insertBelow.addEventListener('click', function() { newInsertBelow(insertBelow) });
  return insertBelow;
}

function createInsertUnder() {
  var insertUnder = document.createElement("div");
  insertUnder.innerHTML = "New -->";
  insertUnder.className = "insertUnder";
  insertUnder.addEventListener('click', function() { newInsertUnder(insertUnder) });
  return insertUnder;
}

function createInsertLi() {
  var newLi = document.createElement("li");
  newLi.className = "insert";
  var textBox = document.createElement("input");
  textBox.type = "text";
  textBox.className = "inlineInput";
  var submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "submit";
  newLi.appendChild(textBox);
  newLi.appendChild(submit);
  return newLi;
}

//TODO! replace ALL this with hidden elements & css trickery!

function newInsertAbove(element) {
  var contaningLi = element.parentNode;
  var newLi = createInsertLi();
  var insertedLi = contaningLi.parentNode.insertBefore(newLi, contaningLi);
  insertedLi.getElementsByTagName("input")[0].focus();
}

function newInsertBelow(element) {
  var contaningLi = element.parentNode.parentNode;
  var newLi = createInsertLi();
  contaningLi.parentNode.insertBefore(newLi, contaningLi.nextSibling);
}

function newInsertUnder(element) {
  //only on ideas/comments? TAKE ARG OF TYPE!
  var contaningLi = element.parentNode.parentNode;
  var child = document.createElement("ul");
  var ulName = contaningLi.parentNode.className;
  var className = "idea";
  if (ulName === "top") {
    className = "category";
  }
  else if (ulName === "category") {
    className = "subcategory";
  }
  else if (ulName === "subcategory") {
    className = "idea";
  }
  else if (ulName === "idea") {
    className = "comment";
  }
  else if (ulName === "comment") {
    className = "comment";
  }
  child.className = className;
  var newLi = createInsertLi();
  child.appendChild(newLi);
  contaningLi.appendChild(child);
}

function createHeaderPicker() {
  var button = document.getElementById("header-submit");
  button.onclick = function() { toggle('category-picker', 'flex') };
  button.value = "+";
  button.type = "button";
  button.id = "header-button";
  var submit = document.getElementById("unused-button");
  submit.id = "header-submit"
  var inputs = document.getElementById("many-inputs");
  inputs = setupManyInputs(inputs);
  //appendChild inputs
}

function setupManyInputs(element) {
  addSelectItem(document.getElementById("top"));
}

function addSelectItem(ul) {
  var select = document.createElement("select");
  var lis = ul.children;
  for(var i=0; i < lis.length; i++) {
    var liText = lis[i].getElementsByClassName("content")[0].childNodes[0].nodeValue;
    var option = document.createElement("option");
    option.innerHTML = liText;
    select.appendChild(option);
    //option.value = UNIQUEID <- must have!
  }
  document.getElementById("many-inputs").appendChild(select);
}

function toggle(id, display) {
  var element = document.getElementById(id);
  var main = document.getElementById("main");
  var button = document.getElementById("header-button");
  if(element.style.display === "none" || element.style.display === "") {
    element.style.display = display;
    main.style.marginTop = "7.1rem";
    button.value = "-";
  }
  else {
    element.style.display = "none";
    main.style.marginTop = "5rem";
    button.value = "+";
  }
}

function createNavSidebar() {

}
