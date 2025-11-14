class CustomHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    const shadow = this.attachShadow({ mode: "open" });

    const title = document.createElement("h1");
    title.textContent = "BLOG";
    title.style.fontSize = "20px";

    const major = document.createElement("h1");
    major.textContent = "Software · Cloud Engineer";
    major.style.fontSize = "16px";
    major.style.fontWeight = "300";
    major.style.color = "#999999";

    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.columnGap = "10px";
    header.style.alignItems = "baseline";
    header.appendChild(title);
    header.appendChild(major);

    shadow.appendChild(header);
  }
}

export { CustomHeader };
