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
    item = collapsableItems[i];
    insertCollapser(item, incrementingId);
    incrementingId++;
  }
}

function insertCollapser(item, incrementingId) {
  id = "id" + incrementingId;
  checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = id;
  minimize = document.createElement("label");
  minimize.for = id;
  minimize.className = "minimize";
  minimize.innerHTML = "[-]";
  maximize = document.createElement("label");
  maximize.for = id;
  maximize.className = "maximize";
  maximize.innerHTML = "[+]";
  item.insertBefore(maximize, item.firstChild); //lowest
  item.insertBefore(minimize, item.firstChild);
  item.insertBefore(checkbox, item.firstChild); //highest
}

function createInsertableLinks() {
  ideas = document.getElementsByClassName("idea");
  for (var j=0; j < ideas.length; j++) {
    insertableItems = ideas[j].getElementsByTagName("LI");
    for (var i=0; i < insertableItems.length; i++) {
      element = insertableItems[i];
      insertInsertAbove(element);
      if (!hasULChild(element)) {
        insertInsertBeneath(element);
        insertUnder = createInsertUnder(element);
        insertBeneath.appendChild(insertUnder);
        if (!hasElementSibling(element)) {
          insertBelow = createInsertBelow(element);
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
  next = element.nextSibling;
  hasSibling = false;
  while(next !== null) {
    if(next.nodeType === 1) {
      hasSibling = true;
    }
    next = next.nextSibling;
  }
  return hasSibling;
}

function getItemName(element) {
  itemName = "Comment";
  if(element.parentNode.className === "idea") {
    itemName = "Idea";
  }
  return itemName;
}

function insertInsertAbove(element) {
  contentItem = element.getElementsByClassName("content")[0];
  insertAbove = document.createElement("div");
  insertAbove.innerHTML = "New -->";
  insertAbove.className = "insertAbove";
  insertAbove.addEventListener('click', function() { newInsertAbove(insertAbove) });
  element.insertBefore(insertAbove, element.firstChild);
}

function insertInsertBeneath(element) {
  insertBeneath = document.createElement("div");
  insertBeneath.className = "insertBeneath";
  element.appendChild(insertBeneath);
}

function createInsertBelow(element) {
  insertBelow = document.createElement("div");
  insertBelow.className = "insertBelow";
  insertBelow.innerHTML = "New -->";
  insertBelow.addEventListener('click', function() { newInsertBelow(insertBelow) });
  return insertBelow;
}

function createInsertUnder() {
  insertUnder = document.createElement("div");
  insertUnder.innerHTML = "New -->";
  insertUnder.className = "insertUnder";
  insertUnder.addEventListener('click', function() { newInsertUnder(insertUnder) });
  return insertUnder;
}

function createInsertLi() {
  newLi = document.createElement("li");
  newLi.className = "insert";
  textBox = document.createElement("input");
  textBox.type = "text";
  submit = document.createElement("input");
  submit.type = "submit";
  submit.value = "submit";
  newLi.appendChild(textBox);
  newLi.appendChild(submit);
  return newLi;
}

//TODO! replace ALL this with hidden elements & css trickery!

function newInsertAbove(element) {
  console.log(element);
  contaningLi = element.parentNode;
  console.log(contaningLi);
  newLi = createInsertLi();
  contaningLi.parentNode.insertBefore(newLi, contaningLi);
}

function newInsertBelow(element) {
  contaningLi = element.parentNode.parentNode;
  newLi = createInsertLi();
  contaningLi.parentNode.insertBefore(newLi, contaningLi.nextSibling);
}

function newInsertUnder(element) {
  //only on ideas/comments? TAKE ARG OF TYPE!
  contaningLi = element.parentNode.parentNode;
  child = document.createElement("ul");
  ulName = contaningLi.parentNode.className;
  className = "idea";
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
  newLi = createInsertLi();
  child.appendChild(newLi);
  contaningLi.appendChild(child);
}

function createHeaderPicker() {
  button = document.getElementById("header-submit");
  button.onclick = function() { toggle('category-picker', 'flex') };
  button.value = "+";
  button.type = "button";
  button.id = "header-button";
  submit = document.getElementById("unused-button");
  submit.id = "header-submit"
  inputs = document.getElementById("many-inputs");
  inputs = setupManyInputs(inputs);
  //appendChild inputs
}

function setupManyInputs(element) {
  addSelectItem(document.getElementById("top"));
}

function addSelectItem(ul) {
  select = document.createElement("select");
  lis = ul.children;
  for(var i=0; i < lis.length; i++) {
    liText = lis[i].getElementsByClassName("content")[0].childNodes[0].nodeValue;
    option = document.createElement("option");
    option.innerHTML = liText;
    select.appendChild(option);
    //option.value = UNIQUEID <- must have!
  }
  document.getElementById("many-inputs").appendChild(select);
}

function toggle(id, display) {
  element = document.getElementById(id);
  main = document.getElementById("main");
  button = document.getElementById("header-button");
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
