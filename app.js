const columns = document.querySelectorAll(".column");

function addEventListeners() {
  document.addEventListener("keydown", getRandomColorsBySpace);

  document.addEventListener("click", (event) => {
    const type = event.target.dataset.type;

    if (type === "lock") {
      toggleLock(event);
    } else if (type === "copy") {
      handleCopyColorToClickboard(event);
    }
  });
}
addEventListeners();

function getRandomColorsBySpace(event) {
  event.preventDefault();
  if (event.code.toLowerCase() === "space") {
    getRandomColors();
  }
}

function toggleLock(event) {
  const node =
    event.target.tagName.toLowerCase() === "i"
      ? event.target
      : event.target.children[0];
  node.classList.toggle("fa-lock");
  node.classList.toggle("fa-lock-open");
}

function handleCopyColorToClickboard(event) {
  copyToClickboard(event.target.textContent);
}

function generateRandomColor() {
  const hex = "0123456789ABCDEF";
  let color = "";
  for (let i = 0; i < 6; i++) {
    color += hex[Math.floor(Math.random() * hex.length)];
  }
  return "#" + color;
}

function getRandomColors(isInitial) {
  const colors = isInitial ? getColorsLink() : [];
  console.log(colors);

  columns.forEach((column, index) => {
    const isLocked = column.querySelector("i").classList.contains("fa-lock");
    const text = column.querySelector("h2");
    const button = column.querySelector("button");
    const color = isInitial
      ? colors[index]
        ? colors[index]
        : generateRandomColor()
      : generateRandomColor();

    if (isLocked) {
      colors.push(text.textContent);
      return;
    }
    if (!isInitial) {
      colors.push(color);
    }

    column.style.background = color;
    text.textContent = color;

    setTextColor(text, color);
    setTextColor(button, color);

    updateColorHash(colors);
  });
}

function setTextColor(text, color) {
  const luminance = chroma(color).luminance();
  text.style.color = luminance > 0.5 ? "black" : "white";
}

function copyToClickboard(text) {
  return navigator.clipboard.writeText(text);
}

function updateColorHash(colors = []) {
  document.location.hash = colors
    .map((color) => {
      return color.toString().substring(1);
    })
    .join("-");
}

function getColorsLink() {
  const hash = document.location.hash;
  if (hash.length > 1) {
    return document.location.hash
      .substring(1)
      .split("-")
      .map((color) => "#" + color);
  }
  return [];
}
getRandomColors(true);
