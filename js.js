document.addEventListener("DOMContentLoaded", function(e) {
  createCollapsableList(); //serverside in the future
  createNavSidebar(); //serverside in the future
  createInsertableLinks(); //serverside in the future
  createHeaderPicker();
});

function createCollapsableList() {
  //serverside
  collapsableItems = document.getElementById("top").getElementsByTagName("LI");
  var incrementingId = 0;
  for (var i=0; i < collapsableItems.length; i++) {
    item = collapsableItems[i];
    myLabel = "<input type='checkbox' id='id$'><label for='id$' class='minimize'>[-]</label><label for='id$' class='maximize'>[+]</label>";
    customLabel = myLabel.replace(/\$/g, incrementingId);
    item.innerHTML = customLabel + item.innerHTML;
    incrementingId++;
  }
}

//unused - will have no ability to edit (unless admin)
function createEditableItems() {
  editableItems = document.getElementsByClassName("editable");
  for (var i=0; i < editableItems.length; i++) {
    contentItem = editableItems[i].getElementsByClassName("content")[0];
    contentItem.innerHTML += "<span class='edit'>edit</span><span class='delete'>delete</span>";
  }
}

function createInsertableLinks() {
  insertableItems = document.getElementById("top").getElementsByTagName("LI");
  for (var i=0; i < insertableItems.length; i++) {
    element = insertableItems[i];
    contentItem = insertableItems[i].getElementsByClassName("content")[0];
    contentItem.innerHTML += "<div class='insertAbove' onclick=\"insertAbove(this)\"></div>";
    if (!hasULChild(element)) {
      contentItem.innerHTML += "<div class='insertUnder' onclick=\"insertUnder(this)\"></div>";
      if (!hasElementSibling(element)) {
        contentItem.innerHTML += "<div class='insertBelow' onclick=\"insertBelow(this)\"></div>";
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

function insertAbove(element) {
  contaningLi = element.parentNode.parentNode;
  newLi = createInsertLi();
  contaningLi.parentNode.insertBefore(newLi, contaningLi);
}

function insertBelow(element) {
  contaningLi = element.parentNode.parentNode;
  newLi = createInsertLi();
  contaningLi.parentNode.insertBefore(newLi, contaningLi.nextSibling);
}

function insertUnder(element) {
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
