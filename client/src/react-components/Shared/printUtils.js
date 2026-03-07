import "./print.css";

export function printText(text) {
  let printRoot = document.getElementById("print-root");
  if (!printRoot) {
    printRoot = document.createElement("div");
    printRoot.id = "print-root";
    document.body.appendChild(printRoot);
  }

  const pre = document.createElement("pre");
  pre.style.cssText = "white-space: pre-wrap; font-family: serif; font-size: 12pt; line-height: 1.6; margin: 0;";
  pre.textContent = text;

  printRoot.innerHTML = "";
  printRoot.appendChild(pre);
  window.print();
  printRoot.innerHTML = "";
}
