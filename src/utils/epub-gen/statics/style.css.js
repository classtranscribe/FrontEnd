export const OEBPS_STYLE_CSS = `
.epub-author {
  color: #555;
}

.epub-link {
  margin-bottom: 30px;
}

.epub-link a {
  color: #666;
  font-size: 90%;
}

.toc-author {
  font-size: 90%;
  color: #555;
}

.toc-link {
  color: #999;
  font-size: 85%;
  display: block;
}

hr {
  border: 0;
  border-bottom: 1px solid #dedede;
  margin: 60px 10%;
}

.ee-preview-text-con {
  margin: 0 0 20px 0;
  border-bottom: 2px solid transparent;
  width: 100%;
  padding: 10px 0;
  box-sizing: border-box;
}

.ee-preview-text-con.description {
  padding: 10px;
  background-color: rgb(245, 245, 245);
  border-radius: 5px;
}

.ee-preview-text-con img,
.ee-preview-text-con audio,
.ee-preview-text-con video{
  margin: 15px 0;
  max-width: 100%;
  height: auto;
}

.ee-preview-text-con h1,
.ee-preview-text-con h2 {
  padding-left: 0;
}

.ee-preview-text-con p {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  margin: .5em 0;
}

.ee-preview-text-con pre {
  padding: 15px;
  border-radius: 5px;
  background-color: rgb(233, 233, 233);
}

.ee-preview-text-con blockquote {
  padding: 5px 15px;
  border-left: 3px solid rgba(0, 95, 95, 0.418);
  background-color: rgb(236, 243, 243);
  border-radius: 0 5px 5px 0;
  margin-left: 0;
  margin-right: 0;
}

.ee-preview-text-con table {
  border-collapse: collapse;
  width: 100%;
  max-width: 100%;
  overflow: auto;
}

.ee-preview-text-con table, 
.ee-preview-text-con th, 
.ee-preview-text-con td {
  padding: 10px 20px;
  border: 1px solid rgb(209, 209, 209);
  white-space: nowrap;
}

.ee-preview-text-con thead {
  background-color: rgb(240, 240, 240);
}
`