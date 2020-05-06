import { ROOT_CSS } from '../root.css';

export const STYLE_CSS = `@charset "UTF-8";

body, html {
  margin: 0;
  /* width: 100%; */
}

/* TOC */
#toc_container {
  background: #f9f9f9 none repeat scroll 0 0;
  border: 1px solid #aaa;
  font-size: 95%;
  margin-bottom: 1em;
  padding: 20px;
}

#toc_container #toc_title {
  font-weight: 700;
  text-align: center;
}

#toc_container li, 
#toc_container ol, 
#toc_container ol li{
  list-style: outside none none;
}

#toc_container ol li {
  margin: 5px 0;
}

` + ROOT_CSS;